# Club House Petlandia — Landing Page

Landing page estática para **Club House Petlandia**, guardería, hotel y spa para mascotas en Madrid, Cundinamarca.

---

## Cómo ejecutar

Usa un servidor local para evitar errores con `file://` y el iframe de Google Maps:

```bash
npx serve
```

o

```bash
python -m http.server 8080
```

Luego abre `http://localhost:3000` (o `http://localhost:8080`).

---

## Estructura del proyecto

```
landpagePetlandia/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos
├── js/
│   └── main.js         # Menú móvil, formulario, WhatsApp, flip cards
├── assets/
│   ├── icons/          # Iconos SVG
│   │   ├── whatsapp.svg
│   │   ├── instagram.svg
│   │   ├── facebook.svg
│   │   └── paw.svg
│   └── gallery/        # Imágenes y medios
│       ├── Logo.png
│       ├── Hero.png
│       ├── ClubHouse.png
│       ├── PatioPrincipal.jpeg
│       ├── PetShop.jpg
│       ├── Sala Canina 1.jpeg
│       ├── Sala Canina 2.jpeg
│       ├── Spa.webp
│       ├── Pasadia.mp4
│       └── perro-1.png ... perro-6.png
```

---

## Secciones de la página

| Sección      | Descripción                                           |
|-------------|--------------------------------------------------------|
| **Hero**    | Portada con imagen y CTA de WhatsApp                  |
| **Servicios** | Tarjetas flip: Guardería Canina/Felina, Plan Pasadía (con video), Grooming, Pet Shop, Paseos |
| **Por qué elegirnos** | Filosofía + espacios con imágenes             |
| **Clientes felices** | Galería de mascotas con descripciones manuales   |
| **Reseñas** | Opiniones (manual o API de Google)                    |
| **Contacto** | Formulario + enlace a WhatsApp                        |

---

## Personalización

### Galería "Nuestros Clientes Felices"
- **Imágenes**: Guarda fotos en `assets/gallery/` y actualiza el `src` en cada tarjeta del HTML.
- **Descripciones**: Edita el texto en cada `.gallery-flip__desc`. Usa términos SEO (Madrid, Cundinamarca, guardería, etc.) y tono testimonial.

### Reseñas de Google Maps
- **Manual**: Reemplaza el texto de las tarjetas por reseñas reales.
- **Dinámico**: Requiere API key de Google Cloud (Places API) y Place ID.

### WhatsApp
- Número por defecto en `js/main.js`: `573028574019`. Cambia la constante `WHATSAPP_NUMBER` si hace falta.

---

## Tecnologías

- HTML5
- CSS3 (variables, grid, flexbox, media queries)
- JavaScript (vanilla, sin frameworks)
- Alojamiento estático en **Oracle Cloud Infrastructure (Object Storage)** delante de **Cloudflare** (CDN y caché)

---

## Arquitectura

Vista general: código en GitHub → despliegue automático al bucket OCI → los visitantes llegan por Cloudflare (DNS/proxy/caché), que sirve el origen del bucket.

```mermaid
flowchart LR
  subgraph repo["Repositorio"]
    GH["GitHub\nHTML / CSS / JS / assets"]
  end

  subgraph ci["CI/CD"]
    GA["GitHub Actions\n(push a master)"]
  end

  subgraph cloud["Nube"]
    OCI["OCI Object Storage\nbucket estático\n(petlandia-clubhouse)"]
    CF["Cloudflare\nCDN + caché + DNS"]
  end

  subgraph users["Visitantes"]
    U["Navegador"]
  end

  GH -->|checkout| GA
  GA -->|bulk-upload objetos| OCI
  GA -->|purge_cache API| CF
  U -->|HTTPS| CF
  CF -->|origen / fetch| OCI
```

Resumen estructurado (útil para IA y checklists de infra):

```yaml
# petlandia-landing-architecture — resumen operativo
name: Club House Petlandia Landing
pattern: static_site
runtime: none  # sin servidor de aplicaciones; solo archivos estáticos

repository:
  host: github
  default_branch: master

source_tree:
  entry: index.html
  styles: css/style.css
  scripts: js/main.js
  assets: assets/icons/, assets/gallery/

delivery_pipeline:
  trigger: push_to_master
  ci: github_actions
  workflow: .github/workflows/deploy-landing.yml
  deploy_target:
    provider: oracle_cloud_infrastructure
    service: object_storage
    bucket: petlandia-clubhouse
    namespace: axnplbo9mhwv
  post_deploy:
    - cloudflare_cache_purge  # API zones/:id/purge_cache purge_everything

edge_and_caching:
  provider: cloudflare
  role: dns_proxy_cdn_cache
  cache_invalidation: automated_after_each_deploy

external_integrations:
  - whatsapp_deeplinks  # js/main.js
  - google_maps_iframe  # index.html
```

**Secrets de GitHub Actions (despliegue):** OCI (`OCI_USER_OCID`, `OCI_FINGERPRINT`, `OCI_TENANCY_OCID`, `OCI_REGION`, `OCI_KEY_FILE`).

**Post-despliegue (Cloudflare), elige una opción:**

| Secret | Uso |
|--------|-----|
| `CLOUDFLARE_ZONE_ID` | Obligatorio. *Overview* de la zona en el dashboard de Cloudflare. |
| `CLOUDFLARE_API_TOKEN` | **Recomendado.** API Token con permiso **Zone → Cache Purge → Purge** y recurso de zona **Specific zone** = el dominio de la landing. Crear en [dash.cloudflare.com](https://dash.cloudflare.com/) → perfil → **API Tokens** → *Create Token* (plantilla personalizada). |
| `CLOUDFLARE_API_EMAIL` + `CLOUDFLARE_GLOBAL_API_KEY` | Alternativa legacy: email de la cuenta y **Global API Key** (My Profile → API Keys). El workflow usa `X-Auth-Email` / `X-Auth-Key`; **no** pongas la Global Key en `CLOUDFLARE_API_TOKEN` con `Bearer` (eso provoca **401 Authentication error**). |

### Si el purge falla con HTTP 401 / `Authentication error`

1. **No uses la Global API Key como Bearer.** Debe ser un **API Token** en `Authorization: Bearer`, o bien los dos secrets de email + Global Key como en la tabla.
2. Comprueba que el token tenga **Purge** sobre la **misma** zona que `CLOUDFLARE_ZONE_ID`.
3. Al pegar el token en GitHub → *Secrets*, evita espacios o saltos de línea extra (el workflow recorta bordes, pero no caracteres raros en medio).

Comprobar el token en tu máquina (debe responder `"success": true`):

```bash
curl -sS "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer TU_API_TOKEN"
```

El workflow hace esta misma comprobación **solo** si usas `CLOUDFLARE_API_TOKEN` (no con email + Global API Key).

---

## Contacto

- **Ubicación**: Madrid, Cundinamarca  
- **Instagram**: [@petlandia_clubhouse](https://www.instagram.com/petlandia_clubhouse)  
- **Facebook**: [Petlandia Club House](https://www.facebook.com/p/Petlandia-Club-House-61572618735484/)  
- **WhatsApp**: 302 857 4019  

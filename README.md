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
- Alojamiento estático (Netlify, GitHub Pages, etc.)

---

## Contacto

- **Ubicación**: Madrid, Cundinamarca  
- **Instagram**: [@petlandia_clubhouse](https://www.instagram.com/petlandia_clubhouse)  
- **Facebook**: [Petlandia Club House](https://www.facebook.com/p/Petlandia-Club-House-61572618735484/)  
- **WhatsApp**: 302 857 4019  

/**
 * Petlandia Club House - Main JavaScript
 * Form capture, WhatsApp flow, mobile menu
 */

(function () {
  'use strict';

  const WHATSAPP_NUMBER = '573028574019';

  /**
   * Formats a WhatsApp URL with pre-filled message
   * @param {Object} data - { servicio, nombre, mascota, telefono, email, mensaje }
   * @returns {string} WhatsApp URL
   */
  function initWhatsAppFlow(data = {}) {
    const { servicio = '', nombre = '', mascota = '', telefono = '', email = '', mensaje = '' } = data;
    const servicioLine = servicio ? `Quiero agendar: ${servicio}` : 'Quiero agendar una visita en Club House Petlandia.';
    const text = [
      '¡Hola!',
      servicioLine,
      nombre && `Nombre: ${nombre}`,
      mascota && `Nombre de mi mascota: ${mascota}`,
      telefono && `Teléfono: ${telefono}`,
      email && `Email: ${email}`,
      mensaje && `Mensaje: ${mensaje}`,
    ]
      .filter(Boolean)
      .join('\n');
    const encoded = encodeURIComponent(text);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
  }

  /**
   * Future-proof: swap for OCI Function fetch
   * Uncomment and adapt when API is ready
   */
  // async function submitToAPI(data) {
  //   const response = await fetch('https://your-oci-api-gateway/lead', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(data),
  //   });
  //   return response.json();
  // }

  /**
   * Capture form data as JSON (ready for OCI API Gateway)
   */
  function getFormData(form) {
    const fd = new FormData(form);
    return Object.fromEntries(
      Array.from(fd.entries()).map(([k, v]) => [k, String(v).trim()])
    );
  }

  /**
   * Validación en tiempo real
   */
  function validateNombre(value) {
    const v = (value || '').trim();
    if (v.length < 2) return 'Escribe al menos 2 caracteres';
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(v)) return 'Solo letras y espacios';
    return '';
  }

  function validateTelefono(value) {
    const v = (value || '').replace(/\s/g, '');
    if (!v) return 'El teléfono es obligatorio';
    const digits = v.replace(/\D/g, '');
    if (digits.length < 10) return 'Mínimo 10 dígitos (ej: 300 123 4567)';
    if (digits.length > 15) return 'Número demasiado largo';
    return '';
  }

  function showFieldError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(`error-${inputId}`);
    if (input && errorEl) {
      input.classList.toggle('is-invalid', !!message);
      errorEl.textContent = message || '';
      errorEl.setAttribute('aria-live', message ? 'polite' : 'off');
    }
  }

  function validateForm(form) {
    const nombre = (form.nombre && form.nombre.value) || '';
    const telefono = (form.telefono && form.telefono.value) || '';
    const errNombre = validateNombre(nombre);
    const errTelefono = validateTelefono(telefono);
    showFieldError('nombre', errNombre);
    showFieldError('telefono', errTelefono);
    return !errNombre && !errTelefono;
  }

  /**
   * Open WhatsApp with pre-filled message
   */
  function openWhatsApp(data) {
    const url = initWhatsAppFlow(data);
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function init() {
    // Mobile menu toggle
    const header = document.querySelector('.header');
    const menuBtn = document.querySelector('.header__menu-btn');
    const navLinks = document.querySelectorAll('.nav__link');
    if (menuBtn && header) {
      menuBtn.addEventListener('click', () => {
        const open = header.classList.toggle('nav-open');
        menuBtn.setAttribute('aria-expanded', open);
      });
      // Cerrar menú al hacer clic en un enlace (mejor UX en móvil)
      navLinks.forEach((link) => {
        link.addEventListener('click', () => {
          header.classList.remove('nav-open');
          menuBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Lead form - validación en tiempo real y submit
    const form = document.getElementById('lead-form');
    if (form) {
      const nombreInput = form.querySelector('#nombre');
      const telefonoInput = form.querySelector('#telefono');

      if (nombreInput) {
        nombreInput.addEventListener('input', () => showFieldError('nombre', validateNombre(nombreInput.value)));
        nombreInput.addEventListener('blur', () => showFieldError('nombre', validateNombre(nombreInput.value)));
      }
      if (telefonoInput) {
        telefonoInput.addEventListener('input', () => showFieldError('telefono', validateTelefono(telefonoInput.value)));
        telefonoInput.addEventListener('blur', () => showFieldError('telefono', validateTelefono(telefonoInput.value)));
      }

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateForm(form)) return;
        const data = getFormData(form);
        openWhatsApp(data);
      });
    }

    // Floating WhatsApp CTA
    const floatingCta = document.getElementById('floating-whatsapp');
    if (floatingCta) {
      floatingCta.addEventListener('click', (e) => {
        e.preventDefault();
        openWhatsApp({});
      });
    }

    // Hero CTA
    const ctaWhatsapp = document.getElementById('cta-whatsapp');
    if (ctaWhatsapp) {
      ctaWhatsapp.addEventListener('click', (e) => {
        e.preventDefault();
        openWhatsApp({});
      });
    }

    // Footer WhatsApp
    const footerWhatsapp = document.getElementById('footer-whatsapp');
    if (footerWhatsapp) {
      footerWhatsapp.href = initWhatsAppFlow({});
      footerWhatsapp.addEventListener('click', (e) => {
        e.preventDefault();
        openWhatsApp({});
      });
    }

    // Flip cards - Service cards (clic y teclado)
    document.querySelectorAll('.card-flip').forEach((el) => {
      el.addEventListener('click', (e) => {
        if (e.target.closest('.btn-agendar')) return;
        el.classList.toggle('card-flip--flipped');
      });
      el.addEventListener('keydown', (e) => {
        if (e.target.closest('.btn-agendar')) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.classList.toggle('card-flip--flipped');
        }
      });
    });

    // Flip cards - Gallery (client) cards (clic y teclado)
    document.querySelectorAll('.gallery-flip').forEach((el) => {
      el.addEventListener('click', () => {
        el.classList.toggle('gallery-flip--flipped');
      });
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.classList.toggle('gallery-flip--flipped');
        }
      });
    });

    // Agendar buttons in card backs - open WhatsApp with service-specific message
    document.querySelectorAll('.btn-agendar').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const servicio = btn.getAttribute('data-servicio') || '';
        openWhatsApp({ servicio });
      });
    });
  }

  // Expose for future OCI Function swap
  window.Petlandia = window.Petlandia || {};
  window.Petlandia.initWhatsAppFlow = initWhatsAppFlow;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/*====================ENCABEZADO====================
SCRIPT: script — comportamiento del portfolio DenDEV
ARCHIVO: js/script.js
==================================================*/

/*=====================DETALLES=====================
QUÉ HACE: maneja año del footer, scroll spy, scroll suave, envío del formulario
    y conversión de precios a córdobas con la tasa oficial del BCN.
VINCULADO A: index.html (#planes con data-usd, footer, navbar, formularios).
SI SE ALTERA: si cambia el endpoint del formulario o la tasa del BCN, revisar
    el handler y actualizarPreciosEnCordobas().
FECHA: 2026-11-09 | LUGAR: Ocotal, Nueva Segovia
ESCRITO POR: ING. DENIS MANUEL LÓPEZ MOLINA.
==================================================*/

/*================CUERPO DEL CÓDIGO=================*/

document.addEventListener('DOMContentLoaded', () => {
    // Efecto scroll en navbar
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            // Haciendo scroll hacia abajo
            navbar.classList.add('scrolled');
        } else {
            // Haciendo scroll hacia arriba o al principio
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    actualizarAnoDelFooter();
    configurarObservadorScroll();
    configurarScrollSuave();
    enviarFormularioContacto();
    actualizarPreciosEnCordobas();
});

/*===========FIN DEL FRAGMENTO DE CÓDIGO============*/

/*=====================DETALLES=====================
QUÉ HACE: actualiza el año actual en el elemento del footer.
VINCULADO A: index.html (footer, #current-year).
SI SE ALTERA: si cambia el selector del año, revisar el footer.
FECHA: 2026-11-09 | LUGAR: Managua, Managua
ESCRITO POR: ING. DENIS MANUEL LÓPEZ MOLINA.
==================================================*/

/*================CUERPO DEL CÓDIGO=================*/

function actualizarAnoDelFooter() {
    const elementoAno = document.getElementById('current-year');
    if (elementoAno) {
        elementoAno.textContent = String(new Date().getFullYear());
    }
}

/*===========FIN DEL FRAGMENTO DE CÓDIGO============*/

/*=====================DETALLES=====================
QUÉ HACE: configura el observador de scroll para el enlace activo.
VINCULADO A: index.html (secciones y .nav-links).
SI SE ALTERA: si cambia la estrategia de scroll spy, revisar nav.
FECHA: 2026-11-09 | LUGAR: Managua, Managua
ESCRITO POR: ING. DENIS MANUEL LÓPEZ MOLINA.
==================================================*/

/*================CUERPO DEL CÓDIGO=================*/

function configurarObservadorScroll() {
    const secciones = document.querySelectorAll('section[id]');
    const enlaces = Array.from(document.querySelectorAll('.nav-links a'));

    if (secciones.length === 0 || enlaces.length === 0) {
        return;
    }

    const opcionesObservador = {
        root: null,
        rootMargin: '-45% 0px -50% 0px',
        threshold: 0
    };

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
                enlaces.forEach((enlace) => {
                    enlace.classList.remove('active');
                    if (enlace.getAttribute('href') === `#${entrada.target.id}`) {
                        enlace.classList.add('active');
                    }
                });
            }
        });
    }, opcionesObservador);

    secciones.forEach((seccion) => observador.observe(seccion));
}

/*===========FIN DEL FRAGMENTO DE CÓDIGO============*/

/*=====================DETALLES=====================
QUÉ HACE: registra scroll suave para enlaces internos con hash.
VINCULADO A: index.html (navbar, hero, footer, portfolio).
SI SE ALTERA: si cambia el offset, revisar altura de la navbar.
FECHA: 2026-11-09 | LUGAR: Managua, Managua
ESCRITO POR: ING. DENIS MANUEL LÓPEZ MOLINA.
==================================================*/

/*================CUERPO DEL CÓDIGO=================*/

function configurarScrollSuave() {
    const enlaces = document.querySelectorAll('a[href^="#"]');

    enlaces.forEach((enlace) => {
        enlace.addEventListener('click', (evento) => {
            const destino = document.querySelector(enlace.getAttribute('href'));
            if (!destino) {
                return;
            }
            evento.preventDefault();
            const alturaNavbar = document.querySelector('.navbar')?.offsetHeight ?? 0;
            const offset = destino.offsetTop - alturaNavbar - 20;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        });
    });
}

/*===========FIN DEL FRAGMENTO DE CÓDIGO============*/

/*=====================DETALLES=====================
QUÉ HACE: valida y envía el formulario de contacto vía fetch.
VINCULADO A: index.html (form, #contactForm, #submitButton, #formStatus).
SI SE ALTERA: si cambia el endpoint, revisar el fetch y SweetAlert.
FECHA: 2026-11-09 | LUGAR: Managua, Managua
ESCRITO POR: ING. DENIS MANUEL LÓPEZ MOLINA.
==================================================*/

/*================CUERPO DEL CÓDIGO=================*/

async function enviarFormularioContacto() {
    const formulario = document.getElementById('contactForm');

    if (!formulario) {
        return;
    }

    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();
        evento.stopPropagation();

        if (formulario.checkValidity() === false) {
            formulario.classList.add('was-validated');
            return;
        }

        const datos = new FormData(formulario);
        try {
            const respuesta = await fetch(formulario.action, {
                method: 'POST',
                body: datos,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (respuesta.ok) {
                window.Swal.fire({
                    icon: 'success',
                    title: '¡Mensaje enviado!',
                    text: 'Gracias por tu mensaje. Me pondré en contacto contigo pronto.',
                    confirmButtonColor: '#28a745'
                });
                formulario.reset();
                formulario.classList.remove('was-validated');
            } else {
                window.Swal.fire({
                    icon: 'error',
                    title: 'Hubo un error',
                    text: 'No se pudo enviar el mensaje. Por favor, asegúrate de que el formulario esté configurado en Formspree y verificado.',
                    confirmButtonColor: '#dc3545'
                });
            }
        } catch (error) {
            console.error('Error:', error);
            window.Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'Hubo un problema de red. Por favor, revisa tu conexión a internet.',
                confirmButtonColor: '#dc3545'
            });
        }
    });
}

/*===========FIN DEL FRAGMENTO DE CÓDIGO============*/

/*=====================DETALLES=====================
QUÉ HACE: muestra el equivalente en córdobas bajo el precio en dólares de cada
    tarjeta de planes, con la tasa oficial del BCN del mes vigente.
VINCULADO A: index.html (#planes, atributos data-usd, .precio-cordobas).
SI SE ALTERA: actualizar TASA_OFICIAL_BCN y PERIODO_TASA_BCN cada mes con la
    publicación del BCN; sin data-usd la tarjeta queda solo en dólares.
FECHA: 2026-11-09 | LUGAR: Ocotal, Nueva Segovia
ESCRITO POR: ING. DENIS MANUEL LÓPEZ MOLINA.
==================================================*/

/*================CUERPO DEL CÓDIGO=================*/

function actualizarPreciosEnCordobas() {
    // Tasa oficial del Banco Central de Nicaragua (crawling peg: publicada por mes).
    const TASA_OFICIAL_BCN = 36.62;
    const PERIODO_TASA_BCN = 'noviembre 2026';

    const preciosEnUsd = document.querySelectorAll('#planes [data-usd]');

    if (preciosEnUsd.length === 0 || typeof Intl === 'undefined' || !Intl.NumberFormat) {
        return;
    }

    const formatoCordobas = new Intl.NumberFormat('es-NI', {
        style: 'currency',
        currency: 'NIO',
        maximumFractionDigits: 0
    });

    preciosEnUsd.forEach((precio) => {
        const montoEnUsd = Number(precio.getAttribute('data-usd'));
        const lineaCordobas = precio.parentElement.querySelector('.precio-cordobas');

        if (!Number.isFinite(montoEnUsd) || lineaCordobas === null) {
            return;
        }

        lineaCordobas.textContent = `≈ ${formatoCordobas.format(montoEnUsd * TASA_OFICIAL_BCN)} · TC oficial BCN, ${PERIODO_TASA_BCN}`;
    });
}

/*===========FIN DEL FRAGMENTO DE CÓDIGO============*/

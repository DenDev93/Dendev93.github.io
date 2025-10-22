document.addEventListener('DOMContentLoaded', () => {
    // Actualizar el año en el footer
    const currentYearSpan = document.getElementById('current-year');
    currentYearSpan.textContent = new Date().getFullYear();

    // Resaltar el enlace de navegación activo al hacer scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar .nav-links a');

    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Ajusta el umbral para centrar el 'active'
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    const targetId = entry.target.id;
                    if (link.getAttribute('href').substring(1) === targetId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Añadir clase 'active' al enlace de navegación inicial si la página se carga en una sección específica
    const initialHash = window.location.hash;
    if (initialHash) {
        navLinks.forEach(link => {
            if (link.getAttribute('href') === initialHash) {
                link.classList.add('active');
            }
        });
    } else {
        // Por defecto, si no hay hash, la primera sección (Hero) es activa
        navLinks[0].classList.add('active');
    }

    // Smooth scroll para los enlaces de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const offsetTop = targetElement.offsetTop - navbarHeight - 20;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Validación del formulario de Bootstrap y manejo de envío con SweetAlert
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (form.checkValidity() === false) {
            form.classList.add('was-validated');
            return;
        }

        const formData = new FormData(form);
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Mensaje enviado!',
                    text: 'Gracias por tu mensaje. Me pondré en contacto contigo pronto.',
                    confirmButtonColor: '#007bff'
                });
                form.reset();
                form.classList.remove('was-validated');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Hubo un error',
                    text: 'No se pudo enviar el mensaje. Por favor, asegúrate de que el formulario esté configurado en Formspree y verificado.',
                    confirmButtonColor: '#dc3545'
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'Hubo un problema de red. Por favor, revisa tu conexión a internet.',
                confirmButtonColor: '#dc3545'
            });
        }
    });
});
// Galería de imágenes
function initializeGallery() {
    const galleries = document.querySelectorAll('.project-gallery');
    
    galleries.forEach(gallery => {
        const images = gallery.querySelectorAll('img');
        const prevBtn = gallery.parentElement.parentElement.querySelector('.gallery-prev');
        const nextBtn = gallery.parentElement.parentElement.querySelector('.gallery-next');
        let currentIndex = 0;

        // Mostrar la primera imagen
        images[currentIndex].classList.add('active');

        // Función para cambiar imagen
        function showImage(index) {
            images.forEach(img => img.classList.remove('active'));
            images[index].classList.add('active');
        }

        // Event listeners para los botones
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        });

        // Cambio automático cada 5 segundos
        setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            showImage(currentIndex);
        }, 5000);
    });
}

// Modal de proyectos (carrusel de imágenes)
function initializeProjectModal() {
    const modal = document.getElementById('project-modal');
    const modalContent = modal.querySelector('.modal-content');
    const modalGallery = modal.querySelector('.modal-gallery');
    const modalNav = modal.querySelector('.modal-nav');
    const modalIndicators = modal.querySelector('.modal-indicators');
    const closeBtn = modal.querySelector('.close-modal');
    const prevBtn = modal.querySelector('.modal-prev');
    const nextBtn = modal.querySelector('.modal-next');

    let currentImages = [];
    let currentIndex = 0;
    let galleryInner = null;

    function createGalleryInner() {
        if (!galleryInner) {
            galleryInner = document.createElement('div');
            galleryInner.className = 'modal-gallery-inner';
            modalGallery.innerHTML = '';
            modalGallery.appendChild(galleryInner);
        }
        return galleryInner;
    }

    function renderCarousel() {
        if (!currentImages.length) return;
        
        const inner = createGalleryInner();
        inner.innerHTML = '';
        
        currentImages.forEach((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Vista ${index + 1} del proyecto`;
            img.loading = 'lazy';
            inner.appendChild(img);
        });
        
        updateCarouselPosition();
        updateIndicators();
        updateNavigationVisibility();
    }

    function updateCarouselPosition() {
        if (!galleryInner) return;
        const translateX = -currentIndex * 100;
        galleryInner.style.transform = `translateX(${translateX}%)`;
    }

    function updateIndicators() {
        if (!currentImages.length) return;
        
        modalIndicators.innerHTML = '';
        
        // Solo mostrar indicadores si hay más de una imagen
        if (currentImages.length <= 1) {
            modalIndicators.classList.add('hidden');
            return;
        }
        
        modalIndicators.classList.remove('hidden');
        
        currentImages.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'modal-indicator';
            if (index === currentIndex) {
                indicator.classList.add('active');
            }
            indicator.addEventListener('click', () => {
                currentIndex = index;
                updateCarouselPosition();
                updateIndicators();
            });
            modalIndicators.appendChild(indicator);
        });
    }

    function updateNavigationVisibility() {
        // Ocultar navegación si solo hay una imagen
        if (currentImages.length <= 1) {
            modalNav.classList.add('hidden');
        } else {
            modalNav.classList.remove('hidden');
        }
    }

    function goToPrev() {
        if (!currentImages.length) return;
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateCarouselPosition();
        updateIndicators();
    }

    function goToNext() {
        if (!currentImages.length) return;
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateCarouselPosition();
        updateIndicators();
    }

    function openModal(images) {
        currentImages = images;
        currentIndex = 0;
        renderCarousel();
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
        currentImages = [];
        currentIndex = 0;
        if (galleryInner) {
            galleryInner.innerHTML = '';
        }
        modalIndicators.innerHTML = '';
    }

    // Navegación con botones
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToPrev();
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToNext();
    });

    // Cerrar modal
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('open')) return;
        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowLeft') {
            goToPrev();
        } else if (e.key === 'ArrowRight') {
            goToNext();
        }
    });

    // Click en "Ver Proyecto"
    document.querySelectorAll('.project-card .project-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const card = link.closest('.project-card');

            // Recolectar imágenes del proyecto (de .project-gallery o imagen única)
            let imgs = [];
            const gallery = card.querySelector('.project-gallery');
            if (gallery) {
                imgs = Array.from(gallery.querySelectorAll('img')).map(i => i.getAttribute('src'));
            } else {
                const singleImg = card.querySelector('.project-image img');
                if (singleImg) imgs = [singleImg.getAttribute('src')];
            }

            if (imgs.length) {
                openModal(imgs);
            }
        });
    });
}

// Read-more (VER MÁS) behavior for long project descriptions
function initializeReadMore() {
    const maxHeight = 160; // matches CSS

    document.querySelectorAll('.project-card').forEach(card => {
        const desc = card.querySelector('.project-description');
        const btn = card.querySelector('.read-more-btn');
        if (!desc) return;

        // Defer measurement until layout
        setTimeout(() => {
            // Si el contenido no supera la altura, ocultar el botón
            if (desc.scrollHeight <= maxHeight) {
                if (btn) btn.style.display = 'none';
                return;
            }

            // Asegurar el estado inicial
            desc.style.maxHeight = maxHeight + 'px';
            desc.style.overflow = 'hidden';

            if (btn) {
                btn.style.display = '';
                btn.addEventListener('click', () => {
                    const expanded = desc.classList.toggle('expanded');
                    if (expanded) {
                        // expandir: fijar a la altura real para permitir transición
                        desc.style.maxHeight = desc.scrollHeight + 'px';
                        btn.textContent = 'VER MENOS';
                        btn.setAttribute('aria-expanded', 'true');
                    } else {
                        // contraer
                        desc.style.maxHeight = maxHeight + 'px';
                        btn.textContent = 'VER MÁS';
                        btn.setAttribute('aria-expanded', 'false');
                    }
                });
            }
        }, 0);
    });
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = '#ffffff';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.backgroundColor = 'transparent';
        navbar.style.boxShadow = 'none';
    }
});

// Mobile menu toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const offset = 80; // Altura del navbar
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
});

// Animación de las barras de progreso de habilidades
function animateSkills() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        bar.style.width = progress + '%';
    });
}

// Intersection Observer para las animaciones al hacer scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('skill-progress')) {
                entry.target.style.width = entry.target.getAttribute('data-progress') + '%';
            } else {
                entry.target.classList.add('fade-in');
            }
        }
    });
}, { threshold: 0.1 });

// Observar elementos para animaciones
document.querySelectorAll('.fade-in, .skill-progress').forEach(element => {
    observer.observe(element);
});

// Formulario de contacto
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtener los valores del formulario
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    // Crear el enlace mailto con los datos del formulario
    const subject = encodeURIComponent(`Contacto desde portafolio - ${name}`);
    const body = encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`);
    const mailtoLink = `mailto:irislazzarini81@gmail.com?subject=${subject}&body=${body}`;
    
    // Abrir el cliente de correo
    window.location.href = mailtoLink;
    
    // Mensaje de confirmación
    setTimeout(() => {
        alert('¡Gracias por tu mensaje! Se abrirá tu cliente de correo para enviar el mensaje.');
        contactForm.reset();
    }, 100);
});

// Inicializar todas las funcionalidades cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
    animateSkills();
    initializeProjectModal();
    initializeReadMore();
    // Inicializar AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
});
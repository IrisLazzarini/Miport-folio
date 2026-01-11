// ============================================================================
// UTILIDADES PARA MANEJO ROBUSTO DE IMÁGENES
// ============================================================================

/**
 * Normaliza un nombre de archivo a un formato seguro para URLs
 * @param {string} filename - Nombre del archivo original
 * @returns {string} - Nombre normalizado
 */
function sanitizeFileName(filename) {
    if (!filename) return '';
    
    // Remover acentos y caracteres especiales
    const normalized = filename
        .normalize('NFD') // Descompone caracteres con acentos
        .replace(/[\u0300-\u036f]/g, '') // Elimina diacríticos
        .toLowerCase() // Convertir a minúsculas
        .trim();
    
    // Reemplazar espacios y caracteres especiales por guiones
    const sanitized = normalized
        .replace(/\s+/g, '-') // Espacios por guiones
        .replace(/[()]/g, '') // Eliminar paréntesis
        .replace(/\.+/g, '.') // Eliminar puntos duplicados
        .replace(/[^a-z0-9.\-_]/g, '-') // Solo letras, números, puntos, guiones y guiones bajos
        .replace(/-+/g, '-') // Eliminar guiones duplicados
        .replace(/^-|-$/g, ''); // Eliminar guiones al inicio/final
    
    return sanitized;
}

/**
 * Mapping de nombres originales a nombres normalizados para Fondo Becario
 * Este mapping evita problemas con nombres largos y caracteres especiales
 * NOTA: Si los archivos físicos tienen espacios, el sistema los sanitizará automáticamente
 */
const IMAGE_NAME_MAPPING = {
    // Fondo Becario - Mapeo de nombres originales a normalizados
    'Img/Fondo_becario/Inicio.png': 'Img/Fondo_becario/Inicio.png',
    'Img/Fondo_becario/Vista de inicio.png': 'Img/Fondo_becario/Vista de inicio.png',
    'Img/Fondo_becario/Balances.png': 'Img/Fondo_becario/Balances.png',
    'Img/Fondo_becario/Balance consolidado.png': 'Img/Fondo_becario/Balance consolidado.png',
    'Img/Fondo_becario/Balance.png': 'Img/Fondo_becario/Balance.png',
    'Img/Fondo_becario/Gestion de inscripciones.png': 'Img/Fondo_becario/Gestion de inscripciones.png',
    'Img/Fondo_becario/Becas.png': 'Img/Fondo_becario/Becas.png',
    'Img/Fondo_becario/Auditoria.png': 'Img/Fondo_becario/Auditoria.png',
    'Img/Fondo_becario/Egresos.png': 'Img/Fondo_becario/Egresos.png',
    'Img/Fondo_becario/pagos de fondos.png': 'Img/Fondo_becario/pagos de fondos.png',
    'Img/Fondo_becario/Normalizar excel.png': 'Img/Fondo_becario/Normalizar excel.png',
    'Img/Fondo_becario/Eliminacion.png': 'Img/Fondo_becario/Eliminacion.png',
};

/**
 * Normaliza una ruta de imagen usando el mapping o sanitización
 * @param {string} originalPath - Ruta original de la imagen
 * @returns {string} - Ruta normalizada (con codificación de URL para espacios)
 */
function normalizeImagePath(originalPath) {
    if (!originalPath) return '';
    
    // Primero verificar si hay un mapping directo
    let normalizedPath = IMAGE_NAME_MAPPING[originalPath];
    
    if (!normalizedPath) {
        // Si no hay mapping, usar sanitización
        const parts = originalPath.split('/');
        const filename = parts.pop();
        const sanitizedFilename = sanitizeFileName(filename);
        const directory = parts.join('/');
        normalizedPath = sanitizedFilename ? `${directory}/${sanitizedFilename}` : originalPath;
    }
    
    // Codificar correctamente los espacios y caracteres especiales en la URL
    // Dividir la ruta y codificar solo el nombre del archivo
    const parts = normalizedPath.split('/');
    const filename = parts.pop();
    // Codificar el nombre del archivo para URL (espacios → %20, etc.)
    const encodedFilename = encodeURIComponent(filename);
    const directory = parts.join('/');
    
    return `${directory}/${encodedFilename}`;
}

/**
 * Convierte una ruta relativa a absoluta basada en el root del servidor
 * @param {string} relativePath - Ruta relativa
 * @returns {string} - Ruta absoluta
 */
function getAbsoluteImagePath(relativePath) {
    if (!relativePath) return '';
    
    // Si ya es una URL absoluta, retornarla
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
        return relativePath;
    }
    
    // Obtener el protocolo y host actual
    const protocol = window.location.protocol;
    const host = window.location.host;
    
    // Asegurar que la ruta comience con /
    const cleanPath = relativePath.startsWith('/') ? relativePath : '/' + relativePath;
    
    return `${protocol}//${host}${cleanPath}`;
}

/**
 * Crea un placeholder SVG para imágenes que fallan al cargar
 * @param {string} altText - Texto alternativo
 * @returns {string} - Data URL del SVG placeholder
 */
function createImagePlaceholder(altText = 'Imagen no disponible') {
    const svg = `
        <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#1a1a1a"/>
            <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="#666" 
                  text-anchor="middle" dominant-baseline="middle">${altText}</text>
        </svg>
    `.trim();
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

/**
 * Valida y normaliza un array de rutas de imágenes
 * @param {string[]} imagePaths - Array de rutas originales
 * @returns {string[]} - Array de rutas normalizadas y absolutas
 */
function normalizeImagePaths(imagePaths) {
    if (!Array.isArray(imagePaths) || imagePaths.length === 0) {
        console.warn('normalizeImagePaths: Array vacío o inválido');
        return [];
    }
    
    return imagePaths.map((path, index) => {
        const normalized = normalizeImagePath(path);
        const absolute = getAbsoluteImagePath(normalized);
        
        console.log(`[${index + 1}/${imagePaths.length}] Normalizando imagen:`, {
            original: path,
            normalized: normalized,
            absolute: absolute
        });
        
        return absolute;
    });
}

// ============================================================================
// GALERÍA DE IMÁGENES
// ============================================================================

// Galería de imágenes
function initializeGallery() {
    const galleries = document.querySelectorAll('.project-gallery');
    
    galleries.forEach(gallery => {
        const images = gallery.querySelectorAll('img');
        
        // Si no hay imágenes (por ejemplo, si hay un iframe), saltar esta galería
        if (images.length === 0) {
            return;
        }
        
        const prevBtn = gallery.parentElement.parentElement.querySelector('.gallery-prev');
        const nextBtn = gallery.parentElement.parentElement.querySelector('.gallery-next');
        
        // Si no hay botones de navegación, saltar esta galería
        if (!prevBtn || !nextBtn) {
            return;
        }
        
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
            const imageIndex = index + 1;
            const totalImages = currentImages.length;
            
            img.alt = `Vista ${imageIndex} del proyecto`;
            img.loading = 'eager';
            img.style.display = 'block';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            img.style.backgroundColor = '#1a1a1a';
            
            // Datos para debugging
            img.dataset.originalSrc = src;
            img.dataset.imageIndex = imageIndex;
            
            // Manejo de errores de carga con placeholder
            img.onerror = function() {
                const failedSrc = this.src;
                const originalSrc = this.dataset.originalSrc || failedSrc;
                
                console.error(`❌ [${imageIndex}/${totalImages}] Error 404 cargando imagen:`, {
                    original: originalSrc,
                    attempted: failedSrc,
                    timestamp: new Date().toISOString()
                });
                
                // Mostrar placeholder en lugar de ocultar
                this.src = createImagePlaceholder(`Imagen ${imageIndex} no disponible`);
                this.style.opacity = '1';
                this.style.filter = 'grayscale(100%) opacity(0.5)';
                
                // Agregar indicador visual de error
                this.title = `Error: No se pudo cargar la imagen\nOriginal: ${originalSrc}`;
            };
            
            // Asegurar que la imagen se muestre cuando esté cargada
            img.onload = function() {
                const loadedSrc = this.src;
                const originalSrc = this.dataset.originalSrc || loadedSrc;
                
                console.log(`✅ [${imageIndex}/${totalImages}] Imagen cargada correctamente:`, {
                    original: originalSrc,
                    loaded: loadedSrc
                });
                
                this.style.opacity = '1';
                this.style.filter = 'none';
            };
            
            // Establecer la fuente después de configurar los handlers
            img.src = src;
            
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
        if (!images || images.length === 0) {
            console.error('❌ openModal: No hay imágenes para mostrar');
            return;
        }
        
        console.log('🖼️ Abriendo modal con imágenes:', images.length);
        
        // Normalizar y validar las rutas de las imágenes
        currentImages = normalizeImagePaths(images);
        
        if (currentImages.length === 0) {
            console.error('❌ openModal: No se pudieron normalizar las imágenes');
            return;
        }
        
        console.log('✅ Imágenes normalizadas:', currentImages);
        
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
            // Si el enlace apunta a una URL externa (no es #), dejar que funcione normalmente
            if (link.getAttribute('href') !== '#') return;

            e.preventDefault();
            const card = link.closest('.project-card');

            // Recolectar imágenes del proyecto (de .project-gallery o imagen única)
            let imgs = [];
            const gallery = card.querySelector('.project-gallery');
            
            if (gallery) {
                // Obtener todas las imágenes de la galería
                imgs = Array.from(gallery.querySelectorAll('img')).map(i => {
                    // Priorizar el atributo src original del HTML
                    const originalSrc = i.getAttribute('src');
                    return originalSrc || i.src || '';
                }).filter(src => src !== ''); // Filtrar vacíos
            } else {
                // Buscar imagen única
                const singleImg = card.querySelector('.project-image img');
                if (singleImg) {
                    const originalSrc = singleImg.getAttribute('src') || singleImg.src;
                    if (originalSrc) {
                        imgs = [originalSrc];
                    }
                }
            }

            if (imgs.length > 0) {
                console.log('📸 Imágenes recolectadas del proyecto:', imgs.length);
                console.log('📋 Lista de imágenes originales:', imgs);
                openModal(imgs);
            } else {
                console.warn('⚠️ No se encontraron imágenes en el proyecto');
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

// Barra de progreso de scroll
function updateScrollProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    let progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.prepend(progressBar);
    }
    progressBar.style.width = scrolled + '%';
}

// Back to Top Button
function initBackToTop() {
    let backToTopBtn = document.querySelector('.back-to-top');
    
    if (!backToTopBtn) {
        backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        backToTopBtn.setAttribute('aria-label', 'Volver arriba');
        document.body.appendChild(backToTopBtn);
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    return backToTopBtn;
}

// Navbar scroll effect mejorado
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const backToTopBtn = document.querySelector('.back-to-top');
    
    // Actualizar scroll progress
    updateScrollProgress();
    
    // Navbar effect
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Back to top button
    if (backToTopBtn) {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
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
        const href = this.getAttribute('href');
        
        // Ignorar enlaces vacíos o solo "#"
        if (!href || href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        // Verificar que el elemento existe
        if (!target) return;
        
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

// Validación de formulario en tiempo real
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function initFormValidation() {
    const inputs = document.querySelectorAll('#contact-form input, #contact-form textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.classList.add('error');
            } else if (this.type === 'email' && !validateEmail(this.value)) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                if (this.type === 'email') {
                    if (validateEmail(this.value)) {
                        this.classList.remove('error');
                    }
                } else if (this.value.trim() !== '') {
                    this.classList.remove('error');
                }
            }
        });
    });
}

// Formulario de contacto
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtener los valores del formulario
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    
    // Validar campos
    let isValid = true;
    
    if (name === '') {
        nameInput.classList.add('error');
        isValid = false;
    }
    
    if (email === '' || !validateEmail(email)) {
        emailInput.classList.add('error');
        isValid = false;
    }
    
    if (message === '') {
        messageInput.classList.add('error');
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }
    
    // Crear el enlace mailto con los datos del formulario
    const subject = encodeURIComponent(`Contacto desde portafolio - ${name}`);
    const body = encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`);
    const mailtoLink = `mailto:irislazzarini81@gmail.com?subject=${subject}&body=${body}`;
    
    // Cambiar el botón temporalmente
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '✓ Enviando...';
    submitBtn.style.backgroundColor = '#28a745';
    
    // Abrir el cliente de correo
    setTimeout(() => {
        window.location.href = mailtoLink;
        
        // Mensaje de confirmación
        setTimeout(() => {
            alert('¡Gracias por tu mensaje! Se abrirá tu cliente de correo para enviar el mensaje.');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.style.backgroundColor = '';
        }, 500);
    }, 300);
});

// No necesitamos codificar manualmente, el navegador lo hace automáticamente
// Esta función se eliminó porque causaba doble codificación

// Inicializar todas las funcionalidades cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    // Funcionalidades principales
    initializeGallery();
    animateSkills();
    initializeProjectModal();
    initializeReadMore();
    
    // Nuevas funcionalidades UX
    initBackToTop();
    initFormValidation();
    updateScrollProgress();
    
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

// Pantalla de Inicio (Overlay)
function initStartOverlay() {
    const overlay = document.getElementById('start-overlay');
    if (!overlay) return;

    // Bloquear scroll inicial
    document.body.classList.add('no-scroll');

    // Función para cerrar el overlay
    const closeOverlay = () => {
        overlay.classList.add('hidden');
        document.body.classList.remove('no-scroll');
        
        // Iniciar animaciones de AOS después de cerrar el overlay
        if (typeof AOS !== 'undefined') {
            setTimeout(() => {
                AOS.refresh();
            }, 500);
        }
        
        // Remover event listeners para evitar múltiples llamadas
        document.removeEventListener('click', closeOverlay);
        document.removeEventListener('keydown', closeOverlay);
        document.removeEventListener('touchstart', closeOverlay);
    };

    // Escuchar eventos para cerrar
    document.addEventListener('click', closeOverlay);
    document.addEventListener('keydown', closeOverlay);
    document.addEventListener('touchstart', closeOverlay);
}

// Inicializar overlay
document.addEventListener('DOMContentLoaded', function() {
    initStartOverlay();
});
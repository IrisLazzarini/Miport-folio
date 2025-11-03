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
    
    // Aquí puedes agregar la lógica para enviar el formulario
    // Por ahora solo mostraremos un mensaje de éxito
    alert('¡Gracias por tu mensaje! Te contactaré pronto.');
    contactForm.reset();
});

// Inicializar todas las funcionalidades cuando se carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
    animateSkills();
});
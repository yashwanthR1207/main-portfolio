// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// Navbar Scroll Effect
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// GSAP Animations
document.addEventListener('DOMContentLoaded', () => {
    // Reveal Animations
    const reveals = document.querySelectorAll('[data-gsap]');
    
    reveals.forEach(el => {
        const type = el.dataset.gsap;
        const delay = parseFloat(el.dataset.delay) || 0;
        
        let config = {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            duration: 1,
            delay: delay,
            ease: 'power3.out'
        };

        if (type === 'fade-up') {
            gsap.from(el, { ...config, y: 50, opacity: 0 });
        } else if (type === 'fade-right') {
            gsap.from(el, { ...config, x: -50, opacity: 0 });
        } else if (type === 'fade-left') {
            gsap.from(el, { ...config, x: 50, opacity: 0 });
        } else if (type === 'reveal-text') {
            gsap.from(el, { ...config, opacity: 0, scale: 0.9, duration: 1.5 });
        }
    });

    // Hover interactions for glass cards
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});

// Simple Form Handling Placeholder
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message, Yashwanth will get back to you soon!');
        contactForm.reset();
    });
}

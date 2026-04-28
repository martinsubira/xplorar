/* ═══════════════════════════════════════
   XPLORAR — main.js
   ═══════════════════════════════════════ */

/* ── Sticky nav ──────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── Mobile nav toggle ───────────────── */
const navToggle = document.getElementById('nav-toggle');
const navMenu   = document.getElementById('nav-menu');
navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
});
navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', false);
    });
});

/* ── Scroll reveal ───────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 80);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Animated counters ───────────────── */
function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start    = performance.now();

    function step(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease     = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(ease * target).toLocaleString('es-AR');
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-num').forEach(animateCounter);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.4 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) counterObserver.observe(statsSection);

/* ── Media card – hover play ─────────── */
document.querySelectorAll('.media-card:not(.media-join)').forEach(card => {
    const vid = card.querySelector('.media-thumb');
    if (!vid) return;
    card.addEventListener('mouseenter', () => vid.play());
    card.addEventListener('mouseleave', () => { vid.pause(); vid.currentTime = 0; });
});

/* ── Lightbox ────────────────────────── */
const lightbox  = document.getElementById('lightbox');
const lbVideo   = document.getElementById('lb-video');
const lbClose   = document.getElementById('lb-close');
const lbBdrop   = document.getElementById('lb-backdrop');

function openLightbox(src) {
    lbVideo.src = src;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lbVideo.play().catch(() => {});
}
function closeLightbox() {
    lightbox.hidden = true;
    lbVideo.pause();
    lbVideo.src = '';
    document.body.style.overflow = '';
}

document.querySelectorAll('.media-card:not(.media-join)').forEach(card => {
    card.addEventListener('click', () => openLightbox(card.dataset.src));
});
lbClose.addEventListener('click', closeLightbox);
lbBdrop.addEventListener('click', closeLightbox);
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
});

/* ── Contact form (UI-only) ──────────── */
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        btn.textContent = 'Enviando…';
        btn.disabled = true;
        setTimeout(() => {
            contactForm.reset();
            btn.textContent = 'Enviar mensaje';
            btn.disabled = false;
            formSuccess.hidden = false;
            setTimeout(() => formSuccess.hidden = true, 6000);
        }, 1200);
    });
}

/* ── Smooth scroll for anchor links ──── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

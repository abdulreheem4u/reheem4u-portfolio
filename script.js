/* ── Generate Particles ── */
const pc = document.getElementById('particles');
for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const s = Math.random() * 5 + 2;
    p.style.cssText = `
    left:${Math.random() * 100}%;
    width:${s}px; height:${s}px;
    animation-duration:${Math.random() * 14 + 8}s;
    animation-delay:${Math.random() * 10}s;
    opacity:.5;
  `;
    pc.appendChild(p);
}

/* ── Hamburger Menu ── */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const mobileLinks = document.querySelectorAll('.mobile-nav ul a');

function openMenu() {
    hamburger.classList.add('open');
    mobileNav.classList.add('open');
    document.body.classList.add('menu-open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close navigation menu');
}

function closeMenu() {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.classList.remove('menu-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation menu');
}

hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
});

// Close when a link is clicked
mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close on Escape key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
});

/* ── Scroll Dot Active State ── */
const sections = ['welcome', 'HOME', 'ABOUT', 'SERVICES', 'PROJECTS', 'CONTACT'];
const dots = document.querySelectorAll('.scroll-dot span');

window.addEventListener('scroll', () => {
    const y = window.scrollY + window.innerHeight / 2;
    sections.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (y >= el.offsetTop && y < el.offsetTop + el.offsetHeight) {
            dots.forEach(d => d.classList.remove('active'));
            if (dots[i]) dots[i].classList.add('active');
        }
    });
});

function scrollToSec(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

/* ── Intersection Observer (fade-in on scroll) ── */
const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: .15 });

document.querySelectorAll('.srv-card, .about-content, .contact-info, .contact-form, .proj-info')
    .forEach(el => {
        el.style.cssText += ';opacity:0;transform:translateY(30px);transition:opacity .7s ease,transform .7s ease';
        obs.observe(el);
    });

/* ── Contact Form ── */
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const messageInput = document.getElementById('messageInput');

contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
        alert('⚠️ Please fill in all fields!'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('⚠️ Please enter a valid email address!'); return;
    }
    if (name.length < 3) {
        alert('⚠️ Name must be at least 3 characters!'); return;
    }
    if (message.length < 10) {
        alert('⚠️ Message must be at least 10 characters!'); return;
    }

    try {
        const response = await fetch('https://my-web-backend-alpha.vercel.app/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
        });
        const data = await response.json();
        if (response.ok) {
            alert('✅ Message sent! I will get back to you soon.');
            nameInput.value = '';
            emailInput.value = '';
            messageInput.value = '';
        } else {
            alert('❌ Failed: ' + data.error);
        }
    } catch {
        alert('❌ Server error. Please try again later.');
    }
});

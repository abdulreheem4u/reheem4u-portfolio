/* ── Generate particles ── */
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

/* ── Scroll dot active state ── */
const sections = ['welcome', 'HOME', 'ABOUT', 'SERVICES', 'PROJECTS', 'CONTACT'];
const dots = document.querySelectorAll('.scroll-dot span');
window.addEventListener('scroll', () => {
    const y = window.scrollY + window.innerHeight / 2;
    sections.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (y >= el.offsetTop && y < el.offsetTop + el.offsetHeight) {
            dots.forEach(d => d.classList.remove('active'));
            dots[i].classList.add('active');
        }
    });
});
function scrollToSec(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

/* ── Intersection observer for fade-in on scroll ── */
const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: .15 });

document.querySelectorAll('.srv-card,.about-content,.contact-info,.contact-form,.proj-info').forEach(el => {
    el.style.cssText += ';opacity:0;transform:translateY(30px);transition:opacity .7s ease,transform .7s ease';
    obs.observe(el);
});

const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const messageInput = document.getElementById('messageInput');

// Form Validation + Backend Submit
contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    // Check Empty
    if (name === '' || email === '' || message === '') {
        alert('⚠️ Please fill in all fields!');
        return;
    }

    // Email Format Check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('⚠️ Please enter valid Email address!');
        return;
    }

    // Name Length Check
    if (name.length < 3) {
        alert('⚠️ Name must be at least 3 characters!');
        return;
    }

    // Message Length Check
    if (message.length < 10) {
        alert('⚠️ Message must be at least 10 characters!');
        return;
    }

    // Send to Backend
    try {
        const response = await fetch('https://my-web-backend-alpha.vercel.app/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, message })
        });

        const data = await response.json();

        if (response.ok) {
            alert('✅ Message Successfully Sent! I will get back to you soon.');
            nameInput.value = '';
            emailInput.value = '';
            messageInput.value = '';
        } else {
            alert('❌ Failed: ' + data.error);
        }
    } catch (error) {
        alert('❌ Server error. Please try again later.');
    }
});
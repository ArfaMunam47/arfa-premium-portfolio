/* ============================================================
   Arfa Munam — Portfolio Script
   ============================================================ */

// RESUME — make every "Download Resume / CV" link bulletproof.
// resume-data.js (loaded before this file) defines RESUME_BASE64 + RESUME_FILENAME.
// We point every resume link straight at the embedded data URI, so the
// download works even if the sibling PDF file is ever separated from this page.
(function wireResumeLinks() {
  if (typeof RESUME_BASE64 === 'undefined') return; // graceful no-op if data file missing
  const dataUri = 'data:application/pdf;base64,' + RESUME_BASE64;
  document.querySelectorAll('.js-resume-link').forEach(link => {
    link.setAttribute('href', dataUri);
    link.setAttribute('download', RESUME_FILENAME || 'Arfa-Munam-Resume.pdf');
  });
})();

// CURSOR
const cursor = document.getElementById('cursor');
const cursorBlur = document.getElementById('cursor-blur');
let mx = 0, my = 0, bx = 0, by = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
});
document.querySelectorAll('a,button,[data-tilt]').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-big'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-big'));
});
function animBlur() {
  bx += (mx - bx) * 0.12; by += (my - by) * 0.12;
  cursorBlur.style.left = bx + 'px'; cursorBlur.style.top = by + 'px';
  requestAnimationFrame(animBlur);
}
animBlur();

// PARTICLES
const pc = document.getElementById('particles');
for (let i = 0; i < 18; i++) {
  const p = document.createElement('div'); p.className = 'particle';
  p.style.left = Math.random() * 100 + '%';
  p.style.animationDuration = (Math.random() * 10 + 8) + 's';
  p.style.animationDelay = (Math.random() * 10) + 's';
  p.style.width = p.style.height = (Math.random() * 3 + 1) + 'px';
  pc.appendChild(p);
}

// SCROLL REVEAL
const obs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 70);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// COUNTERS (count-up on scroll into view)
const cObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const t = parseInt(e.target.dataset.count, 10);
      let c = 0; const inc = t / 50;
      const iv = setInterval(() => {
        c = Math.min(c + inc, t);
        e.target.textContent = Math.floor(c) + '+';
        if (c >= t) { e.target.textContent = t + '+'; clearInterval(iv); }
      }, 30);
      cObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(c => cObs.observe(c));

// BACK TO TOP + active nav link
const bt = document.getElementById('backTop');
window.addEventListener('scroll', () => {
  bt.classList.toggle('visible', window.scrollY > 400);
  const ids = ['hero', 'about', 'skills', 'services', 'projects', 'experience', 'achievements', 'contact'];
  let cur = '';
  ids.forEach(id => { const s = document.getElementById(id); if (s && window.scrollY >= s.offsetTop - 200) cur = id; });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + cur);
  });
});

// MOBILE MENU
function toggleMobile() { document.getElementById('mobileMenu').classList.toggle('open'); }
function closeMobile() { document.getElementById('mobileMenu').classList.remove('open'); }

// 3D TILT — service cards
document.querySelectorAll('.service-card-3d').forEach(card => {
  const inner = card.querySelector('.service-card-inner');
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 12;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -12;
    inner.style.transform = `rotateX(${y}deg) rotateY(${x}deg) translateY(-8px) scale(1.01)`;
  });
  card.addEventListener('mouseleave', () => { inner.style.transform = ''; });
});

// 3D TILT — project cards
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 8;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -8;
    card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

// SEND MESSAGE — validated, working mailto handoff
function sendMsg() {
  const name = document.getElementById('cname').value.trim();
  const email = document.getElementById('cemail').value.trim();
  const msg = document.getElementById('cmsg').value.trim();
  const btn = document.getElementById('sendBtn');
  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name) { showMsg('error', 'Please enter your name.'); return; }
  if (!email || !emailReg.test(email)) { showMsg('error', 'Please enter a valid email address.'); return; }
  if (!msg || msg.length < 10) { showMsg('error', 'Please write a message (at least 10 characters).'); return; }

  btn.setAttribute('disabled', 'true');
  document.getElementById('sendText').textContent = 'Opening Email...';

  const subject = encodeURIComponent('Portfolio Inquiry from ' + name);
  const body = encodeURIComponent('Hi Arfa,\n\n' + msg + '\n\n---\nFrom: ' + name + '\nEmail: ' + email);
  const mailtoLink = 'mailto:arfamunam01@gmail.com?subject=' + subject + '&body=' + body;

  // Use a temporary anchor so it behaves reliably across browsers
  const a = document.createElement('a');
  a.href = mailtoLink;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  setTimeout(() => {
    showMsg('success', '✓ Your email client should be opening now. Thank you for reaching out, ' + name + '!');
    btn.removeAttribute('disabled');
    document.getElementById('sendText').textContent = 'Send Message';
    document.getElementById('cname').value = '';
    document.getElementById('cemail').value = '';
    document.getElementById('cmsg').value = '';
  }, 700);
}

function showMsg(type, text) {
  const fb = document.getElementById('form-msg');
  fb.style.display = 'block';
  fb.style.background = type === 'error' ? '#fee2e2' : '#dcfce7';
  fb.style.color = type === 'error' ? '#991b1b' : '#166534';
  fb.textContent = text;
  clearTimeout(window.__formMsgTimeout);
  window.__formMsgTimeout = setTimeout(() => { fb.style.display = 'none'; }, 5000);
}

// Allow Enter key (with Ctrl/Cmd) to submit from textarea, and wire the button
document.addEventListener('DOMContentLoaded', () => {
  const sendBtn = document.getElementById('sendBtn');
  if (sendBtn) sendBtn.addEventListener('click', sendMsg);
  const msgField = document.getElementById('cmsg');
  if (msgField) {
    msgField.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') sendMsg();
    });
  }
});

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const targetId = a.getAttribute('href');
    if (targetId.length > 1) {
      const t = document.querySelector(targetId);
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); closeMobile(); }
    }
  });
});

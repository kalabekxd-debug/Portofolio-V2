// 1. Custom Cursor Logic (Menambah kesan premium & interaktif)
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Dot mengikuti dengan cepat
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Outline mengikuti dengan sedikit delay (animasi mulus via GSAP)
    gsap.to(cursorOutline, {
        x: posX,
        y: posY,
        duration: 0.15,
        ease: "power2.out"
    });
});

// Hover effect pada tautan dan tombol
const hoverElements = document.querySelectorAll('a, .interactive-card, .tilt-img');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorOutline.style.width = '60px';
        cursorOutline.style.height = '60px';
        cursorOutline.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
    });
    el.addEventListener('mouseleave', () => {
        cursorOutline.style.width = '40px';
        cursorOutline.style.height = '40px';
        cursorOutline.style.backgroundColor = 'transparent';
    });
});

// 2. Scroll Reveal Animation (Cinematic entry)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.2
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

// 3. 3D Tilt Effect on Hero Image (Motion interaktif saat pointer lewat)
const tiltImg = document.querySelector('.tilt-img');

tiltImg.addEventListener('mousemove', (e) => {
    const { left, top, width, height } = tiltImg.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;

    gsap.to(tiltImg, {
        rotationY: x * 20,
        rotationX: -y * 20,
        transformPerspective: 900,
        ease: "power1.out",
        duration: 0.5
    });
});

tiltImg.addEventListener('mouseleave', () => {
    gsap.to(tiltImg, {
        rotationY: 0,
        rotationX: 0,
        ease: "power3.out",
        duration: 1
    });
});

const menuIcon = document.querySelector("#menu-icon");
const navLinks = document.querySelector(".nav-links");
const topbar = document.querySelector("#topbar");

function setMenu(open) {
    navLinks.classList.toggle("active", open);
    topbar.classList.toggle("menu-open", open);
    menuIcon.setAttribute("aria-expanded", String(open));
    menuIcon.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    const icon = menuIcon.querySelector("use");
    if (icon) icon.setAttribute("href", open ? "#i-xmark" : "#i-bars");
}

menuIcon.addEventListener("click", () => {
    setMenu(!navLinks.classList.contains("active"));
});

navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
});

/* Lee el scroll dentro de requestAnimationFrame para no forzar un recálculo de layout */
let topbarTicking = false;

function updateTopbar() {
    if (topbarTicking) return;
    topbarTicking = true;
    requestAnimationFrame(() => {
        topbar.classList.toggle("scrolled", window.scrollY > 8);
        topbarTicking = false;
    });
}

updateTopbar();
window.addEventListener("scroll", updateTopbar, { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

document.querySelectorAll(".project-slider").forEach((slider) => {
    const track = slider.querySelector(".slider-track");
    const slides = Array.from(track.children);
    const dotsContainer = slider.querySelector(".slider-dots");

    if (slides.length <= 1) return;

    let current = 0;
    let autoplayTimer = null;

    slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "slider-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", `Ir a la imagen ${i + 1}`);
        dot.addEventListener("click", () => goTo(i));
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    function goTo(index) {
        current = index;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
    }

    function next() {
        goTo((current + 1) % slides.length);
    }

    function startAutoplay() {
        clearInterval(autoplayTimer);
        autoplayTimer = setInterval(next, 3000);
    }

    function stopAutoplay() {
        clearInterval(autoplayTimer);
    }

    startAutoplay();
    slider.addEventListener("mouseenter", stopAutoplay);
    slider.addEventListener("mouseleave", startAutoplay);
});

console.log(
    "%c¡Hola, dev! 👋",
    "color:#1F3FE0; font-size:22px; font-weight:bold;"
);
console.log(
    "%c¿Revisando el código? Si te gustó lo que viste, hablemos.",
    "font-size:13px;"
);
console.log(
    "%c@mateodeveloper  ·  mateooliverodev@gmail.com  ·  https://github.com/mateoolivero",
    "color:#7F97FF; font-size:12px;"
);

const profilePhoto = document.querySelector("#profile-photo");
const eggBubble = document.querySelector("#egg-bubble");

if (profilePhoto && eggBubble) {
    const eggMessages = [
        "¡Dejá de clickearme! 😄",
        "Ok, ok, ya sé que te gusto",
        "¿No tenés nada mejor que hacer? 😂",
        "Está bien, un secreto: me encanta el mate ☕",
        "¡Ya vas a romper la pantalla!",
    ];

    let eggClicks = 0;
    let eggMessageIndex = 0;
    let eggResetTimer = null;
    let eggHideTimer = null;

    profilePhoto.addEventListener("click", () => {
        eggClicks++;
        clearTimeout(eggResetTimer);
        eggResetTimer = setTimeout(() => {
            eggClicks = 0;
        }, 2000);

        if (eggClicks >= 5) {
            eggClicks = 0;

            profilePhoto.classList.remove("egg-wiggle");
            void profilePhoto.offsetWidth;
            profilePhoto.classList.add("egg-wiggle");

            eggBubble.textContent = eggMessages[eggMessageIndex % eggMessages.length];
            eggMessageIndex++;
            eggBubble.classList.add("show");

            clearTimeout(eggHideTimer);
            eggHideTimer = setTimeout(() => {
                eggBubble.classList.remove("show");
            }, 2500);
        }
    });
}

/* ---------- WhatsApp: un solo número para todo el sitio ---------- */

const WHATSAPP_NUMBER = "5493533688621";

function whatsappUrl(text) {
    const base = `https://wa.me/${WHATSAPP_NUMBER}`;
    return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

document.querySelectorAll("[data-wa]").forEach((link) => {
    link.href = whatsappUrl(link.dataset.wa);
});

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
    const statusEl = contactForm.querySelector(".form-status");

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const data = new FormData(contactForm);
        const name = (data.get("name") || "").trim();
        const product = (data.get("product") || "").trim();
        const message = (data.get("message") || "").trim();

        let text = `Hola Mateo! Soy ${name}. Vendo ${product}.`;
        if (message) text += ` ${message}`;

        const url = whatsappUrl(text);
        const win = window.open(url, "_blank", "noopener");
        if (!win) window.location.href = url;

        statusEl.textContent = "Listo: se abrió WhatsApp con tu mensaje. Solo te falta tocar enviar.";
    });
}

/* ---------- Botón flotante: aparece después de la portada, se oculta en el cierre ---------- */

const waFloat = document.querySelector("#wa-float");
const heroSection = document.querySelector("#about, .page-hero");
const contactSection = document.querySelector("#contact");

if (waFloat && heroSection && contactSection) {
    const visibility = { hero: true, contact: false };

    const floatObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.target === heroSection) visibility.hero = entry.isIntersecting;
            if (entry.target === contactSection) visibility.contact = entry.isIntersecting;
        });
        waFloat.classList.toggle("visible", !visibility.hero && !visibility.contact);
    }, { threshold: 0.1 });

    floatObserver.observe(heroSection);
    floatObserver.observe(contactSection);
}

/* ---------- Modo oscuro ---------- */

const themeToggle = document.querySelector("#theme-toggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeMeta) themeMeta.setAttribute("content", theme === "dark" ? "#121211" : "#E9E8E3");
    if (themeToggle) {
        themeToggle.setAttribute("aria-label", theme === "dark" ? "Activar modo claro" : "Activar modo oscuro");
    }
}

applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(next);
        try { localStorage.setItem("theme", next); } catch (e) {}
    });
}

const systemDark = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

if (systemDark && systemDark.addEventListener) {
    systemDark.addEventListener("change", (e) => {
        let saved = null;
        try { saved = localStorage.getItem("theme"); } catch (err) {}
        if (!saved) applyTheme(e.matches ? "dark" : "light");
    });
}

var TxtType = function(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    };

    TxtType.prototype.tick = function() {
        var i = this.loopNum % this.toRotate.length;
        var fullTxt = this.toRotate[i];

        if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        if (!this.wrap) {
            this.wrap = document.createElement("span");
            this.wrap.className = "wrap";
            this.el.replaceChildren(this.wrap);
        }
        this.wrap.textContent = this.txt;

        var that = this;
        var delta = 200 - Math.random() * 100;

        if (this.isDeleting) { delta /= 2; }

        if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
        }

        setTimeout(function() {
        that.tick();
        }, delta);
    };

    window.onload = function() {
        var elements = document.getElementsByClassName('typewrite');
        for (var i=0; i<elements.length; i++) {
            var toRotate = elements[i].getAttribute('data-type');
            var period = elements[i].getAttribute('data-period');
            if (toRotate) {
              new TxtType(elements[i], JSON.parse(toRotate), period);
            }
        }
    };

const defaultTitle = document.title;
const awayTitles = ["¿Un bug te distrajo? 🐛", "Volvé, tu código te espera 👨‍💻"];
let awayTitleIndex = 0;
let awayTitleTimer = null;

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        awayTitleIndex = 0;
        document.title = awayTitles[awayTitleIndex];
        awayTitleTimer = setInterval(() => {
            awayTitleIndex = (awayTitleIndex + 1) % awayTitles.length;
            document.title = awayTitles[awayTitleIndex];
        }, 1500);
    } else {
        clearInterval(awayTitleTimer);
        document.title = defaultTitle;
    }
});
const menuIcon = document.querySelector("#menu-icon");
const navLinks = document.querySelector(".nav-links")

menuIcon.onclick = () => {
    navLinks.classList.toggle("active")
}

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
    "color:#9671DA; font-size:22px; font-weight:bold;"
);
console.log(
    "%c¿Revisando el código? Si te gustó lo que viste, hablemos.",
    "color:#fff; font-size:13px;"
);
console.log(
    "%cmateooliverodev@gmail.com  ·  https://github.com/mateoolivero",
    "color:#61DAFB; font-size:12px;"
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

const contactForm = document.querySelector("#contact-form");

if (contactForm) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const submitBtnLabel = submitBtn.querySelector(".button-content") || submitBtn;
    const statusEl = contactForm.querySelector(".form-status");
    const submitBtnDefaultText = submitBtnLabel.textContent;

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtnLabel.textContent = "Enviando...";
        statusEl.textContent = "";

        const formData = new FormData(contactForm);
        const payload = Object.fromEntries(formData);

        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    statusEl.textContent = "¡Gracias! Tu mensaje fue enviado.";
                    contactForm.reset();
                } else {
                    statusEl.textContent = data.message || "Hubo un error, intenta de nuevo.";
                }
            })
            .catch(() => {
                statusEl.textContent = "Hubo un error, intenta de nuevo.";
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtnLabel.textContent = submitBtnDefaultText;
            });
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

        this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

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
        // INJECT CSS
        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
        document.body.appendChild(css);
    };
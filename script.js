const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector("#nav-links");

if (menuToggle && navLinks) {
    const closeMenu = () => {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menú");
        navLinks.classList.remove("is-open");
    };

    menuToggle.addEventListener("click", () => {
        const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isExpanded));
        menuToggle.setAttribute("aria-label", isExpanded ? "Abrir menú" : "Cerrar menú");
        navLinks.classList.toggle("is-open", !isExpanded);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
            closeMenu();
            menuToggle.focus();
        }
    });
}

const revealElements = document.querySelectorAll(".reveal");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if ("IntersectionObserver" in window && !reducedMotion.matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach((element) => revealObserver.observe(element));
} else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
}

const carousel = document.querySelector(".carousel");
const carouselTrack = document.querySelector("#carousel-track");

if (carousel && carouselTrack) {
    const slides = Array.from(carouselTrack.querySelectorAll(".carousel-slide"));
    const dots = Array.from(document.querySelectorAll(".carousel-dot"));
    const previousButton = document.querySelector("[data-carousel-prev]");
    const nextButton = document.querySelector("[data-carousel-next]");
    let activeSlide = 0;
    let timerId;
    let isPaused = false;

    const showSlide = (index) => {
        activeSlide = (index + slides.length) % slides.length;
        carouselTrack.style.transform = `translateX(-${activeSlide * 100}%)`;

        slides.forEach((slide, slideIndex) => {
            slide.setAttribute("aria-hidden", String(slideIndex !== activeSlide));
        });

        dots.forEach((dot, dotIndex) => {
            const isActive = dotIndex === activeSlide;
            dot.classList.toggle("is-active", isActive);
            if (isActive) {
                dot.setAttribute("aria-current", "true");
            } else {
                dot.removeAttribute("aria-current");
            }
        });
    };

    const updateAutoplay = () => {
        window.clearInterval(timerId);
        if (!isPaused && !reducedMotion.matches && !document.hidden && slides.length > 1) {
            timerId = window.setInterval(() => showSlide(activeSlide + 1), 6000);
        }
    };

    previousButton?.addEventListener("click", () => {
        showSlide(activeSlide - 1);
        updateAutoplay();
    });

    nextButton?.addEventListener("click", () => {
        showSlide(activeSlide + 1);
        updateAutoplay();
    });

    dots.forEach((dot) => {
        dot.addEventListener("click", () => {
            showSlide(Number(dot.dataset.slide));
            updateAutoplay();
        });
    });

    carousel.addEventListener("mouseenter", () => {
        isPaused = true;
        updateAutoplay();
    });
    carousel.addEventListener("mouseleave", () => {
        isPaused = false;
        updateAutoplay();
    });
    carousel.addEventListener("focusin", () => {
        isPaused = true;
        updateAutoplay();
    });
    carousel.addEventListener("focusout", (event) => {
        if (!carousel.contains(event.relatedTarget)) {
            isPaused = false;
            updateAutoplay();
        }
    });
    document.addEventListener("visibilitychange", updateAutoplay);
    reducedMotion.addEventListener("change", updateAutoplay);

    showSlide(activeSlide);
    updateAutoplay();
}

const reportForm = document.querySelector("#report-form");
const reportFeedback = document.querySelector("#report-feedback");

if (reportForm && reportFeedback) {
    reportForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!reportForm.reportValidity()) {
            return;
        }

        const formData = new FormData(reportForm);
        const reportText = [
            "Hola, quiero compartir un aviso de un perrito en Hacienda Cuautitlán.",
            `Ubicación: ${formData.get("location")}`,
            `Situación: ${formData.get("details")}`
        ].join("\n");
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(reportText)}`;
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");

        reportFeedback.replaceChildren(
            document.createTextNode(
                "Aviso preparado; elige a quién enviarlo desde WhatsApp. Si no se abrió, "
            )
        );

        const fallbackLink = document.createElement("a");
        fallbackLink.href = whatsappUrl;
        fallbackLink.target = "_blank";
        fallbackLink.rel = "noopener noreferrer";
        fallbackLink.textContent = "Abrir WhatsApp";
        reportFeedback.append(fallbackLink);
    });
}

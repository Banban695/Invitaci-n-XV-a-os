/* =========================================================
   CONFIGURACIÓN DE LA INVITACIÓN
   👉 Edita SOLO esta sección con los datos reales del evento.
   Los valores actuales son FICTICIOS, solo de ejemplo.
   ========================================================= */
const CONFIG = {
    // Nombre completo de la quinceañera (dato ficticio de ejemplo)
    name: "Sofía Ramírez",

    // Solo el primer nombre (se usa en la cortina de entrada)
    firstName: "Sofía",

    // Fecha y hora del evento en formato: "AAAA-MM-DDTHH:MM:SS"
    eventDateISO: "2026-12-05T19:00:00",

    // Texto que se muestra en la sección de ubicación
    addressText: "Salón Jardín Villa Toscana, Av. de las Flores 245, CDMX",
    dateTimeText: "5 de Diciembre, 2026 · 7:00 PM",

    // Texto de búsqueda para Google Maps.
    // Puedes usar una dirección o "latitud,longitud"
    mapsQuery: "Jardín Villa Toscana, Ciudad de México",
};

/* =========================================================
   Aplicar configuración al DOM
   ========================================================= */
function applyConfig() {
    const monogram = document.getElementById("monogram");
    if (monogram) monogram.textContent = CONFIG.firstName.charAt(0).toUpperCase();

    const curtainName = document.getElementById("curtainName");
    if (curtainName) curtainName.textContent = CONFIG.firstName;

    const heroName = document.getElementById("heroName");
    if (heroName) heroName.textContent = CONFIG.name;

    const signature = document.getElementById("messageSignature");
    if (signature) signature.textContent = `— ${CONFIG.name}`;

    const hashtag = document.getElementById("finalHashtag");
    if (hashtag) hashtag.textContent = `#MisXV${CONFIG.firstName.replace(/\s+/g, "")}`;

    const address = document.getElementById("locationAddress");
    if (address) address.textContent = CONFIG.addressText;

    const dateTime = document.getElementById("locationDateTime");
    if (dateTime) dateTime.textContent = CONFIG.dateTimeText;

    const encodedQuery = encodeURIComponent(CONFIG.mapsQuery);

    const mapFrame = document.getElementById("mapFrame");
    if (mapFrame) mapFrame.src = `https://www.google.com/maps?q=${encodedQuery}&output=embed`;

    const mapsBtn = document.getElementById("mapsBtn");
    if (mapsBtn) mapsBtn.href = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;

    document.title = `Mis XV Años - ${CONFIG.firstName}`;
}

/* =========================================================
   1. CORTINA DE PRESENTACIÓN
   ========================================================= */
function setupCurtain() {
    const curtain = document.getElementById("curtain");
    const enterBtn = document.getElementById("enterBtn");
    const mainContent = document.getElementById("mainContent");
    const bgMusic = document.getElementById("bgMusic");

    if (!curtain || !enterBtn || !mainContent) return;

    document.body.style.overflow = "hidden";

    enterBtn.addEventListener("click", () => {
        curtain.classList.add("opening");
        mainContent.classList.add("visible");
        document.body.style.overflow = "auto";

        // Intenta iniciar la música automáticamente al entrar.
        // Los navegadores pueden bloquear el autoplay; en ese caso
        // la invitada podrá iniciarla manualmente con el botón flotante.
        if (bgMusic) {
            bgMusic.play().then(() => {
                updateMusicIcon(true);
            }).catch(() => {
                updateMusicIcon(false);
            });
        }

        setTimeout(() => {
            curtain.classList.add("hidden");
        }, 1050);
    });
}

/* =========================================================
   3. CONTADOR REGRESIVO
   ========================================================= */
function setupCountdown() {
    const target = new Date(CONFIG.eventDateISO).getTime();
    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");
    const messageEl = document.getElementById("countdownMessage");

    if (!daysEl || isNaN(target)) return;

    function pad(n) {
        return String(n).padStart(2, "0");
    }

    function tick() {
        const now = Date.now();
        const diff = target - now;

        if (diff <= 0) {
            daysEl.textContent = "00";
            hoursEl.textContent = "00";
            minutesEl.textContent = "00";
            secondsEl.textContent = "00";
            if (messageEl) messageEl.textContent = "¡Hoy es el gran día! 🎉";
            clearInterval(intervalId);
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        daysEl.textContent = pad(days);
        hoursEl.textContent = pad(hours);
        minutesEl.textContent = pad(minutes);
        secondsEl.textContent = pad(seconds);
    }

    tick();
    const intervalId = setInterval(tick, 1000);
}

/* =========================================================
   7. MÚSICA DE FONDO
   ========================================================= */
function updateMusicIcon(isPlaying) {
    const icon = document.getElementById("musicIcon");
    const btn = document.getElementById("musicToggle");
    if (icon) icon.textContent = isPlaying ? "❚❚" : "♪";
    if (btn) btn.classList.toggle("playing", isPlaying);
}

function setupMusicToggle() {
    const btn = document.getElementById("musicToggle");
    const bgMusic = document.getElementById("bgMusic");
    if (!btn || !bgMusic) return;

    btn.addEventListener("click", () => {
        if (bgMusic.paused) {
            bgMusic.play().then(() => updateMusicIcon(true)).catch(() => {
                alert("Agrega tu archivo de música en assets/audio/background-music.mp3 para poder reproducirla.");
            });
        } else {
            bgMusic.pause();
            updateMusicIcon(false);
        }
    });
}

/* =========================================================
   ANIMACIÓN AL HACER SCROLL
   Las tarjetas de cada sección y las fotos de "Mis Gustos"
   aparecen suavemente conforme la invitada va bajando la página.
   ========================================================= */
function setupScrollReveal() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) return;

    const sections = document.querySelectorAll(
        ".countdown-section, .message-section, .gallery-section, .location-section, .final-section"
    );
    const galleryItems = document.querySelectorAll(".gallery-item");

    sections.forEach((el) => el.classList.add("reveal"));
    galleryItems.forEach((el, i) => {
        el.classList.add("reveal");
        el.style.transitionDelay = `${Math.min(i * 90, 360)}ms`;
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    sections.forEach((el) => observer.observe(el));
    galleryItems.forEach((el) => observer.observe(el));
}

/* =========================================================
   INIT
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    applyConfig();
    setupCurtain();
    setupCountdown();
    setupMusicToggle();
    setupScrollReveal();
});

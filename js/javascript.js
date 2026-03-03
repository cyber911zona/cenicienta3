document.addEventListener('DOMContentLoaded', function() {
    // --- 1. REFERENCIAS DE ELEMENTOS ---
    const bgVideo = document.getElementById('backgroundVideoLoop');
    const glassPass = document.querySelector('.glass-pass');
    const parchment = document.querySelector('.parchment');
    const music = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');

    // --- 2. LÓGICA DE VIDEO Y EFECTOS DE CRISTAL ---
    if (bgVideo) {
        // CUANDO EL VIDEO INICIA: El pase y el pergamino se vuelven cristal
        bgVideo.onplaying = function() {
            if (glassPass) glassPass.classList.add('pass-crystal');
            if (parchment) parchment.classList.add('parchment-crystal');
        };

        // CUANDO EL VIDEO TERMINA: Todo vuelve a sólido y empieza la música
        bgVideo.onended = function() {
            bgVideo.classList.add('video-ended'); // Se desvanece el video
            if (glassPass) glassPass.classList.remove('pass-crystal');
            if (parchment) parchment.classList.remove('parchment-crystal');
            
            // La música inicia automáticamente al terminar el video
            if (music && music.paused) {
                music.play().catch(e => console.log("Audio esperando interacción"));
                if (musicBtn) musicBtn.classList.add('visible');
            }
        };
        
        // Intento de reproducción automática (silenciada si es necesario por el navegador)
        bgVideo.play().catch(e => console.log("Video en espera de clic para sonido"));
    }

    // --- 3. LEER NOMBRE Y PASES DEL LINK (?n=Nombre&p=2) ---
    const urlParams = new URLSearchParams(window.location.search);
    const nombreInvitado = urlParams.get('n');
    const pasesInvitado = urlParams.get('p');
    const displayNombre = document.getElementById('invitadoNombre');
    const displayPases = document.getElementById('numPases');

    if (nombreInvitado && displayNombre) {
        displayNombre.innerText = nombreInvitado.replace(/_/g, ' ').toUpperCase();
    }
    if (displayPases) {
        displayPases.innerText = pasesInvitado || "1"; // "1" por defecto
    }

    // --- 4. APERTURA CON CONFETI ---
    const sealBtn = document.getElementById('entrarBtn');
    const wrapper = document.getElementById('wrapper');

    if (sealBtn && wrapper) {
        sealBtn.addEventListener('click', () => {
            // Confeti en tonos azul y blanco
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#84b6f4', '#c4dafa', '#ffffff']
            });

            setTimeout(() => {
                wrapper.classList.add('open');
                document.body.style.overflow = 'auto';
                // Si el video ya terminó, aseguramos que la música suene al entrar
                if (music && music.paused) {
                    music.play();
                    if (musicBtn) musicBtn.classList.add('visible');
                }
            }, 300);
        });
    }

    // --- 5. CIERRE Y PAUSA ---
    const closeBtn = document.getElementById('closeBtn');
    if (closeBtn && wrapper) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            wrapper.classList.remove('open');
            document.body.style.overflow = 'hidden';
            if (music) music.pause();
            setTimeout(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, 1500);
        });
    }

    // --- 6. CONTROLES MANUALES (MÚSICA Y ACORDEÓN) ---
    if (musicBtn && music) {
        musicBtn.addEventListener('click', () => {
            if (music.paused) {
                music.play();
                musicIcon.innerText = "🔊";
            } else {
                music.pause();
                musicIcon.innerText = "🔇";
            }
        });
    }

    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            document.querySelectorAll('.accordion-item').forEach(other => {
                if (other !== item) other.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });

    // --- 7. REINICIAR MÚSICA SI CAMBIA DE PESTAÑA ---
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && wrapper.classList.contains('open') && music) {
            music.play();
        }
    });

    iniciarReloj();
}); // FIN DEL DOMContentLoaded

// --- 8. EL RELOJ ---
function iniciarReloj() {
    const fechaFiesta = new Date('2026-12-19T12:00:00').getTime();
    const display = document.getElementById('mainCountdown');
    const daysBox = document.getElementById('daysBox');
    
    if (!display) return;

    setInterval(() => {
        const ahora = new Date().getTime();
        const diff = fechaFiesta - ahora;

        if (diff <= 0) {
            display.innerHTML = "<div class='finish-msg'>¡ES HOY EL GRAN DÍA!</div>";
            if (daysBox) daysBox.innerText = "0 DÍAS"; 
            return;
        }

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        if (daysBox) daysBox.innerText = `${d} DÍAS`;

        display.innerHTML = `
            <div class="countdown-unit"><span class="countdown-number">${d}</span><span class="countdown-label">Días</span></div>
            <div class="countdown-unit"><span class="countdown-number">${h}</span><span class="countdown-label">Hrs</span></div>
            <div class="countdown-unit"><span class="countdown-number">${m}</span><span class="countdown-label">Min</span></div>
            <div class="countdown-unit"><span class="countdown-number">${s}</span><span class="countdown-label">Seg</span></div>
        `;
    }, 1000);
}
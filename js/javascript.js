document.addEventListener('DOMContentLoaded', function() {
    // --- 1. REFERENCIAS DE ELEMENTOS ---
    const bgVideo = document.getElementById('backgroundVideoLoop');
    const glassPass = document.querySelector('.glass-pass');
    const parchment = document.querySelector('.parchment');
    const music = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');
    const sealBtn = document.getElementById('entrarBtn');
    const wrapper = document.getElementById('wrapper');
    const closeBtn = document.getElementById('closeBtn');

    // --- 2. LÓGICA DE VIDEO (SOLO EFECTOS VISUALES) ---
    if (bgVideo) {
        // Al iniciar el video: Efectos de cristal
        bgVideo.onplaying = function() {
            document.body.classList.add('video-active'); // Activa el fondo negro
            if (glassPass) glassPass.classList.add('pass-crystal');
            if (parchment) parchment.classList.add('parchment-crystal');
        };
        
        // Al terminar el video: Solo efectos visuales
        bgVideo.onended = function() {
            document.body.classList.remove('video-active'); // Devuelve el fondo azul al terminar
            bgVideo.classList.add('video-ended'); 
            if (glassPass) glassPass.classList.remove('pass-crystal');
            if (parchment) parchment.classList.remove('parchment-crystal');
        };
        
        // Pequeño delay para asegurar carga en móviles y evitar fondo negro
        setTimeout(() => {
            bgVideo.play().catch(e => console.log("Video esperando interacción"));
        }, 100);
    }

    // --- 3. LEER NOMBRE Y PASES DEL LINK ---
    const urlParams = new URLSearchParams(window.location.search);
    const nombreInvitado = urlParams.get('n');
    const pasesInvitado = urlParams.get('p');
    const displayNombre = document.getElementById('invitadoNombre');
    const displayPases = document.getElementById('numPases');

    if (nombreInvitado && displayNombre) {
        displayNombre.innerText = nombreInvitado.replace(/_/g, ' ').toUpperCase();
    }
    if (displayPases) {
        displayPases.innerText = pasesInvitado || "1";
    }

    // --- 4. ACCIÓN DE ABRIR (MÚSICA INICIA AQUÍ) ---
    if (sealBtn && wrapper) {
        sealBtn.addEventListener('click', () => {
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#84b6f4', '#c4dafa', '#ffffff']
            });

            setTimeout(() => {
                wrapper.classList.add('open'); 
                document.body.style.overflow = 'auto';
                
                if (music && music.paused) {
                    music.play().catch(err => console.log("Audio bloqueado"));
                    if (musicBtn) musicBtn.classList.add('visible');
                    if (musicIcon) musicIcon.innerText = "🔊";
                }
            }, 300);
        });
    }

    // --- 5. CIERRE Y PAUSA ---
    if (closeBtn && wrapper) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            wrapper.classList.remove('open');
            document.body.style.overflow = 'hidden';
            if (music) music.pause();
            setTimeout(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, 1500);
        });
    }

    // --- 6. CONTROL INTELIGENTE (SALIR/ENTRAR DEL NAVEGADOR) ---
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (music) music.pause();
        } else {
            if (wrapper.classList.contains('open') && music) {
                music.play().catch(e => console.log("Reanudación automática"));
                if (musicIcon) musicIcon.innerText = "🔊";
            }
        }
    });

    // --- 7. ACORDEONES ---
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            document.querySelectorAll('.accordion-item').forEach(other => {
                if (other !== item) other.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });

    iniciarReloj();
}); 

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


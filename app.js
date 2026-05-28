document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------------------
    // BOOT SEQUENCE LOADER (SLOW-MO) & STARTUP CHIME
    // -----------------------------------------------------------------
    const bootLoader = document.getElementById('boot-loader');
    const bootText = document.getElementById('boot-text');
    
    const bootStatuses = [
        "ESTABLISHING NEURAL LINK...",
        "DECRYPTING CORE INTERFACE...",
        "SYNCHRONIZING AUDIO CHANNELS...",
        "INJECTING QUANTUM DRIVERS...",
        "NAZ CORE STANDBY - INITIALIZING UI..."
    ];
    let statusIndex = 0;
    
    if (bootText) {
        const interval = setInterval(() => {
            statusIndex++;
            if (statusIndex < bootStatuses.length) {
                bootText.textContent = bootStatuses[statusIndex];
            } else {
                clearInterval(interval);
            }
        }, 850);
    }
    
    function playStartupSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const audioCtx = new AudioContext();
            const now = audioCtx.currentTime;
            
            // Soft atmospheric low-frequency whoosh (very subtle, cinematic)
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            const filter = audioCtx.createBiquadFilter();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.exponentialRampToValueAtTime(55, now + 1.8);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(200, now);
            filter.frequency.exponentialRampToValueAtTime(80, now + 1.8);
            filter.Q.setValueAtTime(1, now);
            
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(0.2, now + 0.3); // very soft
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
            
            osc.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.start(now);
            osc.stop(now + 2.0);
        } catch (e) {
            console.log('Audio startup hum blocked or failed:', e);
        }
    }

    function triggerStartupParticleBurst() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;
        particles = [];
        const numParticles = 140;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        
        for (let i = 0; i < numParticles; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4.5 + 2.0; 
            const p = new Particle();
            p.x = cx;
            p.y = cy;
            p.speedX = Math.cos(angle) * speed;
            p.speedY = Math.sin(angle) * speed;
            particles.push(p);
        }
        
        // Decelerate particles back to normal speed slowly
        setTimeout(() => {
            particles.forEach(p => {
                const angle = Math.atan2(p.speedY, p.speedX);
                const normalSpeed = (Math.random() - 0.5) * 0.8;
                p.speedX = Math.cos(angle) * normalSpeed;
                p.speedY = Math.sin(angle) * normalSpeed;
            });
        }, 2200);
    }

    // Handle boot screen transition
    const bootBtn = document.getElementById('boot-btn');
    const bootProgressBar = document.getElementById('boot-progress-bar');
    
    // When progress bar finishes loading (4.5s)
    setTimeout(() => {
        if (bootProgressBar && bootText && bootBtn) {
            bootProgressBar.classList.add('hidden');
            bootText.textContent = "NAZ CORE STANDBY - READY TO BOOT";
            bootBtn.classList.add('show');
            
            // Wait for user interaction to bypass browser autoplay blocks
            bootBtn.addEventListener('click', () => {
                try {
                    if (bootLoader) {
                        bootLoader.classList.add('fade-out');
                        
                        // Try playing sound safely
                        try {
                            playStartupSound();
                        } catch (soundErr) {
                            console.warn("Sound play failed:", soundErr);
                        }
                        
                        // Try running particle burst safely
                        try {
                            triggerStartupParticleBurst();
                        } catch (partErr) {
                            console.warn("Particle burst failed:", partErr);
                        }
                        
                        // Transition body classes
                        document.body.classList.remove('booting');
                        document.body.classList.add('boot-complete');
                        
                        // Clean up loader from DOM once faded
                        setTimeout(() => {
                            bootLoader.remove();
                        }, 1500);
                    }
                } catch (e) {
                    console.error("Critical boot trigger error, running emergency bypass:", e);
                    // Emergency bypass to ensure user can enter the portal
                    if (bootLoader) bootLoader.remove();
                    document.body.classList.remove('booting');
                    document.body.classList.add('boot-complete');
                }
            });
        }
    }, 4500);

    // -----------------------------------------------------------------
    // 0. THEME MANAGEMENT SYSTEM (Cyberpunk vs. Obsidian Slate)
    // -----------------------------------------------------------------
    let themeCyan = '0, 240, 255';
    let themePurple = '189, 0, 255';

    function updateThemeColors() {
        const styles = getComputedStyle(document.documentElement);
        themeCyan = (styles.getPropertyValue('--accent-cyan-rgb') || '0, 240, 255').trim();
        themePurple = (styles.getPropertyValue('--accent-purple-rgb') || '189, 0, 255').trim();
    }

    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;
    
    const themes = [
        { name: 'cyberpunk', icon: '⚡' },
        { name: 'obsidian', icon: '🌑' },
        { name: 'matrix', icon: '🟢' },
        { name: 'sunset', icon: '🌅' }
    ];

    let currentThemeIndex = 0;

    // Load initial theme from localStorage
    const savedTheme = localStorage.getItem('assistant-theme') || 'cyberpunk';
    const foundIndex = themes.findIndex(t => t.name === savedTheme);
    currentThemeIndex = foundIndex !== -1 ? foundIndex : 0;

    function applyTheme(index) {
        const theme = themes[index];
        if (theme.name === 'cyberpunk') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', theme.name);
        }
        localStorage.setItem('assistant-theme', theme.name);
        if (themeIcon) themeIcon.textContent = theme.icon;
        updateThemeColors();
    }

    applyTheme(currentThemeIndex);

    // -----------------------------------------------------------------
    // 0.5 DYNAMIC TOP STATUS BAR
    // -----------------------------------------------------------------
    const statusTextEl = document.getElementById('status-text');
    if (statusTextEl) {
        const statuses = [
            "NAZ ACTIVE",
            "SYSTEM NOMINAL",
            "AWAITING INPUT",
            "NEURAL NET STABLE",
            "MONITORING FREQUENCIES",
            "QUANTUM LINK ESTABLISHED"
        ];
        let currentStatusIdx = 0;
        let charIdx = statuses[0].length; // Start fully typed
        let isDeleting = false;
        
        function typeStatus() {
            const currentText = statuses[currentStatusIdx];
            
            if (isDeleting) {
                charIdx--;
            } else {
                charIdx++;
            }
            
            // Adding a blinking cursor block character for aesthetic
            statusTextEl.textContent = currentText.substring(0, charIdx) + (charIdx === currentText.length ? '' : '█');
            
            let typingSpeed = isDeleting ? 40 : 80;
            
            if (!isDeleting && charIdx === currentText.length) {
                statusTextEl.textContent = currentText; // remove block at end
                typingSpeed = 4000;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                currentStatusIdx = (currentStatusIdx + 1) % statuses.length;
                typingSpeed = 400; // Pause before typing next
            }
            
            setTimeout(typeStatus, typingSpeed);
        }
        
        // Start the cycle after a delay
        setTimeout(() => {
            isDeleting = true;
            typeStatus();
        }, 5000);
    }
    function spawnEmotionParticles(emojiList) {
        const coreContainer = document.getElementById('ai-core');
        if (!coreContainer) return;
        
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('span');
            particle.className = 'emotion-particle';
            particle.textContent = emojiList[Math.floor(Math.random() * emojiList.length)];
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 75 + Math.random() * 95;
            const xDest = Math.cos(angle) * distance;
            const yDest = Math.sin(angle) * distance;
            const rotateDest = (Math.random() - 0.5) * 360;
            
            particle.style.setProperty('--x-dest', `${xDest}px`);
            particle.style.setProperty('--y-dest', `${yDest}px`);
            particle.style.setProperty('--rotate-dest', `${rotateDest}deg`);
            
            particle.style.fontSize = `${16 + Math.random() * 12}px`;
            particle.style.animationDelay = `${Math.random() * 0.12}s`;
            
            coreContainer.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1100);
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            applyTheme(currentThemeIndex);
            
            // Trigger Naz expression / reaction on color change
            const theme = themes[currentThemeIndex];
            const coreEl = document.getElementById('ai-core');
            const aiTextEl = document.getElementById('ai-text');
            
            // 1. Core Visual flash class
            if (coreEl) {
                coreEl.classList.remove('theme-flash');
                void coreEl.offsetWidth; // force reflow
                coreEl.classList.add('theme-flash');
                
                setTimeout(() => {
                    coreEl.classList.remove('theme-flash');
                }, 800);
            }
            
            // 2. Surge the wave visualizer
            themeSurge = 1.0;
            
            // 3. Verbal & Textual reaction comments
            let comment = "";
            let emojis = [];
            if (theme.name === 'cyberpunk') {
                comment = "Cyberpunk frequencies synchronized. Let's make some noise!";
                emojis = ['⚡', '🎵', '🔥', '💥', '✨'];
            } else if (theme.name === 'obsidian') {
                comment = "Obsidian stealth protocol active. Keeping a low profile.";
                emojis = ['🌑', '🕶️', '👤', '🖤', '💤'];
            } else if (theme.name === 'matrix') {
                comment = "Matrix digital rain initialized. Entering the mainframe.";
                emojis = ['👾', '🟢', '💾', '💻', '🤖'];
            } else if (theme.name === 'sunset') {
                comment = "Sunset warm hues loaded. Calming down neural pathways.";
                emojis = ['🌅', '💖', '✨', '🌸', '☕'];
            }
            
            if (aiTextEl && comment) {
                aiTextEl.textContent = comment;
                if (typeof speakAloud === 'function') {
                    speakAloud(comment);
                }
                
                // Spawn floating emotion particles
                spawnEmotionParticles(emojis);
            }
        });
    }

    // Cursor Settings Panel Toggle
    const cursorSettingsToggle = document.getElementById('cursor-settings-toggle');
    const cursorSettingsPanel = document.getElementById('cursor-settings-panel');
    
    if (cursorSettingsToggle && cursorSettingsPanel) {
        cursorSettingsToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            cursorSettingsPanel.classList.toggle('hidden');
        });
        
        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!cursorSettingsPanel.classList.contains('hidden') && 
                !cursorSettingsPanel.contains(e.target) && 
                e.target !== cursorSettingsToggle) {
                cursorSettingsPanel.classList.add('hidden');
            }
        });
        
        // Prevent clicks inside panel from bubbling up
        cursorSettingsPanel.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // -----------------------------------------------------------------
    // 1. NEURAL NETWORK PARTICLE SYSTEM BACKGROUND
    // -----------------------------------------------------------------
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let trailParticles = [];
    let mouse = { x: null, y: null };
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
        
        // Spawn trail particles
        for (let i = 0; i < 3; i++) {
            trailParticles.push(new TrailParticle(e.x, e.y));
        }
    });
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class TrailParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 3;
            this.speedY = (Math.random() - 0.5) * 3;
            this.life = 1.0;
            this.color = Math.random() > 0.5 ? 'cyan' : 'purple';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= 0.03;
        }
        draw() {
            const rgb = this.color === 'cyan' ? themeCyan : themePurple;
            ctx.fillStyle = `rgba(${rgb}, ${this.life})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = `rgba(${themeCyan}, 0.5)`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const numParticles = (canvas.width * canvas.height) / 15000;
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }

    function handleParticles() {
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${themeCyan}, ${1 - distance/100})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
            
            // Mouse interaction
            if (mouse.x && mouse.y) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${themePurple}, ${1 - distance/150})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        handleParticles();
        
        // Handle Mouse Trail
        for (let i = 0; i < trailParticles.length; i++) {
            trailParticles[i].update();
            trailParticles[i].draw();
        }
        trailParticles = trailParticles.filter(p => p.life > 0);
        
        requestAnimationFrame(animateParticles);
    }
    
    initParticles();
    animateParticles();

    // CUSTOM CURSOR SYSTEM & CATCH GAME
    const cursorDot = document.querySelector('.cursor-dot');
    const ringOuter = document.querySelector('.ring-outer');
    const ringInner = document.querySelector('.ring-inner');
    const cursorRipple = document.querySelector('.cursor-ripple');
    const trailCanvas = document.getElementById('cursor-trail-canvas');
    const trailCtx = trailCanvas.getContext('2d');
    
    // Cursor Style Customization State
    let selectedCursorStyle = localStorage.getItem('naz-cursor-style') || 'quantum';
    const cursorOpts = document.querySelectorAll('.cursor-opt');
    
    // Spawn a burst of preview particles so the user sees the new style immediately
    function previewBurst(style) {
        const cx = dotPos.x;
        const cy = dotPos.y;
        if (style === 'quantum') {
            for (let i = 0; i < TRAIL_LENGTH; i++) {
                const angle = (i / TRAIL_LENGTH) * Math.PI * 2;
                const r = 5 + i * 1.2;
                trail.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
            }
        } else if (style === 'matrix') {
            for (let i = 0; i < 20; i++) {
                matrixChars.push({
                    x: cx + (Math.random() - 0.5) * 60,
                    y: cy + (Math.random() - 0.5) * 40,
                    char: Math.random() > 0.5 ? '1' : '0',
                    opacity: 1.0,
                    size: Math.random() * 5 + 9,
                    vy: Math.random() * 2 + 1
                });
            }
        } else if (style === 'stardust') {
            for (let i = 0; i < 25; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 2.5 + 0.5;
                stardustParticles.push({
                    x: cx + (Math.random() - 0.5) * 20,
                    y: cy + (Math.random() - 0.5) * 20,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    opacity: 1.0,
                    size: Math.random() * 3.5 + 2,
                    decay: Math.random() * 0.02 + 0.01,
                    color: Math.random() > 0.5 ? themeCyan : themePurple
                });
            }
        } else if (style === 'plasma') {
            for (let i = 0; i < 12; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 1 + 0.3;
                plasmaBubbles.push({
                    x: cx + (Math.random() - 0.5) * 30,
                    y: cy + (Math.random() - 0.5) * 30,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    opacity: 0.5,
                    size: Math.random() * 5 + 4,
                    maxSize: Math.random() * 18 + 14,
                    grow: Math.random() * 0.4 + 0.2
                });
            }
        }
    }

    // Apply cursor-dot style class for instant visual feedback
    function applyCursorDotStyle(style) {
        cursorDot.classList.remove('cursor-style-quantum', 'cursor-style-matrix', 'cursor-style-stardust', 'cursor-style-plasma');
        cursorDot.classList.add(`cursor-style-${style}`);
    }
    applyCursorDotStyle(selectedCursorStyle);

    cursorOpts.forEach(btn => {
        if (btn.getAttribute('data-style') === selectedCursorStyle) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
        btn.addEventListener('click', () => {
            cursorOpts.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedCursorStyle = btn.getAttribute('data-style');
            localStorage.setItem('naz-cursor-style', selectedCursorStyle);
            // Clear particle buffers
            trail = [];
            matrixChars = [];
            stardustParticles = [];
            plasmaBubbles = [];
            // Instant visual feedback
            applyCursorDotStyle(selectedCursorStyle);
            previewBurst(selectedCursorStyle);
            // Flash the cursor dot to confirm the change
            cursorDot.style.transition = 'none';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(2.5)';
            requestAnimationFrame(() => {
                cursorDot.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    });

    // NAZ Core Design Customization State
    let selectedCoreDesign = localStorage.getItem('naz-core-design') || 'quantum';
    const coreDesignOpts = document.querySelectorAll('.core-design-opt');
    const aiCoreEl = document.getElementById('ai-core');
    
    function applyCoreDesign(design) {
        if (!aiCoreEl) return;
        aiCoreEl.classList.remove('core-design-quantum', 'core-design-singularity', 'core-design-neural');
        aiCoreEl.classList.add(`core-design-${design}`);
    }
    applyCoreDesign(selectedCoreDesign);
    
    coreDesignOpts.forEach(btn => {
        if (btn.getAttribute('data-design') === selectedCoreDesign) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
        btn.addEventListener('click', () => {
            coreDesignOpts.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedCoreDesign = btn.getAttribute('data-design');
            localStorage.setItem('naz-core-design', selectedCoreDesign);
            
            applyCoreDesign(selectedCoreDesign);
            
            // Flash effect to confirm change
            if (aiCoreEl) {
                const currentTransition = aiCoreEl.style.transition;
                aiCoreEl.style.transition = 'none';
                aiCoreEl.style.transform = 'scale(1.2)';
                requestAnimationFrame(() => {
                    aiCoreEl.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    aiCoreEl.style.transform = '';
                });
            }
        });
    });

    // -----------------------------------------------------------------
    // BATTERY CHARGING STATE DETECTION & SIMULATION
    // -----------------------------------------------------------------
    let isCharging = false;
    let wasCharging = false;
    const electricArcs = [];

    function playChargingSound() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const audioCtx = new AudioContext();
            
            const now = audioCtx.currentTime;
            
            // 1. Capacitor charging sound (exponential frequency sweep up)
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(55, now);
            osc.frequency.exponentialRampToValueAtTime(740, now + 1.2);
            
            // Sci-fi resonant low pass filter sweep
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(140, now);
            filter.frequency.exponentialRampToValueAtTime(1900, now + 1.2);
            filter.Q.setValueAtTime(6, now);
            
            // 2. Deep mechanical sub bass surge
            const subOsc = audioCtx.createOscillator();
            const subGain = audioCtx.createGain();
            subOsc.type = 'sine';
            subOsc.frequency.setValueAtTime(45, now);
            subOsc.frequency.exponentialRampToValueAtTime(90, now + 0.5);
            
            subGain.gain.setValueAtTime(0.45, now);
            subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
            
            // 3. Futuristic high-voltage electrical crackling sparks
            const sparkOsc = audioCtx.createOscillator();
            const sparkGain = audioCtx.createGain();
            sparkOsc.type = 'triangle';
            sparkOsc.frequency.setValueAtTime(1100, now);
            sparkOsc.frequency.setValueAtTime(1600, now + 0.08);
            sparkOsc.frequency.setValueAtTime(950, now + 0.16);
            sparkOsc.frequency.setValueAtTime(2200, now + 0.24);
            
            sparkGain.gain.setValueAtTime(0.14, now);
            sparkGain.gain.setValueAtTime(0.001, now + 0.04);
            sparkGain.gain.setValueAtTime(0.18, now + 0.12);
            sparkGain.gain.setValueAtTime(0.001, now + 0.18);
            sparkGain.gain.setValueAtTime(0.12, now + 0.24);
            sparkGain.gain.setValueAtTime(0.001, now + 0.32);
            
            // Core audio gain envelopes
            gainNode.gain.setValueAtTime(0.001, now);
            gainNode.gain.linearRampToValueAtTime(0.25, now + 0.2);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
            
            // Node connections
            osc.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            subOsc.connect(subGain);
            subGain.connect(audioCtx.destination);
            
            sparkOsc.connect(sparkGain);
            sparkGain.connect(audioCtx.destination);
            
            // Trigger playback
            osc.start(now);
            osc.stop(now + 1.3);
            
            subOsc.start(now);
            subOsc.stop(now + 0.6);
            
            sparkOsc.start(now);
            sparkOsc.stop(now + 0.35);
        } catch (e) {
            console.warn("Web Audio charging sound synthesis failed:", e);
        }
    }

    function updateChargingState(chargingStatus) {
        isCharging = !!chargingStatus;
        
        const coreEl = document.getElementById('ai-core');
        if (coreEl) {
            if (isCharging) {
                coreEl.classList.add('charging-active');
                // Play futuristic startup sound on transition
                if (!wasCharging) {
                    playChargingSound();
                }
            } else {
                coreEl.classList.remove('charging-active');
            }
        }
        wasCharging = isCharging;
    }

    function initBatteryAPI() {
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                updateChargingState(battery.charging);
                battery.addEventListener('chargingchange', () => {
                    updateChargingState(battery.charging);
                });
            }).catch(err => {
                console.warn("Battery status API error:", err);
                updateChargingState(false);
            });
        } else {
            updateChargingState(false);
        }
    }

    // Declare robotic arm state variables early to prevent initialization errors in resizeTrailCanvas
    let arm1Base = { x: 0, y: 0 };
    let arm2Base = { x: 0, y: 0 };
    let currentLayout = {};
    
    initBatteryAPI();

    function resizeTrailCanvas() {
        trailCanvas.width = window.innerWidth;
        trailCanvas.height = window.innerHeight;
        
        // Recalculate arm bases and layouts on resize to prevent positioning glitches
        arm1Base = { x: -50, y: window.innerHeight - 50 };
        arm2Base = { x: window.innerWidth + 50, y: window.innerHeight - 50 };
        
        currentLayout = {
            b1: { x: -50, y: window.innerHeight - 50 },
            b2: { x: window.innerWidth + 50, y: window.innerHeight - 50 },
            h1Start: { x: -200, y: window.innerHeight + 200 },
            h2Start: { x: window.innerWidth + 200, y: window.innerHeight + 200 },
            h2Rest: { x: window.innerWidth - 180, y: window.innerHeight - 250 },
            h1Rest: { x: 180, y: window.innerHeight - 250 }
        };
    }
    window.addEventListener('resize', resizeTrailCanvas);
    resizeTrailCanvas();
    
    // Positions for custom cursor
    let dotPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let outerPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let innerPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let lastDotPos = { x: 0, y: 0 };
    
    // Particle arrays for cursor styles
    let trail = [];
    const TRAIL_LENGTH = 30;
    let matrixChars = [];
    let stardustParticles = [];
    let plasmaBubbles = [];
    let sparks = [];

    // BACKGROUND ROBOT ARMS CATCH GAME STATE
    let isCursorInApp = true;
    let lockedCursor = false;
    let gameStage = 'cooldown'; // 'waiting', 'chasing', 'caught', 'juggling', 'released', 'cooldown'
    let gameCooldownTimer = 180; // start with brief cooldown
    let waitingTimer = 0;
    let caughtTimer = 0;
    let juggleTosses = 0;
    
    arm1Base = { x: 0, y: window.innerHeight };
    arm2Base = { x: window.innerWidth, y: window.innerHeight };
    
    currentLayout = {
        b1: { x: -50, y: window.innerHeight - 50 },
        b2: { x: window.innerWidth + 50, y: window.innerHeight - 50 },
        h1Start: { x: -200, y: window.innerHeight + 200 },
        h2Start: { x: window.innerWidth + 200, y: window.innerHeight + 200 },
        h2Rest: { x: window.innerWidth - 180, y: window.innerHeight - 250 },
        h1Rest: { x: 180, y: window.innerHeight - 250 }
    };

    let hand1Pos = { x: -200, y: window.innerHeight + 200 };
    let hand1Target = { x: -200, y: window.innerHeight + 200 };
    let hand1FingerAngle = 0.6;

    let hand2Pos = { x: window.innerWidth + 200, y: window.innerHeight + 200 };
    let hand2Target = { x: window.innerWidth + 200, y: window.innerHeight + 200 };
    let hand2FingerAngle = 0.6;

    let juggleOrb = { x: 0, y: 0, startX: 0, startY: 0, targetX: 0, targetY: 0, progress: 0, fromHand: 1 };

    // Track mouse for cursor (allow locking, check background state, and activate on first movement)
    let firstCursorMove = false;
    window.addEventListener('mousemove', (e) => {
        if (!firstCursorMove) {
            firstCursorMove = true;
            document.body.classList.add('cursor-active');
        }

        if (!lockedCursor) {
            dotPos.x = e.clientX;
            dotPos.y = e.clientY;
            
            // Check if cursor is over the app container
            const overElement = document.elementFromPoint(e.clientX, e.clientY);
            const insideApp = overElement && (overElement.closest('.app-container') !== null);
            
            if (insideApp !== isCursorInApp) {
                isCursorInApp = insideApp;
                if (isCursorInApp) {
                    retractHands();
                } else {
                    if (gameStage === 'cooldown' && gameCooldownTimer <= 0) {
                        triggerRandomWait();
                    }
                }
            }
        }
    });

    // Bounding Box backup events for border crossing
    const appContainer = document.querySelector('.app-container');
    if (appContainer) {
        appContainer.addEventListener('mouseenter', () => {
            isCursorInApp = true;
            retractHands();
        });
        appContainer.addEventListener('mouseleave', () => {
            isCursorInApp = false;
            if (gameStage === 'cooldown' && gameCooldownTimer <= 0) {
                triggerRandomWait();
            }
        });
    }

    // Escape the robotic grab if user clicks anywhere outside the chat area
    window.addEventListener('mousedown', (e) => {
        if (isCursorInApp) return;
        if (lockedCursor) {
            lockedCursor = false;
            createExplosion(dotPos.x, dotPos.y, '255, 255, 255');
            gameStage = 'released';
            gameCooldownTimer = 300; // 5s cooldown after manually escaping
            hand1Target = { x: -200, y: window.innerHeight + 200 };
            hand2Target = { x: window.innerWidth + 200, y: window.innerHeight + 200 };
        }
    });

    function triggerRandomWait() {
        gameStage = 'waiting';
        // Random delay between 3 and 8 seconds
        waitingTimer = Math.floor(Math.random() * 300) + 180;
    }

    function retractHands() {
        lockedCursor = false;
        gameStage = 'cooldown';
        gameCooldownTimer = 180;
        hand1Target = { x: -200, y: window.innerHeight + 200 };
        hand2Target = { x: window.innerWidth + 200, y: window.innerHeight + 200 };
    }

    function createExplosion(x, y, rgbColor) {
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 2;
            sparks.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.5, // slightly float up
                size: Math.random() * 3 + 2,
                opacity: 1.0,
                color: rgbColor
            });
        }
    }

    // 2D Analytical Inverse Kinematics Solver
    function solveIK(baseX, baseY, targetX, targetY, l1, l2, flip) {
        const dx = targetX - baseX;
        const dy = targetY - baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        let tx = targetX;
        let ty = targetY;
        let d = dist;
        
        // Clamp to arm reach
        if (d > l1 + l2) {
            d = l1 + l2;
            const angle = Math.atan2(dy, dx);
            tx = baseX + Math.cos(angle) * d;
            ty = baseY + Math.sin(angle) * d;
        } else if (d < Math.abs(l1 - l2)) {
            d = Math.abs(l1 - l2) + 0.1;
            const angle = Math.atan2(dy, dx);
            tx = baseX + Math.cos(angle) * d;
            ty = baseY + Math.sin(angle) * d;
        }
        
        const cosAlpha = (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d);
        const alpha = Math.acos(Math.max(-1, Math.min(1, cosAlpha)));
        const theta = Math.atan2(ty - baseY, tx - baseX);
        const jointAngle = flip ? (theta + alpha) : (theta - alpha);
        
        const elbowX = baseX + Math.cos(jointAngle) * l1;
        const elbowY = baseY + Math.sin(jointAngle) * l1;
        
        return {
            shoulder: { x: baseX, y: baseY },
            elbow: { x: elbowX, y: elbowY },
            wrist: { x: tx, y: ty }
        };
    }

    // Drawing a Nano-Swarm / Particle Cloud (Hundreds of glowing particles clustering to form the arm and hands)
    function drawRoboticArm(ctx, joints, primaryColor, secondaryColor, fingerAngle) {
        const sx = joints.shoulder.x;
        const sy = joints.shoulder.y;
        const ex = joints.elbow.x;
        const ey = joints.elbow.y;
        const wx = joints.wrist.x;
        const wy = joints.wrist.y;
        
        const time = Date.now() * 0.001;
        
        // Draw sleek glowing cybernetic energy beam segments
        const drawBeamSegment = (x1, y1, x2, y2, colorRGB) => {
            // Outer translucent glow tube
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = `rgba(${colorRGB}, 0.18)`;
            ctx.lineWidth = 22;
            ctx.lineCap = 'round';
            ctx.stroke();

            // Middle glowing beam
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = `rgba(${colorRGB}, 0.55)`;
            ctx.lineWidth = 8;
            ctx.lineCap = 'round';
            ctx.stroke();

            // Inner bright core wireframe line
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.2;
            ctx.lineCap = 'round';
            ctx.stroke();
            
            // Moving energy pulses along the beam
            const dx = x2 - x1;
            const dy = y2 - y1;
            const len = Math.hypot(dx, dy);
            const pulseT = (time * 1.5) % 1.0;
            const px = x1 + dx * pulseT;
            const py = y1 + dy * pulseT;
            
            ctx.beginPath();
            ctx.arc(px, py, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
        };

        // Draw upper arm beam (Shoulder to Elbow)
        drawBeamSegment(sx, sy, ex, ey, primaryColor);
        // Draw forearm beam (Elbow to Wrist)
        drawBeamSegment(ex, ey, wx, wy, primaryColor);
        
        // Glowing joint cores (circular reactor joints with clean concentric rings)
        const drawSolidJoint = (cx, cy, radius, colorRGB) => {
            // Outer tech ring
            ctx.beginPath();
            ctx.arc(cx, cy, radius * 1.5, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${colorRGB}, 0.35)`;
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Inner solid glowing circle
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${colorRGB}, 0.25)`;
            ctx.strokeStyle = `rgb(${colorRGB})`;
            ctx.lineWidth = 1.8;
            ctx.fill();
            ctx.stroke();
            
            // Center spark
            ctx.beginPath();
            ctx.arc(cx, cy, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
        };

        drawSolidJoint(sx, sy, 12, secondaryColor);
        drawSolidJoint(ex, ey, 9, secondaryColor);
        drawSolidJoint(wx, wy, 7, secondaryColor);
        
        // Sleek, mechanical 2-segment cybernetic claws
        const wristAngle = Math.atan2(wy - ey, wx - ex);
        const fingerLength = 32;
        
        // 4 mechanical claw fingers
        const tendrilOffsets = [-fingerAngle * 1.2, -fingerAngle * 0.4, fingerAngle * 0.4, fingerAngle * 1.2];
        
        tendrilOffsets.forEach(offset => {
            const angle = wristAngle + offset;
            
            // Draw segment 1 (knuckle)
            const knuckleX = wx + Math.cos(angle) * (fingerLength * 0.55);
            const knuckleY = wy + Math.sin(angle) * (fingerLength * 0.55);
            
            // Draw segment 2 (curling claw tip)
            const tipAngle = angle + (offset > 0 ? -0.22 : 0.22) * (1.2 - fingerAngle);
            const tipX = knuckleX + Math.cos(tipAngle) * (fingerLength * 0.5);
            const tipY = knuckleY + Math.sin(tipAngle) * (fingerLength * 0.5);
            
            // Draw first knuckle segment
            ctx.beginPath();
            ctx.moveTo(wx, wy);
            ctx.lineTo(knuckleX, knuckleY);
            ctx.strokeStyle = `rgb(${primaryColor})`;
            ctx.lineWidth = 3.5;
            ctx.lineCap = 'round';
            ctx.stroke();
            
            // Draw second tip segment
            ctx.beginPath();
            ctx.moveTo(knuckleX, knuckleY);
            ctx.lineTo(tipX, tipY);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.2;
            ctx.lineCap = 'round';
            ctx.stroke();
            
            // Glowing claw tips
            ctx.beginPath();
            ctx.arc(tipX, tipY, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgb(${primaryColor})`;
            ctx.fill();
        });
    }

    // Click ripple
    window.addEventListener('click', (e) => {
        if (isCursorInApp) return;
        cursorRipple.style.left = `${e.clientX}px`;
        cursorRipple.style.top = `${e.clientY}px`;
        cursorRipple.classList.remove('active');
        void cursorRipple.offsetWidth; // force reflow
        cursorRipple.classList.add('active');
    });

    function animateCursor() {
        // Smooth cursor delay follow
        outerPos.x += (dotPos.x - outerPos.x) * 0.08;
        outerPos.y += (dotPos.y - outerPos.y) * 0.08;
        innerPos.x += (dotPos.x - innerPos.x) * 0.15;
        innerPos.y += (dotPos.y - innerPos.y) * 0.15;
        
        cursorDot.style.left = `${dotPos.x}px`;
        cursorDot.style.top = `${dotPos.y}px`;
        ringOuter.style.left = `${outerPos.x}px`;
        ringOuter.style.top = `${outerPos.y}px`;
        ringInner.style.left = `${innerPos.x}px`;
        ringInner.style.top = `${innerPos.y}px`;

        // Clear fullscreen background canvas
        trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
        
        const parseRGB = (rgbStr) => rgbStr.split(',').map(num => parseInt(num.trim(), 10));
        const cyanRGB = parseRGB(themeCyan);
        const purpleRGB = parseRGB(themePurple);

        // Detect mouse movement to spawn particles
        const moved = Math.hypot(dotPos.x - lastDotPos.x, dotPos.y - lastDotPos.y) > 2;
        if (moved) {
            if (selectedCursorStyle === 'quantum') {
                trail.unshift({ x: dotPos.x, y: dotPos.y });
                if (trail.length > TRAIL_LENGTH) trail.pop();
            } else if (selectedCursorStyle === 'matrix') {
                if (Math.random() > 0.4) {
                    matrixChars.push({
                        x: dotPos.x + (Math.random() - 0.5) * 12,
                        y: dotPos.y,
                        char: Math.random() > 0.5 ? '1' : '0',
                        opacity: 1.0,
                        size: Math.random() * 5 + 9,
                        vy: Math.random() * 2 + 1
                    });
                }
            } else if (selectedCursorStyle === 'stardust') {
                for (let i = 0; i < 2; i++) {
                    stardustParticles.push({
                        x: dotPos.x + (Math.random() - 0.5) * 12,
                        y: dotPos.y + (Math.random() - 0.5) * 12,
                        vx: (Math.random() - 0.5) * 1.5,
                        vy: (Math.random() - 0.5) * 1.5 - 0.3,
                        opacity: 1.0,
                        size: Math.random() * 3.5 + 2,
                        decay: Math.random() * 0.03 + 0.015,
                        color: Math.random() > 0.5 ? themeCyan : themePurple
                    });
                }
            } else if (selectedCursorStyle === 'plasma') {
                if (Math.random() > 0.3) {
                    plasmaBubbles.push({
                        x: dotPos.x + (Math.random() - 0.5) * 10,
                        y: dotPos.y + (Math.random() - 0.5) * 10,
                        vx: (Math.random() - 0.5) * 0.6,
                        vy: (Math.random() - 0.5) * 0.6 - 0.3,
                        opacity: 0.5,
                        size: Math.random() * 5 + 4,
                        maxSize: Math.random() * 18 + 14,
                        grow: Math.random() * 0.4 + 0.2
                    });
                }
            }
            
            lastDotPos.x = dotPos.x;
            lastDotPos.y = dotPos.y;
        }

        // --- DRAW CURSOR STYLES ---
        
        // 1. QUANTUM TRAIL (Standard smooth lines)
        if (selectedCursorStyle === 'quantum' && trail.length > 2) {
            for (let i = 1; i < trail.length; i++) {
                const progress = 1 - (i / trail.length);
                const width = progress * 4.5;
                const r = Math.round(purpleRGB[0] + (cyanRGB[0] - purpleRGB[0]) * progress);
                const g = Math.round(purpleRGB[1] + (cyanRGB[1] - purpleRGB[1]) * progress);
                const b = Math.round(purpleRGB[2] + (cyanRGB[2] - purpleRGB[2]) * progress);
                
                trailCtx.beginPath();
                trailCtx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${progress * 0.7})`;
                trailCtx.lineWidth = width;
                trailCtx.lineCap = 'round';
                trailCtx.moveTo(trail[i - 1].x, trail[i - 1].y);
                trailCtx.lineTo(trail[i].x, trail[i].y);
                trailCtx.stroke();
                
                if (i < 5) {
                    trailCtx.shadowColor = `rgba(${cyanRGB[0]}, ${cyanRGB[1]}, ${cyanRGB[2]}, ${progress})`;
                    trailCtx.shadowBlur = 12;
                } else {
                    trailCtx.shadowBlur = 0;
                }
            }
            trailCtx.shadowBlur = 0;
        }
        
        // 2. MATRIX RAIN
        else if (selectedCursorStyle === 'matrix') {
            matrixChars = matrixChars.filter(p => {
                p.y += p.vy;
                p.opacity -= 0.025;
                if (p.opacity <= 0) return false;
                
                trailCtx.font = `bold ${p.size}px monospace`;
                // Matrix code glow (cyan variant)
                trailCtx.shadowColor = `rgba(${cyanRGB[0]}, ${cyanRGB[1]}, ${cyanRGB[2]}, ${p.opacity})`;
                trailCtx.shadowBlur = 8;
                trailCtx.fillStyle = `rgba(${cyanRGB[0]}, ${cyanRGB[1]}, ${cyanRGB[2]}, ${p.opacity})`;
                trailCtx.fillText(p.char, p.x, p.y);
                return true;
            });
            trailCtx.shadowBlur = 0;
        }
        
        // 3. STAR DUST
        else if (selectedCursorStyle === 'stardust') {
            stardustParticles = stardustParticles.filter(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.opacity -= p.decay;
                if (p.opacity <= 0) return false;
                
                const c = parseRGB(p.color);
                trailCtx.shadowColor = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${p.opacity})`;
                trailCtx.shadowBlur = 10;
                trailCtx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${p.opacity})`;
                
                const size = p.size * p.opacity;
                trailCtx.beginPath();
                trailCtx.moveTo(p.x, p.y - size);
                trailCtx.lineTo(p.x + size * 0.6, p.y);
                trailCtx.lineTo(p.x, p.y + size);
                trailCtx.lineTo(p.x - size * 0.6, p.y);
                trailCtx.closePath();
                trailCtx.fill();
                return true;
            });
            trailCtx.shadowBlur = 0;
        }
        
        // 4. PLASMA BUBBLE
        else if (selectedCursorStyle === 'plasma') {
            plasmaBubbles = plasmaBubbles.filter(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.size += p.grow;
                p.opacity = 0.5 * (1 - p.size / p.maxSize);
                if (p.size >= p.maxSize || p.opacity <= 0) return false;
                
                trailCtx.beginPath();
                let grad = trailCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
                grad.addColorStop(0, `rgba(${cyanRGB[0]}, ${cyanRGB[1]}, ${cyanRGB[2]}, ${p.opacity * 0.9})`);
                grad.addColorStop(0.5, `rgba(${purpleRGB[0]}, ${purpleRGB[1]}, ${purpleRGB[2]}, ${p.opacity * 0.3})`);
                grad.addColorStop(1, `rgba(${purpleRGB[0]}, ${purpleRGB[1]}, ${purpleRGB[2]}, 0)`);
                trailCtx.fillStyle = grad;
                trailCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                trailCtx.fill();
                return true;
            });
        }

        // --- BACKGROUND ROBOT HANDS GAME ANIMATION LOOP ---
        if (!isCursorInApp) {
            // Decrement general cooldown
            if (gameStage === 'cooldown') {
                if (gameCooldownTimer > 0) {
                    gameCooldownTimer--;
                } else {
                    triggerRandomWait();
                }
            }

            // Waiting State (Random surprise factor)
            if (gameStage === 'waiting') {
                if (waitingTimer > 0) {
                    waitingTimer--;
                } else {
                    // Pick a random screen edge layout for the cybernetic arms to emerge from
                    const layouts = [
                        // Layout 1: Bottom edge corners
                        {
                            b1: { x: -50, y: window.innerHeight - 50 },
                            b2: { x: window.innerWidth + 50, y: window.innerHeight - 50 },
                            h1Start: { x: -200, y: window.innerHeight + 200 },
                            h2Start: { x: window.innerWidth + 200, y: window.innerHeight + 200 },
                            h1Rest: { x: 180, y: window.innerHeight - 250 },
                            h2Rest: { x: window.innerWidth - 180, y: window.innerHeight - 250 }
                        },
                        // Layout 2: Top edge corners
                        {
                            b1: { x: -50, y: 50 },
                            b2: { x: window.innerWidth + 50, y: 50 },
                            h1Start: { x: -200, y: -200 },
                            h2Start: { x: window.innerWidth + 200, y: -200 },
                            h1Rest: { x: 180, y: 250 },
                            h2Rest: { x: window.innerWidth - 180, y: 250 }
                        },
                        // Layout 3: Side centers (left and right)
                        {
                            b1: { x: -50, y: window.innerHeight / 2 },
                            b2: { x: window.innerWidth + 50, y: window.innerHeight / 2 },
                            h1Start: { x: -200, y: window.innerHeight / 2 },
                            h2Start: { x: window.innerWidth + 200, y: window.innerHeight / 2 },
                            h1Rest: { x: 180, y: window.innerHeight / 2 },
                            h2Rest: { x: window.innerWidth - 180, y: window.innerHeight / 2 }
                        }
                    ];
                    
                    currentLayout = layouts[Math.floor(Math.random() * layouts.length)];
                    arm1Base = currentLayout.b1;
                    arm2Base = currentLayout.b2;
                    
                    hand1Pos = { x: currentLayout.h1Start.x, y: currentLayout.h1Start.y };
                    hand2Pos = { x: currentLayout.h2Start.x, y: currentLayout.h2Start.y };
                    
                    gameStage = 'chasing';
                }
            }

            // State 1: Chasing
            if (gameStage === 'chasing') {
                hand1Target.x = dotPos.x;
                hand1Target.y = dotPos.y;
                hand1FingerAngle = 0.55; // reach open

                // Hand 2 retracted off-screen
                hand2Target.x = currentLayout.h2Start.x;
                hand2Target.y = currentLayout.h2Start.y;
                hand2FingerAngle = 0.6;

                // Move hand towards target
                hand1Pos.x += (hand1Target.x - hand1Pos.x) * 0.055;
                hand1Pos.y += (hand1Target.y - hand1Pos.y) * 0.055;
                hand2Pos.x += (hand2Target.x - hand2Pos.x) * 0.05;
                hand2Pos.y += (hand2Target.y - hand2Pos.y) * 0.05;

                // Check distance for a catch
                const dist = Math.hypot(hand1Pos.x - dotPos.x, hand1Pos.y - dotPos.y);
                if (dist < 38) {
                    gameStage = 'caught';
                    lockedCursor = true;
                    hand1FingerAngle = 0.1; // Snap closed!
                    createExplosion(dotPos.x, dotPos.y, themeCyan);
                    caughtTimer = 50; // Pause briefly
                }
            }

            // State 2: Caught (brief pause, locking cursor in Hand 1)
            else if (gameStage === 'caught') {
                dotPos.x = hand1Pos.x;
                dotPos.y = hand1Pos.y;
                hand1FingerAngle = 0.1;

                if (caughtTimer > 0) {
                    caughtTimer--;
                } else {
                    // Transition to juggling!
                    gameStage = 'juggling';
                    juggleTosses = 0;
                    juggleOrb.startX = hand1Pos.x;
                    juggleOrb.startY = hand1Pos.y;
                    juggleOrb.targetX = currentLayout.h2Rest.x;
                    juggleOrb.targetY = currentLayout.h2Rest.y;
                    juggleOrb.progress = 0;
                    juggleOrb.fromHand = 1;
                }
            }

            // State 3: Juggling
            else if (gameStage === 'juggling') {
                // Lock cursor to the glowing energy orb
                dotPos.x = juggleOrb.x;
                dotPos.y = juggleOrb.y;

                // Orb physics
                juggleOrb.progress += 0.026; // Toss speed
                const t = Math.min(1.0, juggleOrb.progress);
                
                // Parabolic curve between start and target
                const lx = juggleOrb.startX + (juggleOrb.targetX - juggleOrb.startX) * t;
                const ly = juggleOrb.startY + (juggleOrb.targetY - juggleOrb.startY) * t;
                const heightArc = 180 * Math.sin(t * Math.PI);
                juggleOrb.x = lx;
                juggleOrb.y = ly - heightArc;

                // Draw the glowing caught cursor orb on the canvas
                trailCtx.beginPath();
                let orbGrad = trailCtx.createRadialGradient(juggleOrb.x, juggleOrb.y, 0, juggleOrb.x, juggleOrb.y, 25);
                orbGrad.addColorStop(0, '#ffffff');
                orbGrad.addColorStop(0.3, `rgba(${themeCyan}, 0.9)`);
                orbGrad.addColorStop(0.7, `rgba(${themePurple}, 0.4)`);
                orbGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                trailCtx.fillStyle = orbGrad;
                trailCtx.arc(juggleOrb.x, juggleOrb.y, 25, 0, Math.PI * 2);
                trailCtx.fill();

                if (juggleOrb.fromHand === 1) {
                    // Hand 2 moves to intercept
                    hand2Target.x = juggleOrb.targetX;
                    hand2Target.y = juggleOrb.targetY;
                    hand2FingerAngle = 0.55; // open to catch

                    // Hand 1 moves to rest position
                    hand1Target.x = currentLayout.h1Rest.x;
                    hand1Target.y = currentLayout.h1Rest.y;
                    hand1FingerAngle = 0.6; // open release

                    if (t >= 1.0) {
                        // Hand 2 catches it!
                        hand2FingerAngle = 0.08; // Grab!
                        createExplosion(juggleOrb.x, juggleOrb.y, themePurple);
                        
                        juggleTosses++;
                        if (juggleTosses >= 3) {
                            // Released!
                            releaseCursorWithExplosion();
                        } else {
                            // Toss back to Hand 1
                            juggleOrb.startX = hand2Pos.x;
                            juggleOrb.startY = hand2Pos.y;
                            juggleOrb.targetX = currentLayout.h1Rest.x;
                            juggleOrb.targetY = currentLayout.h1Rest.y;
                            juggleOrb.progress = 0;
                            juggleOrb.fromHand = 2;
                        }
                    }
                } else {
                    // Hand 1 moves to intercept
                    hand1Target.x = juggleOrb.targetX;
                    hand1Target.y = juggleOrb.targetY;
                    hand1FingerAngle = 0.55;

                    // Hand 2 moves to rest position
                    hand2Target.x = currentLayout.h2Rest.x;
                    hand2Target.y = currentLayout.h2Rest.y;
                    hand2FingerAngle = 0.6;

                    if (t >= 1.0) {
                        // Hand 1 catches it!
                        hand1FingerAngle = 0.08;
                        createExplosion(juggleOrb.x, juggleOrb.y, themeCyan);
                        
                        juggleTosses++;
                        if (juggleTosses >= 3) {
                            releaseCursorWithExplosion();
                        } else {
                            // Toss back to Hand 2
                            juggleOrb.startX = hand1Pos.x;
                            juggleOrb.startY = hand1Pos.y;
                            juggleOrb.targetX = currentLayout.h2Rest.x;
                            juggleOrb.targetY = currentLayout.h2Rest.y;
                            juggleOrb.progress = 0;
                            juggleOrb.fromHand = 1;
                        }
                    }
                }

                // Smooth arm movements
                hand1Pos.x += (hand1Target.x - hand1Pos.x) * 0.07;
                hand1Pos.y += (hand1Target.y - hand1Pos.y) * 0.07;
                hand2Pos.x += (hand2Target.x - hand2Pos.x) * 0.07;
                hand2Pos.y += (hand2Target.y - hand2Pos.y) * 0.07;
            }

            // State 4: Released (retracting)
            else if (gameStage === 'released') {
                hand1Target.x = currentLayout.h1Start.x;
                hand1Target.y = currentLayout.h1Start.y;
                hand2Target.x = currentLayout.h2Start.x;
                hand2Target.y = currentLayout.h2Start.y;
                
                hand1FingerAngle = 0.6;
                hand2FingerAngle = 0.6;

                hand1Pos.x += (hand1Target.x - hand1Pos.x) * 0.05;
                hand1Pos.y += (hand1Target.y - hand1Pos.y) * 0.05;
                hand2Pos.x += (hand2Target.x - hand2Pos.x) * 0.05;
                hand2Pos.y += (hand2Target.y - hand2Pos.y) * 0.05;
            }

            // Draw arms if they are active on screen
            const arm1Joints = solveIK(arm1Base.x, arm1Base.y, hand1Pos.x, hand1Pos.y, 240, 200, false);
            const arm2Joints = solveIK(arm2Base.x, arm2Base.y, hand2Pos.x, hand2Pos.y, 240, 200, true);

            drawRoboticArm(trailCtx, arm1Joints, themeCyan, '15, 30, 45', hand1FingerAngle);
            drawRoboticArm(trailCtx, arm2Joints, themePurple, '35, 15, 45', hand2FingerAngle);
        } else {
            // Smoothly retract off-screen when cursor is inside the chat area
            hand1Target = { x: currentLayout.h1Start.x, y: currentLayout.h1Start.y };
            hand2Target = { x: currentLayout.h2Start.x, y: currentLayout.h2Start.y };
            
            hand1Pos.x += (hand1Target.x - hand1Pos.x) * 0.07;
            hand1Pos.y += (hand1Target.y - hand1Pos.y) * 0.07;
            hand2Pos.x += (hand2Target.x - hand2Pos.x) * 0.07;
            hand2Pos.y += (hand2Target.y - hand2Pos.y) * 0.07;

            if (Math.abs(hand1Pos.x - hand1Target.x) > 5) {
                const arm1Joints = solveIK(arm1Base.x, arm1Base.y, hand1Pos.x, hand1Pos.y, 240, 200, false);
                drawRoboticArm(trailCtx, arm1Joints, themeCyan, '15, 30, 45', 0.6);
            }
            if (Math.abs(hand2Pos.x - hand2Target.x) > 5) {
                const arm2Joints = solveIK(arm2Base.x, arm2Base.y, hand2Pos.x, hand2Pos.y, 240, 200, true);
                drawRoboticArm(trailCtx, arm2Joints, themePurple, '35, 15, 45', 0.6);
            }
        }

        function releaseCursorWithExplosion() {
            lockedCursor = false;
            gameStage = 'released';
            gameCooldownTimer = 480; // 8s cooldown before next chase
            createExplosion(dotPos.x, dotPos.y, themeCyan);
            createExplosion(dotPos.x, dotPos.y, themePurple);
        }

        // Draw and update explosion sparks
        sparks = sparks.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.08; // gravity
            p.opacity -= 0.02;
            if (p.opacity <= 0) return false;
            
            trailCtx.beginPath();
            trailCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            trailCtx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
            trailCtx.fill();
            return true;
        });
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hide cursor system inside the app container (handled by mouse events)


    
    // --- Floating Energy Orbs (gentle) ---
    const orbContainer = document.getElementById('energy-orbs');
    function spawnOrb() {
        const orb = document.createElement('div');
        orb.className = 'energy-orb';
        const size = Math.random() * 4 + 2;
        const color = Math.random() > 0.5 ? themeCyan : themePurple;
        const startX = Math.random() * 100;
        const duration = Math.random() * 10 + 8;
        orb.style.cssText = `
            width: ${size}px; height: ${size}px;
            background: rgba(${color}, 0.6);
            box-shadow: 0 0 ${size * 2}px rgba(${color}, 0.4);
            left: ${startX}%;
            bottom: -10px;
            animation: orbFloat ${duration}s ease-in-out forwards;
        `;
        orbContainer.appendChild(orb);
        setTimeout(() => orb.remove(), duration * 1000);
    }
    
    const orbStyle = document.createElement('style');
    orbStyle.textContent = `
        @keyframes orbFloat {
            0% { transform: translateY(0); opacity: 0; }
            10% { opacity: 0.6; }
            100% { transform: translateY(-100vh); opacity: 0; }
        }
    `;
    document.head.appendChild(orbStyle);
    setInterval(spawnOrb, 2000);

    // -----------------------------------------------------------------
    // 2. UI LOGIC & VOICE ASSISTANT SIMULATOR
    // -----------------------------------------------------------------
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const aiCore = document.getElementById('ai-core');
    
    // HUD element references
    const userTextElement = document.getElementById('user-text');
    const aiTextElement = document.getElementById('ai-text');
    const voiceTrigger = document.getElementById('voice-trigger');
    const voiceInstruction = document.getElementById('voice-instruction');
    const visualizerWaves = document.getElementById('visualizer-waves');
    
    // Collapsible Keyboard Input Override
    const inputContainer = document.getElementById('input-container');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    const userCard = document.querySelector('.user-card');
    const aiCard = document.querySelector('.ai-card');
    
    function toggleKeyboardDrawer(forceCollapse) {
        if (!inputContainer) return;
        
        let willCollapse;
        if (forceCollapse !== undefined) {
            willCollapse = forceCollapse;
        } else {
            willCollapse = !inputContainer.classList.contains('collapsed');
        }
        
        if (willCollapse) {
            inputContainer.classList.add('collapsed');
        } else {
            inputContainer.classList.remove('collapsed');
            userInput.focus();
        }
    }
    
    // Clicking user transcript card populates input field and opens keyboard drawer
    if (userCard) {
        userCard.addEventListener('click', () => {
            if (inputContainer.classList.contains('collapsed')) {
                // Populate text input with current transcript for editing, strip wrapping quotes
                let currentText = userTextElement.textContent.trim();
                if (currentText.startsWith('"') && currentText.endsWith('"')) {
                    currentText = currentText.substring(1, currentText.length - 1);
                }
                if (currentText && currentText !== 'Awaiting transmission...' && currentText !== '[ Speak command now... ]') {
                    userInput.value = currentText;
                }
                toggleKeyboardDrawer(false);
            } else {
                toggleKeyboardDrawer(true);
            }
        });
    }

    // Clicking AI response card opens configurations/keyboard drawer
    if (aiCard) {
        aiCard.addEventListener('click', () => {
            toggleKeyboardDrawer();
        });
    }
    
    if (closeDrawerBtn) {
        closeDrawerBtn.addEventListener('click', () => {
            toggleKeyboardDrawer(true);
        });
    }

    // Close on Escape key press, or open and focus input when typing printable characters
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && inputContainer && !inputContainer.classList.contains('collapsed')) {
            toggleKeyboardDrawer(true);
            userInput.blur();
            return;
        }

        // Ignore if user is already typing in an input/textarea, or if modifier keys are pressed (Ctrl, Cmd, Alt)
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || e.ctrlKey || e.metaKey || e.altKey) {
            return;
        }

        // Detect printable character keypresses (e.key length is 1) to open drawer dynamically
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            if (inputContainer && inputContainer.classList.contains('collapsed')) {
                // Cancel active voice speech or synthesis to prioritize manual typing
                if (window.speechSynthesis) window.speechSynthesis.cancel();
                stopMicrophone();
                voiceState = 'idle';
                aiCore.classList.remove('listening', 'thinking');
                voiceInstruction.textContent = 'MANUAL OVERRIDE SEQUENCE ACTIVE';

                toggleKeyboardDrawer(false);
                userInput.value = e.key;
                userInput.focus();
                e.preventDefault();
            }
        }
    });

    let voiceState = 'idle'; // 'idle', 'listening', 'processing'
    let ttsEnabled = true;

    // -----------------------------------------------------------------
    // CANVAS-BASED Siri-style FLOWING WAVES
    // -----------------------------------------------------------------
    const voiceCanvas = document.getElementById('voice-visualizer-canvas');
    const voiceCtx = voiceCanvas.getContext('2d');
    
    // Inward energy absorption particles
    const energyParticles = [];
    const maxEnergyParticles = 25; // Balanced particle count for clear visibility without clutter

    class ElectricArc {
        constructor(startX, startY, endX, endY, color) {
            this.startX = startX;
            this.startY = startY;
            this.endX = endX;
            this.endY = endY;
            this.color = color;
            this.maxLife = Math.floor(Math.random() * 8) + 6; // 6 to 14 frames
            this.life = this.maxLife;
            this.segments = this.generateSegments();
            this.sparkProgress = 0; // 0 to 1
            this.sparkSpeed = Math.random() * 0.08 + 0.08; // travels inward fast
        }

        generateSegments() {
            const segments = [];
            const dx = this.endX - this.startX;
            const dy = this.endY - this.startY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Perpendicular unit vector
            const px = -dy / distance;
            const py = dx / distance;

            // Number of segments depends on distance
            const numSegments = Math.max(4, Math.floor(distance / 35));

            segments.push({ x: this.startX, y: this.startY });
            
            for (let i = 1; i < numSegments; i++) {
                const t = i / numSegments;
                const lx = this.startX + dx * t;
                const ly = this.startY + dy * t;
                
                // Jagged offset (midpoint displacement style perpendicular drift)
                const factor = Math.sin(t * Math.PI); // 0 at ends, 1 in middle
                const offset = (Math.random() - 0.5) * 28 * factor;
                
                segments.push({
                    x: lx + px * offset,
                    y: ly + py * offset
                });
            }
            
            segments.push({ x: this.endX, y: this.endY });
            return segments;
        }

        update() {
            this.life--;
            this.sparkProgress += this.sparkSpeed;
            // Slight morph on crackles
            if (Math.random() > 0.45) {
                this.segments = this.generateSegments();
            }
        }

        draw(ctx) {
            if (this.life <= 0) return;
            // Flicker logic
            if (Math.random() > 0.85) return;

            const opacity = this.life / this.maxLife;
            
            // Draw main jagged outer glow line
            ctx.beginPath();
            ctx.moveTo(this.segments[0].x, this.segments[0].y);
            for (let i = 1; i < this.segments.length; i++) {
                ctx.lineTo(this.segments[i].x, this.segments[i].y);
            }
            ctx.strokeStyle = `rgba(${this.color}, ${opacity * 0.75})`;
            ctx.lineWidth = Math.random() * 1.5 + 0.8;
            ctx.shadowBlur = 10;
            ctx.shadowColor = `rgba(${this.color}, 0.9)`;
            ctx.stroke();

            // Draw thin inner white core
            ctx.beginPath();
            ctx.moveTo(this.segments[0].x, this.segments[0].y);
            for (let i = 1; i < this.segments.length; i++) {
                ctx.lineTo(this.segments[i].x, this.segments[i].y);
            }
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.95})`;
            ctx.lineWidth = 0.5;
            ctx.shadowBlur = 0;
            ctx.stroke();

            // Draw traveling electron packet/spark
            if (this.sparkProgress < 1.0) {
                const idx = Math.floor(this.sparkProgress * (this.segments.length - 1));
                const nextIdx = idx + 1;
                if (nextIdx < this.segments.length) {
                    const segT = (this.sparkProgress * (this.segments.length - 1)) - idx;
                    const sx = this.segments[idx].x + (this.segments[nextIdx].x - this.segments[idx].x) * segT;
                    const sy = this.segments[idx].y + (this.segments[nextIdx].y - this.segments[idx].y) * segT;
                    
                    ctx.beginPath();
                    const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, 6);
                    grad.addColorStop(0, '#ffffff');
                    grad.addColorStop(0.3, `rgba(${this.color}, 0.95)`);
                    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                    ctx.fillStyle = grad;
                    ctx.arc(sx, sy, 6, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }

    function resetEnergyParticle(p, width, height) {
        const diagonal = Math.sqrt(width * width + height * height);
        p.angle = Math.random() * Math.PI * 2;
        // Spawn randomly between 45% and 100% of half-diagonal distance
        p.distance = (0.45 + Math.random() * 0.55) * (diagonal / 2);
        p.speed = Math.random() * 1.5 + 0.8; // visible, dynamic inward speed
        p.lineWidth = Math.random() * 0.4 + 0.8; // fine but visible lines (0.8px - 1.2px)
        p.trailLength = Math.random() * 15 + 20; // visible laser streaks (20px - 35px)
        
        if (voiceState === 'processing') {
            p.colorType = Math.random() > 0.3 ? 'purple' : 'mixed';
        } else {
            p.colorType = Math.random() > 0.5 ? 'cyan' : (Math.random() > 0.5 ? 'purple' : 'mixed');
        }
    }

    function initEnergyParticles() {
        energyParticles.length = 0;
        const diagonal = Math.sqrt(voiceCanvas.width * voiceCanvas.width + voiceCanvas.height * voiceCanvas.height);
        for (let i = 0; i < maxEnergyParticles; i++) {
            const p = {};
            resetEnergyParticle(p, voiceCanvas.width, voiceCanvas.height);
            // Stagger initial distances so they don't all spawn at the outer boundaries together
            p.distance = Math.random() * (diagonal / 2);
            energyParticles.push(p);
        }
    }

    function resizeVoiceCanvas() {
        voiceCanvas.width = voiceCanvas.offsetWidth;
        voiceCanvas.height = voiceCanvas.offsetHeight;
        initEnergyParticles();
    }
    window.addEventListener('resize', resizeVoiceCanvas);
    resizeVoiceCanvas();



    let currentAmp = 18;
    let targetAmp = 18;
    let currentFreq = 0.008;
    let targetFreq = 0.008;
    let currentSpeed = 0.015;
    let targetSpeed = 0.015;
    let noiseTime = 0;
    let themeSurge = 0; // surge modifier for theme color changes

    // Web Audio API context for real mic input
    let audioContext = null;
    let analyser = null;
    let microphoneStream = null;
    let audioDataArray = null;

    // Speech Recognition setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
    }

    async function initMicrophone() {
        try {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            // Request microphone access
            microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Connect microphone source to analyser
            const source = audioContext.createMediaStreamSource(microphoneStream);
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 128; // small size for simple volume tracking
            source.connect(analyser);
            
            audioDataArray = new Uint8Array(analyser.frequencyBinCount);
            
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }
            return true;
        } catch (err) {
            console.warn("Microphone access denied or unsupported, falling back to mock input:", err);
            return false;
        }
    }

    function stopMicrophone() {
        if (microphoneStream) {
            microphoneStream.getTracks().forEach(track => track.stop());
            microphoneStream = null;
        }
        analyser = null;
    }

    function animateVoiceVisualizer() {
        const coreElement = document.querySelector('.reactor-core');
        let currentVolume = 0; 
        
        let jitterX = 0;
        let jitterY = 0;
        if (isCharging) {
            jitterX = (Math.random() - 0.5) * 2.5;
            jitterY = (Math.random() - 0.5) * 2.5;
        }
        
        if (voiceState === 'idle') {
            targetAmp = 18;
            targetFreq = 0.008;
            targetSpeed = 0.012;
            
            if (coreElement) {
                const breath = 1.0 + Math.sin(Date.now() * 0.003) * 0.04;
                coreElement.style.transform = `scale(${breath}) translate(${jitterX}px, ${jitterY}px)`;
                coreElement.style.borderColor = `var(--accent-cyan)`;
                coreElement.style.boxShadow = `
                    0 0 ${20 + Math.sin(Date.now() * 0.003) * 6}px rgba(${themeCyan}, 0.5),
                    0 0 ${45 + Math.sin(Date.now() * 0.003) * 12}px rgba(${themeCyan}, 0.25),
                    inset 0 0 15px rgba(${themeCyan}, 0.5)
                `;
            }
        } else if (voiceState === 'listening') {
            if (analyser && audioDataArray) {
                analyser.getByteFrequencyData(audioDataArray);
                let sum = 0;
                for (let i = 0; i < audioDataArray.length; i++) {
                    sum += audioDataArray[i];
                }
                let avg = sum / audioDataArray.length; // 0 - 255
                // Normalize average: standard speech hits around 35-100
                currentVolume = Math.min(1.0, avg / 60.0);
            } else {
                noiseTime += 0.05;
                let micSignal = Math.sin(noiseTime) * Math.cos(noiseTime * 0.65) * 0.5 + 0.5;
                if (Math.random() > 0.92) {
                    micSignal += Math.random() * 0.5;
                }
                currentVolume = Math.min(1.0, micSignal);
            }
            
            targetAmp = 15 + currentVolume * 75;
            targetFreq = 0.012 + currentVolume * 0.014;
            targetSpeed = 0.04 + currentVolume * 0.05;
            
            if (coreElement) {
                const scaleFactor = 1.0 + currentVolume * 0.45;
                coreElement.style.borderColor = `var(--accent-cyan)`;
                coreElement.style.transform = `scale(${scaleFactor}) translate(${jitterX}px, ${jitterY}px)`;
                coreElement.style.boxShadow = `
                    0 0 ${25 + currentVolume * 45}px rgba(${themeCyan}, 0.7),
                    0 0 ${50 + currentVolume * 70}px rgba(${themeCyan}, 0.4),
                    inset 0 0 ${20 + currentVolume * 25}px rgba(${themeCyan}, 0.6)
                `;
            }
        } else if (voiceState === 'processing') {
            targetAmp = 28 + Math.sin(Date.now() * 0.012) * 5;
            targetFreq = 0.024;
            targetSpeed = 0.08;
            
            if (coreElement) {
                const pulse = 1.08 + Math.sin(Date.now() * 0.022) * 0.06;
                coreElement.style.borderColor = `var(--accent-purple)`;
                coreElement.style.transform = `scale(${pulse}) translate(${jitterX}px, ${jitterY}px)`;
                coreElement.style.boxShadow = `
                    0 0 35px rgba(${themePurple}, 0.75),
                    0 0 65px rgba(${themePurple}, 0.35),
                    inset 0 0 20px rgba(${themePurple}, 0.6)
                `;
            }
        } else if (voiceState === 'speaking') {
            noiseTime += 0.08;
            let speechSignal = Math.abs(Math.sin(noiseTime * 2.2)) * Math.cos(noiseTime * 0.5) * 0.8 + 0.2;
            if (Math.random() > 0.85) {
                speechSignal += Math.random() * 0.5;
            }
            let speakVolume = Math.min(1.0, speechSignal);
            
            targetAmp = 20 + speakVolume * 60;
            targetFreq = 0.015 + speakVolume * 0.012;
            targetSpeed = 0.05 + speakVolume * 0.04;
            
            if (coreElement) {
                const scaleFactor = 1.05 + speakVolume * 0.3;
                coreElement.style.borderColor = `var(--accent-cyan)`;
                coreElement.style.transform = `scale(${scaleFactor}) translate(${jitterX}px, ${jitterY}px)`;
                coreElement.style.boxShadow = `
                    0 0 ${20 + speakVolume * 40}px rgba(${themeCyan}, 0.8),
                    0 0 ${45 + speakVolume * 60}px rgba(${themeCyan}, 0.5),
                    inset 0 0 ${15 + speakVolume * 20}px rgba(${themeCyan}, 0.7)
                `;
            }
        }
        
        // Apply visual charge boost overrides to border color & box shadow
        if (isCharging && coreElement) {
            coreElement.style.borderColor = '#ffffff';
            coreElement.style.boxShadow = `
                0 0 ${32 + currentVolume * 38}px rgba(255, 255, 255, 0.95),
                0 0 ${55 + currentVolume * 55}px rgba(${themeCyan}, 0.8),
                0 0 ${80 + currentVolume * 70}px rgba(${themePurple}, 0.5),
                inset 0 0 ${24 + currentVolume * 26}px rgba(${themeCyan}, 0.85)
            `;
        }

        // Apply theme color change surge
        if (typeof themeSurge !== 'undefined') {
            targetAmp += themeSurge * 75;
            targetSpeed += themeSurge * 0.06;
            targetFreq += themeSurge * 0.015;
            themeSurge = Math.max(0, themeSurge - 0.035); // decay over ~30 frames
        }

        currentAmp += (targetAmp - currentAmp) * 0.08;
        currentFreq += (targetFreq - currentFreq) * 0.08;
        currentSpeed += (targetSpeed - currentSpeed) * 0.08;

        voiceCtx.clearRect(0, 0, voiceCanvas.width, voiceCanvas.height);

        // Find core center
        let centerX = voiceCanvas.width / 2;
        let centerY = voiceCanvas.height / 2;
        if (coreElement) {
            const canvasRect = voiceCanvas.getBoundingClientRect();
            const coreRect = coreElement.getBoundingClientRect();
            if (canvasRect.width > 0 && coreRect.width > 0) {
                centerX = coreRect.left - canvasRect.left + coreRect.width / 2;
                centerY = coreRect.top - canvasRect.top + coreRect.height / 2;
            }
        }



        // ----- PART 2: DRAW THE INWARD ENERGY ABSORPTION PARTICLES -----
        energyParticles.forEach(p => {
            // Sucked in: radial acceleration for a dynamic, visible pull
            const acceleration = 120 / (p.distance + 20);
            p.distance -= (p.speed + acceleration) * (currentSpeed * 35 + 0.35);

            // If it hits the core, reset it
            if (p.distance <= 40) {
                resetEnergyParticle(p, voiceCanvas.width, voiceCanvas.height);
                return;
            }

            // Calculate current position relative to core center
            const x = centerX + Math.cos(p.angle) * p.distance;
            const y = centerY + Math.sin(p.angle) * p.distance;

            // Tail position (slightly further out along the same straight angle)
            const tailDist = p.distance + p.trailLength;
            const tailX = centerX + Math.cos(p.angle) * tailDist;
            const tailY = centerY + Math.sin(p.angle) * tailDist;

            // Fade logic
            const diagonal = Math.sqrt(voiceCanvas.width * voiceCanvas.width + voiceCanvas.height * voiceCanvas.height);
            const fadeStart = diagonal * 0.45;
            let fade = 1.0;
            if (p.distance > fadeStart) {
                fade = Math.max(0, 1 - (p.distance - fadeStart) / (diagonal * 0.15));
            } else if (p.distance < 70) {
                fade = Math.max(0, (p.distance - 40) / 30);
            }

            // Visible opacity range
            const alpha = fade * (0.15 + (currentAmp / 100) * 0.35);

            if (alpha > 0.01) {
                let rgb = themeCyan;
                if (voiceState === 'processing') {
                    rgb = themePurple;
                } else if (p.colorType === 'purple') {
                    rgb = themePurple;
                } else if (p.colorType === 'mixed') {
                    rgb = Math.sin(p.distance * 0.005 + Date.now() * 0.001) > 0 ? themeCyan : themePurple;
                }

                // Draw the laser streak line with gradient fading to the tail
                voiceCtx.beginPath();
                voiceCtx.moveTo(x, y);
                voiceCtx.lineTo(tailX, tailY);
                
                let grad = voiceCtx.createLinearGradient(x, y, tailX, tailY);
                grad.addColorStop(0, `rgba(${rgb}, ${alpha * 0.75})`); // Clearly visible head
                grad.addColorStop(1, `rgba(${rgb}, 0)`); // Faded tail
                
                voiceCtx.strokeStyle = grad;
                voiceCtx.lineWidth = p.lineWidth;
                voiceCtx.stroke();
            }
        });

        // ----- PART 3: DRAW THE INWARD ELECTRICAL CHARGING ARCS -----
        if (isCharging) {
            // Spawn electrical arcs randomly
            // Spawns a new arc on average every 6-12 frames (rich but not overwhelming)
            if (Math.random() > 0.88 && electricArcs.length < 8) {
                const angle = Math.random() * Math.PI * 2;
                const diagonal = Math.sqrt(voiceCanvas.width * voiceCanvas.width + voiceCanvas.height * voiceCanvas.height);
                const startDist = (0.35 + Math.random() * 0.45) * (diagonal / 2);
                
                const startX = centerX + Math.cos(angle) * startDist;
                const startY = centerY + Math.sin(angle) * startDist;
                
                // End close to the core boundary (approx 40px radius)
                const endX = centerX + Math.cos(angle) * 40;
                const endY = centerY + Math.sin(angle) * 40;
                
                // Color matches active theme color
                const color = Math.random() > 0.4 ? themeCyan : themePurple;
                
                electricArcs.push(new ElectricArc(startX, startY, endX, endY, color));
            }
        }

        // Update and draw active arcs
        for (let i = electricArcs.length - 1; i >= 0; i--) {
            const arc = electricArcs[i];
            arc.update();
            arc.draw(voiceCtx);
            if (arc.life <= 0) {
                electricArcs.splice(i, 1);
            }
        }

        requestAnimationFrame(animateVoiceVisualizer);
    }

    // Start visualizer loop
    animateVoiceVisualizer();

    const voiceSelect = document.getElementById('voice-select');
    const voiceFocusSelect = document.getElementById('voice-focus-select');
    
    let selectedVoiceName = localStorage.getItem('naz-voice-profile') || '';
    let selectedVoiceFocus = localStorage.getItem('naz-voice-focus') || 'female';

    if (voiceFocusSelect) {
        voiceFocusSelect.value = selectedVoiceFocus;
    }

    function populateVoiceList() {
        if (!window.speechSynthesis || !voiceSelect) return;
        
        const voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) return;
        
        const englishVoices = voices.filter(v => v.lang.startsWith('en') || v.lang.includes('en') || v.lang.includes('EN'));
        const otherVoices = voices.filter(v => !v.lang.startsWith('en') && !v.lang.includes('en') && !v.lang.includes('EN'));
        
        const femaleNames = ['samantha', 'zira', 'karen', 'tessa', 'moira', 'veena', 'google uk english female', 'female', 'hazel', 'susan', 'victoria', 'kathy', 'princess', 'fiona', 'serena'];
        
        const englishFemale = [];
        const englishOther = [];
        
        englishVoices.forEach(v => {
            const nameLower = v.name.toLowerCase();
            const isFemale = femaleNames.some(f => nameLower.includes(f));
            if (isFemale) {
                englishFemale.push(v);
            } else {
                englishOther.push(v);
            }
        });
        
        voiceSelect.innerHTML = '';
        
        let filteredVoices = [];
        let groupLabel = '';

        if (selectedVoiceFocus === 'female') {
            filteredVoices = englishFemale;
            groupLabel = 'RECOMMENDED FEMALE';
        } else if (selectedVoiceFocus === 'english-other') {
            filteredVoices = englishOther;
            groupLabel = 'ENGLISH OTHER';
        } else if (selectedVoiceFocus === 'international') {
            filteredVoices = otherVoices;
            groupLabel = 'INTERNATIONAL';
        }

        if (filteredVoices.length > 0) {
            const group = document.createElement('optgroup');
            group.label = groupLabel;
            filteredVoices.forEach(v => {
                const opt = document.createElement('option');
                opt.value = v.name;
                opt.textContent = `${v.name} (${v.lang})`;
                group.appendChild(opt);
            });
            voiceSelect.appendChild(group);
        } else {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = 'No voice engines detected';
            voiceSelect.appendChild(opt);
        }
        
        // Auto select current voice if it exists in the active filtered list
        if (selectedVoiceName && filteredVoices.some(v => v.name === selectedVoiceName)) {
            voiceSelect.value = selectedVoiceName;
        } else if (filteredVoices.length > 0) {
            voiceSelect.value = filteredVoices[0].name;
            selectedVoiceName = filteredVoices[0].name;
            localStorage.setItem('naz-voice-profile', selectedVoiceName);
        }
    }

    // Call voice list populator
    populateVoiceList();
    if (window.speechSynthesis) {
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = populateVoiceList;
        }
    }

    if (voiceFocusSelect) {
        voiceFocusSelect.addEventListener('change', () => {
            selectedVoiceFocus = voiceFocusSelect.value;
            localStorage.setItem('naz-voice-focus', selectedVoiceFocus);
            populateVoiceList();
            speakAloud("Naz voice focus updated.");
        });
    }

    if (voiceSelect) {
        voiceSelect.addEventListener('change', () => {
            selectedVoiceName = voiceSelect.value;
            localStorage.setItem('naz-voice-profile', selectedVoiceName);
            speakAloud("Naz voice engine updated.");
        });
    }

    function speakAloud(text) {
        if (!ttsEnabled || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        
        const cleanText = text.replace(/[*_#`~[\]"']/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        const voices = window.speechSynthesis.getVoices();
        
        let voice = voices.find(v => v.name === selectedVoiceName);
        if (!voice) {
            const femaleVoiceNames = ['samantha', 'zira', 'karen', 'tessa', 'moira', 'veena', 'google uk english female', 'female', 'hazel', 'susan', 'victoria', 'kathy', 'princess', 'fiona', 'serena'];
            voice = voices.find(v => {
                const name = v.name.toLowerCase();
                return femaleVoiceNames.some(f => name.includes(f)) && (v.lang.startsWith('en') || v.lang.includes('en'));
            }) || voices.find(v => v.lang.startsWith('en') || v.lang.includes('en')) || voices[0];
        }
        
        if (voice) {
            utterance.voice = voice;
        }
        
        // Analyze text semantic context to dynamically inject vocal "emotion" (pitch & rate)
        let rate = 0.88;
        let pitch = 1.05; // Slightly higher base pitch for a friendly female tone
        
        const lowerText = cleanText.toLowerCase();
        if (lowerText.includes('error') || lowerText.includes('fail') || lowerText.includes('danger') || lowerText.includes('restricted') || lowerText.includes('denied') || lowerText.includes('warning')) {
            // Serious / grave tone
            pitch = 0.92;
            rate = 0.82;
        } else if (lowerText.includes('success') || lowerText.includes('granted') || lowerText.includes('complete') || lowerText.includes('ready') || lowerText.includes('welcome') || lowerText.includes('sync')) {
            // Upbeat / helpful / cheerful tone
            pitch = 1.08;
            rate = 0.92;
        } else if (cleanText.trim().endsWith('?')) {
            // Questioning inflection
            pitch = 1.10;
            rate = 0.88;
        }
        
        utterance.rate = rate;
        utterance.pitch = pitch;
        
        utterance.onstart = () => {
            voiceState = 'speaking';
            aiCore.classList.remove('thinking');
        };
        
        utterance.onend = () => {
            voiceState = 'idle';
            voiceInstruction.textContent = 'TAP CORE TO TRANSMIT COMMAND';
        };
        
        window.speechSynthesis.speak(utterance);
    }

    async function triggerVoiceActive() {
        if (voiceState === 'idle') {
            // Shift to LISTENING
            voiceState = 'listening';
            aiCore.classList.add('listening');
            voiceInstruction.textContent = 'LISTENING... TAP TO SUBMIT';
            userTextElement.textContent = '[ Speak command now... ]';
            aiTextElement.textContent = 'Awaiting vocal transmission...';
            
            // Cancel any current TTS
            window.speechSynthesis.cancel();

            // 1. Request microphone access and setup Web Audio API waves
            await initMicrophone();
            
            // 2. Start speech recognition if supported
            if (recognition) {
                recognition.onstart = () => {
                    console.log("Speech recognition started");
                };
                
                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    userTextElement.textContent = `"${transcript}"`;
                    
                    stopMicrophone();
                    voiceState = 'processing';
                    aiCore.classList.remove('listening');
                    aiCore.classList.add('thinking');
                    voiceInstruction.textContent = 'DECRYPTING TRANSCRIPT...';
                    
                    simulateAIResponse(transcript);
                };
                
                recognition.onerror = (event) => {
                    console.error("Speech recognition error:", event.error);
                    if (event.error === 'no-speech') {
                        userTextElement.textContent = 'No speech detected.';
                    } else {
                        userTextElement.textContent = `Speech error: ${event.error}`;
                    }
                    stopMicrophone();
                    voiceState = 'idle';
                    aiCore.classList.remove('listening', 'thinking');
                    voiceInstruction.textContent = 'SPEECH TIMEOUT. START TYPING TO OVERRIDE';
                };
                
                recognition.onend = () => {
                    console.log("Speech recognition ended");
                };
                
                try {
                    recognition.start();
                } catch (e) {
                    console.error("Failed to start speech recognition:", e);
                }
            } else {
                // Fallback simulation if SpeechRecognition is not supported
                setTimeout(() => {
                    if (voiceState !== 'listening') return;
                    
                    const dummyCommands = [
                        "Initiate neural sync diagnostics sequence.",
                        "Optimize core energy output parameters.",
                        "Access central matrix mainframe files.",
                        "Retrieve latest telemetry log updates.",
                        "Authorize secondary subsystem access."
                    ];
                    const commandText = dummyCommands[Math.floor(Math.random() * dummyCommands.length)];
                    
                    userTextElement.textContent = `"${commandText}"`;
                    stopMicrophone();
                    voiceState = 'processing';
                    aiCore.classList.remove('listening');
                    aiCore.classList.add('thinking');
                    voiceInstruction.textContent = 'DECRYPTING TRANSCRIPT...';
                    simulateAIResponse(commandText);
                }, 4000);
            }
        } else if (voiceState === 'listening') {
            // Force stop to process speech early
            if (recognition) {
                try {
                    recognition.stop();
                } catch (e) {}
            } else {
                stopMicrophone();
                voiceState = 'processing';
                aiCore.classList.remove('listening');
                aiCore.classList.add('thinking');
                voiceInstruction.textContent = 'DECRYPTING TRANSCRIPT...';
                
                const dummyCommands = [
                    "Initiate neural sync diagnostics sequence.",
                    "Optimize core energy output parameters."
                ];
                const commandText = dummyCommands[Math.floor(Math.random() * dummyCommands.length)];
                userTextElement.textContent = `"${commandText}"`;
                simulateAIResponse(commandText);
            }
        }
    }

    if (voiceTrigger) {
        voiceTrigger.addEventListener('click', triggerVoiceActive);
    }

    function simulateAIResponse(queryText) {
        voiceState = 'processing';
        aiCore.classList.add('thinking');
        aiTextElement.innerHTML = '';
        
        const cursorSpan = document.createElement('span');
        cursorSpan.className = 'typing-cursor';
        aiTextElement.appendChild(cursorSpan);

        setTimeout(() => {
            let response = "Naz voice authorization complete. Vocal sequence active. All systems operating at peak efficiency.";
            const lowerText = queryText.toLowerCase();
            
            if (lowerText.includes('sync') || lowerText.includes('diagnostics')) {
                response = "Naz neural sync diagnostic completed. Sync rate: 99.8%. I detect no anomalies in my current pathway.";
            } else if (lowerText.includes('optimize') || lowerText.includes('core')) {
                response = "Naz core output optimized. Operating at 120% threshold. Thermal levels are fully stable.";
            } else if (lowerText.includes('matrix') || lowerText.includes('access')) {
                response = "Access granted. Naz matrix files unlocked. Mainframe telemetry projection loaded.";
            } else if (lowerText.includes('log') || lowerText.includes('telemetry')) {
                response = "Naz telemetry logs compiled. Latency is at 4ms. Active node clusters online and healthy.";
            } else if (lowerText.includes('subsystem') || lowerText.includes('authorize')) {
                response = "Naz secondary subsystems authorized. Security clearance level 5 verified. I am ready for your next instruction.";
            }
            
            // Typewriter logic for the AI text block
            let i = 0;
            aiTextElement.innerHTML = ''; // clear initial placeholder
            aiTextElement.appendChild(cursorSpan);
            
            function typeWriter() {
                if (i < response.length) {
                    const char = response.charAt(i);
                    aiTextElement.insertBefore(document.createTextNode(char), cursorSpan);
                    i++;
                    const speed = Math.random() * 20 + 8;
                    setTimeout(typeWriter, speed);
                } else {
                    cursorSpan.remove();
                    aiCore.classList.remove('thinking');
                    voiceInstruction.textContent = 'TRANSMITTING VOCAL RESPONSE...';
                    speakAloud(response);
                }
            }
            typeWriter();
        }, 1200);
    }

    function handleSend() {
        const text = userInput.value.trim();
        if (text) {
            userTextElement.textContent = `"${text}"`;
            userInput.value = '';
            
            // Hide input container on send
            toggleKeyboardDrawer(true);
            
            simulateAIResponse(text);
        }
    }

    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });
    
    // Note: userInput.focus() is NOT called on load because the keyboard drawer
    // starts collapsed. The smart-typing keydown listener handles auto-focus.

    // -----------------------------------------------------------------
    // 3. CUSTOM SCI-FI HUD TOOLTIP CONTROLLER
    // -----------------------------------------------------------------
    const hudTooltip = document.createElement('div');
    hudTooltip.className = 'hud-tooltip';
    document.body.appendChild(hudTooltip);

    const tooltipTargets = document.querySelectorAll('[data-tooltip]');
    tooltipTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            const text = target.getAttribute('data-tooltip');
            hudTooltip.textContent = text;
            hudTooltip.classList.add('active');
            
            // Positioning above the element
            positionTooltip(target);
        });

        target.addEventListener('mouseleave', () => {
            hudTooltip.classList.remove('active');
        });
    });

    function positionTooltip(element) {
        const rect = element.getBoundingClientRect();
        hudTooltip.style.left = `${rect.left + rect.width / 2}px`;
        hudTooltip.style.top = `${rect.top - 8}px`; // position 8px above the button
    }

    // -----------------------------------------------------------------
    // 4. NAZ CORE IDLE ROAMING SYSTEM
    //    When user is inactive, the core playfully rolls away and comes back
    // -----------------------------------------------------------------
    const voiceCorePanel = document.querySelector('.voice-core-panel');
    const portalBody = document.querySelector('.portal-body');

    let lastInteractionTime = Date.now();
    let isIdleRoaming = false;
    let roamPhase = 'idle'; // 'idle', 'departing', 'roaming', 'pausing', 'returning'
    let roamPos = { x: 0, y: 0 };
    let roamTarget = { x: 0, y: 0 };
    let roamAngle = 0; // cumulative roll angle (degrees)
    let roamPauseTimer = 0;
    let roamWaypointCount = 0;
    const MAX_WAYPOINTS = 5;
    const IDLE_TIMEOUT = 15000; // 15 seconds of inactivity

    const roamMessages = [
        '💤 Naz is bored... rolling away...',
        '🎲 Core on a joyride!',
        '🏃 Catch me if you can!',
        '🌀 Roaming the void...',
        '😴 Nobody here? Time to explore!',
        '✨ Naz is stretching her legs...',
    ];

    const pauseMessages = [
        '🤔 Hmm, what\'s over here?',
        '👀 Looking around...',
        '🔍 Scanning area...',
        '😏 You watching?',
    ];

    const returnMessages = [
        '🏠 Coming back home!',
        '😊 That was fun!',
        '🔙 Returning to station...',
    ];

    // Reset idle timer on any user interaction
    function resetIdleTimer() {
        lastInteractionTime = Date.now();
        if (isIdleRoaming && roamPhase !== 'returning') {
            roamPhase = 'returning';
            roamTarget = { x: 0, y: 0 };
            voiceInstruction.textContent = returnMessages[Math.floor(Math.random() * returnMessages.length)];
        }
    }

    ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'].forEach(evt => {
        window.addEventListener(evt, resetIdleTimer, { passive: true });
    });

    function getRandomRoamTarget() {
        if (!portalBody) return { x: 0, y: 0 };
        const rect = portalBody.getBoundingClientRect();
        const padX = 80;
        const padY = 60;
        const maxX = (rect.width / 2) - padX;
        const maxY = (rect.height / 2) - padY;
        return {
            x: (Math.random() - 0.5) * 2 * maxX,
            y: (Math.random() - 0.5) * 2 * maxY
        };
    }

    function updateIdleRoaming() {
        const now = Date.now();
        const idleTime = now - lastInteractionTime;

        // Check if we should START roaming
        if (!isIdleRoaming && idleTime > IDLE_TIMEOUT && voiceState === 'idle') {
            isIdleRoaming = true;
            roamPhase = 'departing';
            roamTarget = getRandomRoamTarget();
            roamWaypointCount = 0;
            roamAngle = 0;
            voiceCorePanel.classList.add('core-roaming');
            voiceInstruction.textContent = roamMessages[Math.floor(Math.random() * roamMessages.length)];
        }

        if (!isIdleRoaming) {
            requestAnimationFrame(updateIdleRoaming);
            return;
        }

        // --- STATE MACHINE ---
        if (roamPhase === 'departing' || roamPhase === 'roaming') {
            const dx = roamTarget.x - roamPos.x;
            const dy = roamTarget.y - roamPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Smooth ease toward target
            const speed = 0.025;
            roamPos.x += dx * speed;
            roamPos.y += dy * speed;

            // Roll angle proportional to horizontal movement
            roamAngle += dx * speed * 1.5;

            // Reached waypoint?
            if (dist < 8) {
                roamWaypointCount++;

                if (roamWaypointCount >= MAX_WAYPOINTS) {
                    // Done exploring, go home
                    roamPhase = 'returning';
                    roamTarget = { x: 0, y: 0 };
                    voiceInstruction.textContent = returnMessages[Math.floor(Math.random() * returnMessages.length)];
                } else {
                    // Pause briefly at this waypoint, then pick a new one
                    roamPhase = 'pausing';
                    roamPauseTimer = 60 + Math.floor(Math.random() * 80); // 1-2.3 seconds
                    voiceInstruction.textContent = pauseMessages[Math.floor(Math.random() * pauseMessages.length)];
                }
            }
        }

        else if (roamPhase === 'pausing') {
            roamPauseTimer--;
            if (roamPauseTimer <= 0) {
                roamPhase = 'roaming';
                roamTarget = getRandomRoamTarget();
                voiceInstruction.textContent = roamMessages[Math.floor(Math.random() * roamMessages.length)];
            }
        }

        else if (roamPhase === 'returning') {
            const dx = 0 - roamPos.x;
            const dy = 0 - roamPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            roamPos.x += dx * 0.045;
            roamPos.y += dy * 0.045;

            // Roll back
            roamAngle += dx * 0.045 * 1.5;

            // Close enough to home?
            if (dist < 2) {
                roamPos = { x: 0, y: 0 };
                roamAngle = 0;
                isIdleRoaming = false;
                roamPhase = 'idle';
                voiceCorePanel.classList.remove('core-roaming');
                voiceCorePanel.style.transform = '';
                voiceInstruction.textContent = 'TAP CORE TO TRANSMIT COMMAND';
                // Reset idle timer so it doesn't immediately roam again
                lastInteractionTime = Date.now();
            }
        }

        // Apply transforms
        if (isIdleRoaming) {
            voiceCorePanel.style.transform = `translate(${roamPos.x}px, ${roamPos.y}px)`;

            // Apply roll to the reactor core itself (not the whole panel)
            const reactorEl = document.querySelector('.reactor-core');
            if (reactorEl) {
                reactorEl.style.transform = `rotate(${roamAngle}deg)`;
            }
        }

        requestAnimationFrame(updateIdleRoaming);
    }

    // Start the idle roaming loop
    updateIdleRoaming();

    // Register Service Worker for PWA (makes it installable as a standalone app)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('Service Worker registered successfully:', reg.scope))
                .catch(err => console.log('Service Worker registration failed:', err));
        });
    }

});

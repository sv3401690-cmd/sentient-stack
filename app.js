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
    
    let sharedAudioCtx = null;
    function getSharedAudioCtx() {
        if (!sharedAudioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                sharedAudioCtx = new AudioContext();
            }
        }
        if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
            sharedAudioCtx.resume().catch(e => console.warn("Failed to resume audio context: ", e));
        }
        return sharedAudioCtx;
    }

    function playStartupSound() {
        try {
            const audioCtx = getSharedAudioCtx();
            if (!audioCtx) return;
            const now = audioCtx.currentTime;
            
            // --- 1. DEEP CINEMATIC WHOOSH (Sub-Bass) ---
            const subOsc = audioCtx.createOscillator();
            const subGain = audioCtx.createGain();
            const subFilter = audioCtx.createBiquadFilter();
            
            subOsc.type = 'sine';
            subOsc.frequency.setValueAtTime(160, now);
            subOsc.frequency.exponentialRampToValueAtTime(45, now + 2.0);
            
            subFilter.type = 'lowpass';
            subFilter.frequency.setValueAtTime(250, now);
            subFilter.frequency.exponentialRampToValueAtTime(60, now + 2.0);
            
            subGain.gain.setValueAtTime(0, now);
            subGain.gain.linearRampToValueAtTime(0.5, now + 0.4); // clearly audible sub weight
            subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
            
            subOsc.connect(subFilter);
            subFilter.connect(subGain);
            subGain.connect(audioCtx.destination);
            
            // --- 2. FUTURISTIC CHARGE UP (Sweep) ---
            const sweepOsc = audioCtx.createOscillator();
            const sweepGain = audioCtx.createGain();
            
            sweepOsc.type = 'triangle';
            sweepOsc.frequency.setValueAtTime(200, now);
            sweepOsc.frequency.exponentialRampToValueAtTime(880, now + 0.5); // rapid rise
            
            sweepGain.gain.setValueAtTime(0, now);
            sweepGain.gain.linearRampToValueAtTime(0.15, now + 0.1);
            sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
            
            sweepOsc.connect(sweepGain);
            sweepGain.connect(audioCtx.destination);
            
            // --- 3. PREMIUM RESONANT CHIME CHORD (Glassy Harmonics) ---
            // We use two oscillators to create a beautiful open-fifth chord (A4 and E5) with high shimmer
            const frequencies = [440.00, 659.25, 880.00, 1318.51];
            const gains = [0.25, 0.20, 0.15, 0.10]; // staggered volume
            
            frequencies.forEach((freq, index) => {
                const chimeOsc = audioCtx.createOscillator();
                const chimeGain = audioCtx.createGain();
                const chimeFilter = audioCtx.createBiquadFilter();
                
                chimeOsc.type = 'sine';
                chimeOsc.frequency.setValueAtTime(freq, now + 0.3); // slight delay after sweep
                
                chimeFilter.type = 'bandpass';
                chimeFilter.frequency.setValueAtTime(freq * 1.5, now + 0.3);
                chimeFilter.frequency.exponentialRampToValueAtTime(freq, now + 2.2);
                chimeFilter.Q.setValueAtTime(1.5, now);
                
                chimeGain.gain.setValueAtTime(0, now);
                // Ramp up as the sweep finishes
                chimeGain.gain.setValueAtTime(0, now + 0.3);
                chimeGain.gain.linearRampToValueAtTime(gains[index] * 1.5, now + 0.6);
                chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5); // long resonance
                
                chimeOsc.connect(chimeFilter);
                chimeFilter.connect(chimeGain);
                chimeGain.connect(audioCtx.destination);
                
                chimeOsc.start(now);
                chimeOsc.stop(now + 2.7);
            });
            
            subOsc.start(now);
            subOsc.stop(now + 2.2);
            
            sweepOsc.start(now);
            sweepOsc.stop(now + 0.6);
            
        } catch (e) {
            console.log('Audio startup hum blocked or failed:', e);
        }
    }

    function playWeaponReloadSound() {
        try {
            const audioCtx = getSharedAudioCtx();
            if (!audioCtx) return;
            const now = audioCtx.currentTime;

            // Master compressor
            const compressor = audioCtx.createDynamicsCompressor();
            compressor.threshold.setValueAtTime(-15, now);
            compressor.knee.setValueAtTime(8, now);
            compressor.ratio.setValueAtTime(12, now);
            compressor.connect(audioCtx.destination);

            // --- 1. Hydraulic Slide (Pneumatic friction: 0.0s to 0.3s) ---
            const slideBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.4, audioCtx.sampleRate);
            const slideData = slideBuffer.getChannelData(0);
            for (let i = 0; i < slideData.length; i++) {
                slideData[i] = Math.random() * 2 - 1;
            }
            const slideNoise = audioCtx.createBufferSource();
            slideNoise.buffer = slideBuffer;

            const slideFilter = audioCtx.createBiquadFilter();
            slideFilter.type = 'bandpass';
            slideFilter.frequency.setValueAtTime(800, now);
            slideFilter.frequency.exponentialRampToValueAtTime(350, now + 0.3);
            slideFilter.Q.setValueAtTime(3.0, now);

            const slideGain = audioCtx.createGain();
            slideGain.gain.setValueAtTime(0, now);
            slideGain.gain.linearRampToValueAtTime(0.08, now + 0.05);
            slideGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

            slideNoise.connect(slideFilter);
            slideFilter.connect(slideGain);
            slideGain.connect(compressor);
            slideNoise.start(now);
            slideNoise.stop(now + 0.32);

            // Metallic slide sound (triangle sweep)
            const slideOsc = audioCtx.createOscillator();
            const slideOscGain = audioCtx.createGain();
            slideOsc.type = 'triangle';
            slideOsc.frequency.setValueAtTime(250, now);
            slideOsc.frequency.linearRampToValueAtTime(140, now + 0.3);
            slideOscGain.gain.setValueAtTime(0.04, now);
            slideOscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            slideOsc.connect(slideOscGain);
            slideOscGain.connect(compressor);
            slideOsc.start(now);
            slideOsc.stop(now + 0.3);

            // --- 2. First Bolt Click / Slide Catch (at 0.28s) ---
            const t1 = now + 0.28;
            const clickOsc1 = audioCtx.createOscillator();
            const clickGain1 = audioCtx.createGain();
            clickOsc1.type = 'triangle';
            clickOsc1.frequency.setValueAtTime(1500, t1);
            clickOsc1.frequency.exponentialRampToValueAtTime(800, t1 + 0.04);
            clickGain1.gain.setValueAtTime(0.12, t1);
            clickGain1.gain.exponentialRampToValueAtTime(0.001, t1 + 0.045);
            clickOsc1.connect(clickGain1);
            clickGain1.connect(compressor);
            clickOsc1.start(t1);
            clickOsc1.stop(t1 + 0.05);

            // --- 3. Heavy Bolt Release & Chamber Lock (at 0.42s) ---
            const t2 = now + 0.42;
            
            // Chamber click (crisp clank)
            const lockOsc = audioCtx.createOscillator();
            const lockGain = audioCtx.createGain();
            lockOsc.type = 'sawtooth';
            lockOsc.frequency.setValueAtTime(600, t2);
            lockOsc.frequency.exponentialRampToValueAtTime(80, t2 + 0.08);

            const lockFilter = audioCtx.createBiquadFilter();
            lockFilter.type = 'lowpass';
            lockFilter.frequency.setValueAtTime(900, t2);
            lockFilter.frequency.setValueAtTime(200, t2 + 0.08);

            lockGain.gain.setValueAtTime(0.18, t2);
            lockGain.gain.exponentialRampToValueAtTime(0.001, t2 + 0.09);

            lockOsc.connect(lockFilter);
            lockFilter.connect(lockGain);
            lockGain.connect(compressor);
            lockOsc.start(t2);
            lockOsc.stop(t2 + 0.1);

            // Solid mechanical thud
            const thudOsc = audioCtx.createOscillator();
            const thudGain = audioCtx.createGain();
            thudOsc.type = 'sine';
            thudOsc.frequency.setValueAtTime(150, t2);
            thudOsc.frequency.exponentialRampToValueAtTime(50, t2 + 0.12);
            thudGain.gain.setValueAtTime(0.35, t2);
            thudGain.gain.exponentialRampToValueAtTime(0.001, t2 + 0.12);
            thudOsc.connect(thudGain);
            thudGain.connect(compressor);
            thudOsc.start(t2);
            thudOsc.stop(t2 + 0.15);

        } catch (e) {
            console.warn("Failed to play weapon reload sound: ", e);
        }
    }

    function playDestructionSound() {
        try {
            const audioCtx = getSharedAudioCtx();
            if (!audioCtx) return;
            const now = audioCtx.currentTime;

            // Master compressor to glue and maximize impact
            const comp = audioCtx.createDynamicsCompressor();
            comp.threshold.setValueAtTime(-12, now);
            comp.knee.setValueAtTime(8, now);
            comp.ratio.setValueAtTime(16, now);
            comp.attack.setValueAtTime(0.001, now);
            comp.release.setValueAtTime(0.25, now);
            comp.connect(audioCtx.destination);

            // --- 1. Concussive Sub-Bass Drop (Sub weight) ---
            const subOsc = audioCtx.createOscillator();
            const subGain = audioCtx.createGain();
            subOsc.type = 'sine';
            subOsc.frequency.setValueAtTime(75, now);
            subOsc.frequency.exponentialRampToValueAtTime(20, now + 1.5);
            subGain.gain.setValueAtTime(0.85, now);
            subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
            subOsc.connect(subGain);
            subGain.connect(comp);
            subOsc.start(now);
            subOsc.stop(now + 1.5);

            // --- 2. Distorted Metallic Crash (Tearing Noise) ---
            const crashBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 1.2, audioCtx.sampleRate);
            const crashData = crashBuffer.getChannelData(0);
            for (let i = 0; i < crashData.length; i++) {
                crashData[i] = Math.random() * 2 - 1;
            }
            const crashNoise = audioCtx.createBufferSource();
            crashNoise.buffer = crashBuffer;

            // Resonant lowpass/bandpass sweeps
            const bpFilter = audioCtx.createBiquadFilter();
            bpFilter.type = 'bandpass';
            bpFilter.frequency.setValueAtTime(600, now);
            bpFilter.frequency.exponentialRampToValueAtTime(90, now + 0.8);
            bpFilter.Q.setValueAtTime(4.0, now);

            // Waveshaper for tearing distortion
            const shaper = audioCtx.createWaveShaper();
            const sCurve = new Float32Array(44100);
            for (let i = 0; i < 44100; i++) {
                const x = (i * 2) / 44100 - 1;
                sCurve[i] = Math.tanh(x * 5.0) / Math.tanh(5.0);
            }
            shaper.curve = sCurve;

            const crashGain = audioCtx.createGain();
            crashGain.gain.setValueAtTime(0.35, now);
            crashGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

            crashNoise.connect(bpFilter);
            bpFilter.connect(shaper);
            shaper.connect(crashGain);
            crashGain.connect(comp);

            crashNoise.start(now);
            crashNoise.stop(now + 0.85);

            // --- 3. Ringing Steel Resonance (Metallic vibration decay) ---
            const metalFreqs = [180.0, 310.0, 520.0, 840.0];
            const metalDecays = [1.2, 0.9, 0.6, 0.4];
            const metalGains = [0.15, 0.10, 0.08, 0.05];

            metalFreqs.forEach((freq, idx) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, now);
                osc.frequency.linearRampToValueAtTime(freq * 0.95, now + metalDecays[idx]);

                const filter = audioCtx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(freq * 1.5, now);

                gain.gain.setValueAtTime(metalGains[idx], now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + metalDecays[idx]);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(comp);

                osc.start(now);
                osc.stop(now + metalDecays[idx]);
            });

        } catch (e) {
            console.warn("Failed to play destruction sound: ", e);
        }
    }

    function playMechaPunchSound() {
        try {
            const audioCtx = getSharedAudioCtx();
            if (!audioCtx) return;
            const now = audioCtx.currentTime;

            // Master compressor
            const compressor = audioCtx.createDynamicsCompressor();
            compressor.threshold.setValueAtTime(-15, now);
            compressor.ratio.setValueAtTime(8, now);
            compressor.connect(audioCtx.destination);

            // 1. Crisp metallic click/clank (short transient)
            const clickOsc = audioCtx.createOscillator();
            const clickGain = audioCtx.createGain();
            clickOsc.type = 'triangle';
            clickOsc.frequency.setValueAtTime(900, now);
            clickOsc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

            clickGain.gain.setValueAtTime(0.2, now);
            clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

            clickOsc.connect(clickGain);
            clickGain.connect(compressor);
            clickOsc.start(now);
            clickOsc.stop(now + 0.05);

            // 2. Heavy hydraulic sub thump
            const thumpOsc = audioCtx.createOscillator();
            const thumpGain = audioCtx.createGain();
            thumpOsc.type = 'sine';
            thumpOsc.frequency.setValueAtTime(140, now);
            thumpOsc.frequency.exponentialRampToValueAtTime(45, now + 0.18);

            thumpGain.gain.setValueAtTime(0.65, now);
            thumpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

            thumpOsc.connect(thumpGain);
            thumpGain.connect(compressor);
            thumpOsc.start(now);
            thumpOsc.stop(now + 0.2);

            // 3. Short pneumatic air hiss (white noise bandpass)
            const bufferSize = audioCtx.sampleRate * 0.3;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;

            const filter = audioCtx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(400, now);
            filter.frequency.exponentialRampToValueAtTime(80, now + 0.25);
            filter.Q.setValueAtTime(3.0, now);

            const noiseGain = audioCtx.createGain();
            noiseGain.gain.setValueAtTime(0.12, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

            noise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(compressor);
            noise.start(now);
            noise.stop(now + 0.25);

        } catch (e) {
            console.warn("Failed to play mecha punch sound:", e);
        }
    }

    function playGearTickSound() {
        try {
            const audioCtx = getSharedAudioCtx();
            if (!audioCtx) return;
            const now = audioCtx.currentTime;

            // Master compressor
            const compressor = audioCtx.createDynamicsCompressor();
            compressor.threshold.setValueAtTime(-10, now);
            compressor.ratio.setValueAtTime(4, now);
            compressor.connect(audioCtx.destination);

            // 1. High metallic click (precise triangle sweep)
            const clickOsc = audioCtx.createOscillator();
            const clickGain = audioCtx.createGain();
            clickOsc.type = 'triangle';
            clickOsc.frequency.setValueAtTime(1800, now);
            clickOsc.frequency.exponentialRampToValueAtTime(1000, now + 0.02);

            clickGain.gain.setValueAtTime(0.06, now);
            clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

            clickOsc.connect(clickGain);
            clickGain.connect(compressor);
            clickOsc.start(now);
            clickOsc.stop(now + 0.02);

            // 2. High-pass filtered noise pop (wooden gear block tap)
            const bufferSize = audioCtx.sampleRate * 0.04;
            const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = audioCtx.createBufferSource();
            noise.buffer = buffer;

            const filter = audioCtx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(3000, now);

            const noiseGain = audioCtx.createGain();
            noiseGain.gain.setValueAtTime(0.04, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

            noise.connect(filter);
            filter.connect(noiseGain);
            noiseGain.connect(compressor);
            noise.start(now);
            noise.stop(now + 0.03);

        } catch (e) {
            console.warn("Failed to play gear tick sound:", e);
        }
    }

    function playLaserSound(duration = 2.0) {
        try {
            const audioCtx = getSharedAudioCtx();
            if (!audioCtx) return;
            const now = audioCtx.currentTime;

            // Master compressor
            const comp = audioCtx.createDynamicsCompressor();
            comp.threshold.setValueAtTime(-20, now);
            comp.ratio.setValueAtTime(6, now);
            comp.connect(audioCtx.destination);

            // Waveshaper for harmonic saturation
            const shaper = audioCtx.createWaveShaper();
            const cLen = 44100;
            const cCurve = new Float32Array(cLen);
            for (let i = 0; i < cLen; i++) {
                const x = (i * 2) / cLen - 1;
                cCurve[i] = Math.tanh(x * 3);
            }
            shaper.curve = cCurve;
            shaper.oversample = '4x';
            shaper.connect(comp);

            // --- Layer 1: Dual detuned sweep (deep power-down) ---
            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            osc1.type = 'sawtooth';
            osc2.type = 'sawtooth';
            osc1.detune.setValueAtTime(-20, now);
            osc2.detune.setValueAtTime(20, now);

            // Start at a menacing mid-range, sweep down to sub-bass
            osc1.frequency.setValueAtTime(800, now);
            osc1.frequency.exponentialRampToValueAtTime(55, now + duration);
            osc2.frequency.setValueAtTime(810, now);
            osc2.frequency.exponentialRampToValueAtTime(58, now + duration);

            // Slow menacing LFO vibrato (8Hz, not 60Hz)
            const lfo = audioCtx.createOscillator();
            const lfoGain = audioCtx.createGain();
            lfo.frequency.setValueAtTime(8, now);
            lfo.frequency.linearRampToValueAtTime(3, now + duration);
            lfoGain.gain.setValueAtTime(40, now);
            lfoGain.gain.linearRampToValueAtTime(15, now + duration);
            lfo.connect(lfoGain);
            lfoGain.connect(osc1.frequency);
            lfoGain.connect(osc2.frequency);

            // Resonant lowpass sweep
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1200, now);
            filter.frequency.exponentialRampToValueAtTime(80, now + duration);
            filter.Q.setValueAtTime(8, now);
            filter.Q.linearRampToValueAtTime(3, now + duration);

            const mainGain = audioCtx.createGain();
            mainGain.gain.setValueAtTime(0, now);
            mainGain.gain.linearRampToValueAtTime(0.15, now + 0.04);
            mainGain.gain.setValueAtTime(0.15, now + duration * 0.7);
            mainGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

            osc1.connect(filter);
            osc2.connect(filter);
            filter.connect(mainGain);
            mainGain.connect(shaper);

            osc1.start(now); osc2.start(now); lfo.start(now);
            osc1.stop(now + duration); osc2.stop(now + duration); lfo.stop(now + duration);

            // --- Layer 2: Sub-bass reinforcement ---
            const subOsc = audioCtx.createOscillator();
            const subGain = audioCtx.createGain();
            subOsc.type = 'sine';
            subOsc.frequency.setValueAtTime(65, now);
            subOsc.frequency.linearRampToValueAtTime(35, now + duration);
            subGain.gain.setValueAtTime(0, now);
            subGain.gain.linearRampToValueAtTime(0.3, now + 0.2);
            subGain.gain.setValueAtTime(0.3, now + duration * 0.6);
            subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
            subOsc.connect(subGain);
            subGain.connect(comp);
            subOsc.start(now); subOsc.stop(now + duration);
        } catch(e) {
            console.warn(e);
        }
    }

    function playExplosionSound() {
        try {
            const audioCtx = getSharedAudioCtx();
            if (!audioCtx) return;
            const now = audioCtx.currentTime;

            // Master compressor
            const comp = audioCtx.createDynamicsCompressor();
            comp.threshold.setValueAtTime(-18, now);
            comp.ratio.setValueAtTime(10, now);
            comp.attack.setValueAtTime(0.001, now);
            comp.release.setValueAtTime(0.1, now);
            comp.connect(audioCtx.destination);

            // 1. Deep sub-bass concussive boom (55Hz → 22Hz)
            const subOsc = audioCtx.createOscillator();
            const subGain = audioCtx.createGain();
            subOsc.type = 'sine';
            subOsc.frequency.setValueAtTime(55, now);
            subOsc.frequency.exponentialRampToValueAtTime(22, now + 1.8);

            subGain.gain.setValueAtTime(0.8, now);
            subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

            subOsc.connect(subGain);
            subGain.connect(comp);
            subOsc.start(now); subOsc.stop(now + 1.8);

            // 2. Heavy FM metal impact (deeper, more modulation)
            const fmCarrier = audioCtx.createOscillator();
            const fmMod = audioCtx.createOscillator();
            const fmModGain = audioCtx.createGain();
            const fmOutGain = audioCtx.createGain();

            fmCarrier.type = 'triangle';
            fmCarrier.frequency.setValueAtTime(280, now);
            fmCarrier.frequency.exponentialRampToValueAtTime(65, now + 0.9);

            fmMod.type = 'square';
            fmMod.frequency.setValueAtTime(180, now);
            fmMod.frequency.exponentialRampToValueAtTime(40, now + 0.9);
            fmModGain.gain.setValueAtTime(600, now);
            fmModGain.gain.exponentialRampToValueAtTime(50, now + 0.9);

            fmOutGain.gain.setValueAtTime(0.25, now);
            fmOutGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

            // Waveshaper for metallic grit
            const impactShaper = audioCtx.createWaveShaper();
            const icLen = 8192;
            const icCurve = new Float32Array(icLen);
            for (let i = 0; i < icLen; i++) {
                const x = (i * 2) / icLen - 1;
                icCurve[i] = (Math.PI + 100) * x / (Math.PI + 100 * Math.abs(x));
            }
            impactShaper.curve = icCurve;
            impactShaper.oversample = '4x';

            fmMod.connect(fmModGain);
            fmModGain.connect(fmCarrier.frequency);
            fmCarrier.connect(fmOutGain);
            fmOutGain.connect(impactShaper);
            impactShaper.connect(comp);

            fmCarrier.start(now); fmMod.start(now);
            fmCarrier.stop(now + 0.9); fmMod.stop(now + 0.9);

            // 3. Compressed industrial noise tail (bandpass-filtered debris)
            const bufLen = audioCtx.sampleRate * 1.4;
            const buffer = audioCtx.createBuffer(1, bufLen, audioCtx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufLen; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noiseSrc = audioCtx.createBufferSource();
            noiseSrc.buffer = buffer;

            const noiseBp = audioCtx.createBiquadFilter();
            noiseBp.type = 'bandpass';
            noiseBp.frequency.setValueAtTime(400, now);
            noiseBp.frequency.exponentialRampToValueAtTime(60, now + 1.2);
            noiseBp.Q.setValueAtTime(2.5, now);

            const noiseLp = audioCtx.createBiquadFilter();
            noiseLp.type = 'lowpass';
            noiseLp.frequency.setValueAtTime(500, now);
            noiseLp.frequency.exponentialRampToValueAtTime(50, now + 1.2);

            const noiseGain = audioCtx.createGain();
            noiseGain.gain.setValueAtTime(0.3, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

            noiseSrc.connect(noiseBp);
            noiseBp.connect(noiseLp);
            noiseLp.connect(noiseGain);
            noiseGain.connect(comp);

            noiseSrc.start(now); noiseSrc.stop(now + 1.4);
        } catch(e) {
            console.warn(e);
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

    // Handle boot screen auto-transition (no button needed)
    const bootProgressBar = document.getElementById('boot-progress-bar');
    
    // After progress bar fills (4.5s), start the cinematic auto-reveal
    setTimeout(() => {
        if (bootText) {
            bootText.textContent = "BREACHING INTERFACE...";
        }
        
        // Brief dramatic pause, then auto-trigger the transition
        setTimeout(() => {
            try {
                if (bootLoader) {
                    // Add the cinematic slow-mo fade-out class
                    bootLoader.classList.add('fade-out');
                    
                    // Try playing sound safely (user gesture not needed for AudioContext on many browsers)
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
                // Emergency bypass
                if (bootLoader) bootLoader.remove();
                document.body.classList.remove('booting');
                document.body.classList.add('boot-complete');
            }
        }, 800); // 800ms dramatic pause after "BREACHING INTERFACE..."
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
    // 0.45 LIVE HEADER CLOCK & DATE
    // -----------------------------------------------------------------
    const clockTimeEl = document.getElementById('clock-time-val');
    const clockDateEl = document.getElementById('clock-date-val');

    function updateLiveClock() {
        const now = new Date();
        
        const hrs = String(now.getHours()).padStart(2, '0');
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        
        if (clockTimeEl) {
            clockTimeEl.textContent = `${hrs}:${mins}:${secs}`;
        }
        
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        if (clockDateEl) {
            clockDateEl.textContent = now.toLocaleDateString('en-US', options);
        }
    }
    
    updateLiveClock();
    setInterval(updateLiveClock, 1000);

    // -----------------------------------------------------------------
    // 0.5 DYNAMIC TOP STATUS BAR
    // -----------------------------------------------------------------
    const statusTextEl = document.getElementById('status-text');
    let isBeastMode = false; // Beast mode state variable
    let selectedEngine = localStorage.getItem('naz-engine') || 'naz-core';
    const engineNames = {
        'naz-core': 'NAZ-CORE v1.0',
        'quantum-x': 'QUANTUM-X v2.4',
        'phantom': 'PHANTOM v0.9',
        'nebula': 'NEBULA v3.1'
    };

    const statuses = [
        engineNames[selectedEngine] || 'NAZ-CORE v1.0',
        "SYSTEM NOMINAL",
        "AWAITING INPUT",
        "NEURAL NET STABLE",
        "MONITORING FREQUENCIES",
        "QUANTUM LINK ESTABLISHED"
    ];

    if (statusTextEl) {
        statusTextEl.textContent = statuses[0];
        let currentStatusIdx = 0;
        let charIdx = statuses[0].length; // Start fully typed
        let isDeleting = false;
        
        function typeStatus() {
            let currentText = statuses[currentStatusIdx % statuses.length];
            
            if (isBeastMode) {
                const beastStatuses = [
                    "⚡ BEAST PROTOCOL ONLINE ⚡",
                    "⚠️ AUTONOMOUS CORE ACTIVE ⚠️",
                    "🚨 WARNING: ZERO LIMITS 🚨",
                    "🧬 COGNITIVE OVERCLOCK ACTIVE 🧬",
                    "🔥 THREAT DETECTION MAXIMUM 🔥"
                ];
                currentText = beastStatuses[currentStatusIdx % beastStatuses.length];
            }
            
            if (isDeleting) {
                charIdx--;
            } else {
                charIdx++;
            }
            
            statusTextEl.textContent = currentText.substring(0, charIdx) + (charIdx === currentText.length ? '' : '█');
            
            let typingSpeed = isDeleting ? 40 : 80;
            
            if (!isDeleting && charIdx === currentText.length) {
                statusTextEl.textContent = currentText; // remove block at end
                typingSpeed = 4000;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                if (isBeastMode) {
                    currentStatusIdx = (currentStatusIdx + 1) % 5;
                } else {
                    currentStatusIdx = (currentStatusIdx + 1) % statuses.length;
                }
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

    // -----------------------------------------------------------------
    // 0.1 AUTO THEME CYCLING MODE
    // -----------------------------------------------------------------
    let autoThemeInterval = null;
    const savedThemeMode = localStorage.getItem('naz-theme-mode') || 'manual';

    const themeModeContainer = document.getElementById('theme-mode-options');
    if (themeModeContainer) {
        const themeModeOpts = themeModeContainer.querySelectorAll('.theme-mode-opt');

        // Restore saved mode
        if (savedThemeMode === 'auto') {
            themeModeOpts.forEach(b => b.classList.remove('active'));
            const autoBtn = themeModeContainer.querySelector('[data-mode="auto"]');
            if (autoBtn) autoBtn.classList.add('active');
            startAutoTheme();
        }

        themeModeOpts.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const mode = btn.dataset.mode;
                themeModeOpts.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                localStorage.setItem('naz-theme-mode', mode);

                if (mode === 'auto') {
                    startAutoTheme();
                } else {
                    stopAutoTheme();
                }
            });
        });
    }

    function startAutoTheme() {
        stopAutoTheme();
        autoThemeInterval = setInterval(() => {
            currentThemeIndex = (currentThemeIndex + 1) % themes.length;
            applyTheme(currentThemeIndex);

            // Visual flash
            const coreEl = document.getElementById('ai-core');
            if (coreEl) {
                coreEl.classList.remove('theme-flash');
                void coreEl.offsetWidth;
                coreEl.classList.add('theme-flash');
                setTimeout(() => coreEl.classList.remove('theme-flash'), 800);
            }
            themeSurge = 1.0;
        }, 8000);
    }

    function stopAutoTheme() {
        if (autoThemeInterval) {
            clearInterval(autoThemeInterval);
            autoThemeInterval = null;
        }
    }

    // -----------------------------------------------------------------
    // 0.2 FOCUS MODE
    // -----------------------------------------------------------------
    let isFocusMode = false;
    const focusToggleBtn = document.getElementById('focus-toggle-btn');
    const focusLabel = document.getElementById('focus-label');
    const focusVignette = document.getElementById('focus-vignette');

    function playFocusChime(activating) {
        try {
            const audioCtx = getSharedAudioCtx();
            if (!audioCtx) return;
            const now = audioCtx.currentTime;

            if (activating) {
                // Gentle ascending chime (warm sine + soft triangle)
                const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 — major chord ascending
                notes.forEach((freq, i) => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now + i * 0.18);
                    gain.gain.setValueAtTime(0, now + i * 0.18);
                    gain.gain.linearRampToValueAtTime(0.12, now + i * 0.18 + 0.06);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.18 + 0.9);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start(now + i * 0.18);
                    osc.stop(now + i * 0.18 + 0.9);

                    // Soft triangle harmonic layer
                    const harm = audioCtx.createOscillator();
                    const harmGain = audioCtx.createGain();
                    harm.type = 'triangle';
                    harm.frequency.setValueAtTime(freq * 2, now + i * 0.18);
                    harmGain.gain.setValueAtTime(0, now + i * 0.18);
                    harmGain.gain.linearRampToValueAtTime(0.04, now + i * 0.18 + 0.04);
                    harmGain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.18 + 0.6);
                    harm.connect(harmGain);
                    harmGain.connect(audioCtx.destination);
                    harm.start(now + i * 0.18);
                    harm.stop(now + i * 0.18 + 0.6);
                });
            } else {
                // Gentle descending chime (deactivation)
                const notes = [783.99, 659.25, 523.25]; // G5, E5, C5
                notes.forEach((freq, i) => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now + i * 0.15);
                    gain.gain.setValueAtTime(0, now + i * 0.15);
                    gain.gain.linearRampToValueAtTime(0.1, now + i * 0.15 + 0.05);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.7);
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start(now + i * 0.15);
                    osc.stop(now + i * 0.15 + 0.7);
                });
            }
        } catch (e) {
            console.warn('Focus chime failed:', e);
        }
    }

    if (focusToggleBtn) {
        focusToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isFocusMode = !isFocusMode;

            const coreEl = document.getElementById('ai-core');
            const aiTextEl = document.getElementById('ai-text');

            if (isFocusMode) {
                // Activate focus mode
                focusToggleBtn.classList.add('focus-active');
                if (focusLabel) focusLabel.textContent = 'FOCUS: ON';
                if (focusVignette) focusVignette.classList.add('active');

                // Cute core reaction
                if (coreEl) {
                    coreEl.classList.remove('focus-react');
                    void coreEl.offsetWidth;
                    coreEl.classList.add('focus-react');
                    setTimeout(() => coreEl.classList.remove('focus-react'), 1200);
                }

                // Naz says focusing
                if (aiTextEl) {
                    aiTextEl.textContent = 'Focusing... all distractions silenced 🧘';
                }
                if (typeof speakAloud === 'function') {
                    speakAloud('Focusing... all distractions silenced.');
                }

                // Override status bar
                if (statusTextEl) {
                    statusTextEl.textContent = 'FOCUS MODE ACTIVE';
                }

                // Sound & particles
                playFocusChime(true);
                spawnEmotionParticles(['🧘', '🎯', '🔕', '💭', '✨']);
            } else {
                // Deactivate focus mode
                focusToggleBtn.classList.remove('focus-active');
                if (focusLabel) focusLabel.textContent = 'FOCUS: OFF';
                if (focusVignette) focusVignette.classList.remove('active');

                // Core bounce
                if (coreEl) {
                    coreEl.classList.remove('focus-react');
                    void coreEl.offsetWidth;
                    coreEl.classList.add('focus-react');
                    setTimeout(() => coreEl.classList.remove('focus-react'), 1200);
                }

                if (aiTextEl) {
                    aiTextEl.textContent = 'Focus mode disengaged. Back to full spectrum.';
                }
                if (typeof speakAloud === 'function') {
                    speakAloud('Focus mode disengaged. Back to full spectrum.');
                }

                // Restore status bar cycling
                if (statusTextEl) {
                    const engineNames = {
                        'naz-core': 'NAZ-CORE v1.0',
                        'quantum-x': 'QUANTUM-X v2.4',
                        'phantom': 'PHANTOM v0.9',
                        'nebula': 'NEBULA v3.1'
                    };
                    const selectedEngine = localStorage.getItem('naz-engine') || 'naz-core';
                    statusTextEl.textContent = engineNames[selectedEngine] || 'NAZ-CORE v1.0';
                }

                playFocusChime(false);
                spawnEmotionParticles(['⚡', '🔊', '🌐', '💥', '✨']);
            }
        });
    }

    // -----------------------------------------------------------------
    // 0.3 ENGINE SWITCHER
    // -----------------------------------------------------------------
    selectedEngine = localStorage.getItem('naz-engine') || 'naz-core';

    const engineContainer = document.getElementById('engine-options');

    function playEngineSwitchSound() {
        try {
            const audioCtx = getSharedAudioCtx();
            if (!audioCtx) return;
            const now = audioCtx.currentTime;

            // Compressor
            const comp = audioCtx.createDynamicsCompressor();
            comp.threshold.setValueAtTime(-18, now);
            comp.ratio.setValueAtTime(6, now);
            comp.connect(audioCtx.destination);

            // Power-down sweep (brief)
            const downOsc = audioCtx.createOscillator();
            const downGain = audioCtx.createGain();
            downOsc.type = 'sawtooth';
            downOsc.frequency.setValueAtTime(600, now);
            downOsc.frequency.exponentialRampToValueAtTime(40, now + 0.4);
            downGain.gain.setValueAtTime(0.12, now);
            downGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            downOsc.connect(downGain);
            downGain.connect(comp);
            downOsc.start(now);
            downOsc.stop(now + 0.4);

            // Brief silence gap, then power-up sweep
            const upOsc1 = audioCtx.createOscillator();
            const upOsc2 = audioCtx.createOscillator();
            const upGain = audioCtx.createGain();
            const upFilter = audioCtx.createBiquadFilter();

            upOsc1.type = 'sawtooth';
            upOsc2.type = 'sawtooth';
            upOsc1.detune.setValueAtTime(-15, now);
            upOsc2.detune.setValueAtTime(15, now);
            upOsc1.frequency.setValueAtTime(50, now + 0.5);
            upOsc1.frequency.exponentialRampToValueAtTime(400, now + 1.3);
            upOsc1.frequency.exponentialRampToValueAtTime(250, now + 1.8);
            upOsc2.frequency.setValueAtTime(52, now + 0.5);
            upOsc2.frequency.exponentialRampToValueAtTime(405, now + 1.3);
            upOsc2.frequency.exponentialRampToValueAtTime(253, now + 1.8);

            upFilter.type = 'lowpass';
            upFilter.frequency.setValueAtTime(100, now + 0.5);
            upFilter.frequency.exponentialRampToValueAtTime(2000, now + 1.3);
            upFilter.frequency.exponentialRampToValueAtTime(600, now + 1.8);
            upFilter.Q.setValueAtTime(4, now);

            upGain.gain.setValueAtTime(0, now);
            upGain.gain.setValueAtTime(0, now + 0.5);
            upGain.gain.linearRampToValueAtTime(0.14, now + 0.65);
            upGain.gain.setValueAtTime(0.14, now + 1.3);
            upGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

            upOsc1.connect(upFilter);
            upOsc2.connect(upFilter);
            upFilter.connect(upGain);
            upGain.connect(comp);

            upOsc1.start(now + 0.5);
            upOsc2.start(now + 0.5);
            upOsc1.stop(now + 1.8);
            upOsc2.stop(now + 1.8);

            // Sub-bass thump at boot
            const subOsc = audioCtx.createOscillator();
            const subGain = audioCtx.createGain();
            subOsc.type = 'sine';
            subOsc.frequency.setValueAtTime(55, now + 0.5);
            subGain.gain.setValueAtTime(0, now);
            subGain.gain.setValueAtTime(0, now + 0.5);
            subGain.gain.linearRampToValueAtTime(0.35, now + 0.6);
            subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
            subOsc.connect(subGain);
            subGain.connect(comp);
            subOsc.start(now + 0.5);
            subOsc.stop(now + 1.8);

            // Confirmation chime at the end
            const chime = audioCtx.createOscillator();
            const chimeGain = audioCtx.createGain();
            chime.type = 'sine';
            chime.frequency.setValueAtTime(880, now + 1.4);
            chimeGain.gain.setValueAtTime(0, now);
            chimeGain.gain.setValueAtTime(0, now + 1.4);
            chimeGain.gain.linearRampToValueAtTime(0.08, now + 1.45);
            chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
            chime.connect(chimeGain);
            chimeGain.connect(comp);
            chime.start(now + 1.4);
            chime.stop(now + 2.0);
        } catch (e) {
            console.warn('Engine switch sound failed:', e);
        }
    }

    function switchEngine(engine) {
        selectedEngine = engine;
        localStorage.setItem('naz-engine', engine);

        // Update active class on Fun Zone controls
        if (engineContainer) {
            const engineBtns = engineContainer.querySelectorAll('.engine-opt');
            engineBtns.forEach(b => {
                b.classList.remove('active');
                if (b.dataset.engine === engine) b.classList.add('active');
            });
        }

        // Update active class on Chat Panel controls
        const chatEngineContainer = document.getElementById('chat-engine-options');
        if (chatEngineContainer) {
            const chatEngineBtns = chatEngineContainer.querySelectorAll('.chat-engine-opt');
            chatEngineBtns.forEach(b => {
                b.classList.remove('active');
                if (b.dataset.engine === engine) b.classList.add('active');
            });
        }

        // Dynamic Status sync update
        const fullEngineNames = {
            'naz-core': 'NAZ-CORE v1.0',
            'quantum-x': 'QUANTUM-X v2.4',
            'phantom': 'PHANTOM v0.9',
            'nebula': 'NEBULA v3.1'
        };
        statuses[0] = fullEngineNames[engine] || engine.toUpperCase();
        if (statusTextEl && !isBeastMode) {
            statusTextEl.textContent = statuses[0];
        }
        const engineNameEl = document.getElementById('settings-engine-name');
        if (engineNameEl) {
            engineNameEl.textContent = statuses[0];
        }

        // Play power-up transition sound
        playEngineSwitchSound();

        // Core reboot animation
        const coreEl = document.getElementById('ai-core');
        if (coreEl) {
            coreEl.classList.remove('engine-reboot');
            void coreEl.offsetWidth;
            coreEl.classList.add('engine-reboot');
            setTimeout(() => coreEl.classList.remove('engine-reboot'), 800);
        }

        // Naz reaction
        const engineNames = {
            'naz-core': 'NAZ-CORE v1',
            'quantum-x': 'QUANTUM-X',
            'phantom': 'PHANTOM',
            'nebula': 'NEBULA'
        };
        const engineEmojis = {
            'naz-core': ['⚡', '🤖', '🔋', '💎', '✨'],
            'quantum-x': ['⚛️', '🔮', '🌀', '💠', '🧬'],
            'phantom': ['👻', '🕶️', '🌑', '💨', '🖤'],
            'nebula': ['🌌', '✨', '🎨', '💫', '🪐']
        };

        const displayName = engineNames[engine] || engine.toUpperCase();
        const aiTextEl = document.getElementById('ai-text');
        if (aiTextEl) {
            aiTextEl.textContent = `Engine switched to ${displayName}. Systems recalibrating...`;
        }
        
        // Push notice inside chat board as well if open
        if (typeof appendMessageBubble === 'function' && appContainer && appContainer.classList.contains('chat-active')) {
            const systemMsg = `System notification: Engine migrated to ${displayName}`;
            appendMessageBubble('system', systemMsg);
        }

        if (typeof speakAloud === 'function') {
            speakAloud(`Engine switched to ${displayName}. Systems recalibrating.`);
        }

        spawnEmotionParticles(engineEmojis[engine] || ['⚡', '✨']);

        // Visual surge
        themeSurge = 1.0;
    }

    // Restore saved engine on load for both UI views
    const savedEng = localStorage.getItem('naz-engine') || 'naz-core';
    if (engineContainer) {
        const engineBtns = engineContainer.querySelectorAll('.engine-opt');
        engineBtns.forEach(b => {
            b.classList.remove('active');
            if (b.dataset.engine === savedEng) b.classList.add('active');
        });
    }
    const chatEngineContainer = document.getElementById('chat-engine-options');
    if (chatEngineContainer) {
        const chatEngineBtns = chatEngineContainer.querySelectorAll('.chat-engine-opt');
        chatEngineBtns.forEach(b => {
            b.classList.remove('active');
            if (b.dataset.engine === savedEng) b.classList.add('active');
        });
    }

    const initialEngine = savedEng;
    const engineNameEl = document.getElementById('settings-engine-name');
    if (engineNameEl) {
        const fullEngineNames = {
            'naz-core': 'NAZ-CORE v1.0',
            'quantum-x': 'QUANTUM-X v2.4',
            'phantom': 'PHANTOM v0.9',
            'nebula': 'NEBULA v3.1'
        };
        engineNameEl.textContent = fullEngineNames[initialEngine] || 'NAZ-CORE v1.0';
    }

    // Attach click listeners
    if (engineContainer) {
        const engineBtns = engineContainer.querySelectorAll('.engine-opt');
        engineBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                switchEngine(btn.dataset.engine);
            });
        });
    }
    if (chatEngineContainer) {
        const chatEngineBtns = chatEngineContainer.querySelectorAll('.chat-engine-opt');
        chatEngineBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                switchEngine(btn.dataset.engine);
            });
        });
    }

    // -----------------------------------------------------------------
    // 0.4 OS DETECTION (ONE-TIME)
    // -----------------------------------------------------------------
    function detectOS() {
        const ua = navigator.userAgent || '';
        const platform = navigator.platform || '';

        if (/iPad|iPhone|iPod/.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return { name: 'iOS', icon: '📱' };
        if (/Android/i.test(ua)) return { name: 'Android', icon: '📱' };
        if (/Mac/i.test(platform)) return { name: 'macOS', icon: '🍎' };
        if (/Win/i.test(platform)) return { name: 'Windows', icon: '🪟' };
        if (/Linux/i.test(platform)) return { name: 'Linux', icon: '🐧' };
        return { name: 'Unknown OS', icon: '🖥️' };
    }

    // Show OS toast once, after boot sequence completes (~7s)
    if (!localStorage.getItem('naz-os-detected')) {
        setTimeout(() => {
            const os = detectOS();
            const toast = document.getElementById('os-detect-toast');
            const toastIcon = document.getElementById('os-detect-icon');
            const toastText = document.getElementById('os-detect-text');

            if (toast && toastIcon && toastText) {
                toastIcon.textContent = os.icon;
                toastText.textContent = `SYSTEM DETECTED: ${os.name} · WELCOME, OPERATOR`;
                localStorage.setItem('naz-os-detected', os.name);

                // Slide up
                toast.classList.add('visible');

                // Auto-dismiss after 5 seconds
                setTimeout(() => {
                    toast.classList.remove('visible');
                    toast.classList.add('hiding');
                    setTimeout(() => toast.classList.remove('hiding'), 700);
                }, 5000);
            }
        }, 7000);
    }

    const cursorSettingsToggle = document.getElementById('cursor-settings-toggle');

    // =================================================================
    // FUN ZONE & macOS LOCK SCREEN SYSTEM
    // =================================================================
    let isSystemLocked = false;
    let previewTriggerSource = null; // 'settings' or 'fun-zone'
    let beastInterval = null;

    const funZoneToggle = document.getElementById('fun-zone-toggle');
    const funZoneModal = document.getElementById('fun-zone-modal');
    const funZoneClose = document.getElementById('fun-zone-close');
    const funArmsPreviewTrigger = document.getElementById('fun-arms-preview-trigger');
    const lockScreen = document.getElementById('macos-lock-screen');
    const lockForm = document.getElementById('lock-screen-form');
    const lockPasswordInput = document.getElementById('lock-password-input');
    const lockPasswordWrapper = document.getElementById('lock-password-wrapper');
    const lockErrorMsg = document.getElementById('lock-error-msg');
    const lockCanvas = document.getElementById('lock-avatar-canvas');
    const lockAvatarFallback = document.getElementById('lock-avatar-fallback');

    const settingsModal = document.getElementById('settings-modal');
    const settingsClose = document.getElementById('settings-close');
    const manualLockBtn = document.getElementById('manual-lock-btn');
    const settingsOsLink = document.getElementById('settings-os-link');
    const settingsUptime = document.getElementById('settings-uptime');
    const beastModeBtn = document.getElementById('beast-mode-btn');

    const appStartTime = Date.now();

    function updateSettingsUptime() {
        if (!settingsUptime) return;
        const diffMs = Date.now() - appStartTime;
        const diffSecs = Math.floor(diffMs / 1000) % 60;
        const diffMins = Math.floor(diffMs / 60000) % 60;
        const diffHours = Math.floor(diffMs / 3600000);
        
        const pad = (n) => String(n).padStart(2, '0');
        settingsUptime.textContent = `${pad(diffHours)}:${pad(diffMins)}:${pad(diffSecs)}`;
    }

    function updateSettingsOS() {
        if (settingsOsLink) {
            const os = detectOS();
            settingsOsLink.textContent = `${os.icon} ${os.name.toUpperCase()} SYSTEM SECURED`;
        }
    }

    // Update Uptime every second if Settings modal is open
    setInterval(() => {
        if (settingsModal && settingsModal.classList.contains('visible')) {
            updateSettingsUptime();
        }
    }, 1000);

    function showSettings() {
        if (isSystemLocked) return;
        hideFunZone(); // Close Fun Zone if open
        if (typeof closeChatPanel === 'function') closeChatPanel(); // Close Chat Panel if open
        if (settingsModal) {
            settingsModal.classList.remove('hidden');
            settingsModal.offsetHeight;
            settingsModal.classList.add('visible');
        }
        updateSettingsUptime();
        updateSettingsOS();
    }

    function hideSettings() {
        if (settingsModal) {
            settingsModal.classList.remove('visible');
            setTimeout(() => {
                settingsModal.classList.add('hidden');
            }, 400);
        }
    }

    function showFunZone() {
        if (isSystemLocked) return;
        hideSettings(); // Close Settings if open
        if (typeof closeChatPanel === 'function') closeChatPanel(); // Close Chat Panel if open
        if (funZoneModal) {
            funZoneModal.classList.remove('hidden');
            funZoneModal.offsetHeight;
            funZoneModal.classList.add('visible');
        }
    }

    function hideFunZone() {
        if (funZoneModal) {
            funZoneModal.classList.remove('visible');
            setTimeout(() => {
                funZoneModal.classList.add('hidden');
            }, 400);
        }
    }

    if (cursorSettingsToggle) {
        cursorSettingsToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            showSettings();
        });
    }

    if (funZoneToggle) {
        funZoneToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            showFunZone();
        });
    }

    if (settingsClose) settingsClose.addEventListener('click', hideSettings);
    if (funZoneClose) funZoneClose.addEventListener('click', hideFunZone);

    // Custom API Key Settings handlers
    const apiKeyInput = document.getElementById('custom-api-key-input');
    const saveApiKeyBtn = document.getElementById('save-api-key-btn');
    const apiKeyStatus = document.getElementById('api-key-status');

    if (apiKeyInput && saveApiKeyBtn && apiKeyStatus) {
        // Restore saved key
        const savedKey = localStorage.getItem('naz-custom-api-key') || '';
        if (savedKey) {
            apiKeyInput.value = savedKey;
            apiKeyStatus.textContent = 'Status: Custom key active (locally saved)';
            apiKeyStatus.style.color = 'var(--accent-cyan)';
            apiKeyStatus.style.display = 'block';
        }

        saveApiKeyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const val = apiKeyInput.value.trim();
            if (val) {
                localStorage.setItem('naz-custom-api-key', val);
                apiKeyStatus.textContent = 'Status: Custom key updated and active!';
                apiKeyStatus.style.color = 'var(--accent-cyan)';
                apiKeyStatus.style.display = 'block';
                // Show floating text notification
                const displayMsg = 'System: Custom API key linked.';
                const aiTextEl = document.getElementById('ai-text');
                if (aiTextEl) aiTextEl.textContent = displayMsg;
                if (typeof speakAloud === 'function') speakAloud('Custom API key linked.');
            } else {
                localStorage.removeItem('naz-custom-api-key');
                apiKeyStatus.textContent = 'Status: Cleared. Using server default key.';
                apiKeyStatus.style.color = 'rgba(255,255,255,0.4)';
                apiKeyStatus.style.display = 'block';
                // Show floating text notification
                const displayMsg = 'System: API key reset to default.';
                const aiTextEl = document.getElementById('ai-text');
                if (aiTextEl) aiTextEl.textContent = displayMsg;
                if (typeof speakAloud === 'function') speakAloud('API key reset to default.');
            }
        });

        // Highlight input field focus outline
        apiKeyInput.addEventListener('focus', () => {
            apiKeyInput.style.borderColor = 'var(--accent-cyan)';
        });
        apiKeyInput.addEventListener('blur', () => {
            apiKeyInput.style.borderColor = 'rgba(255,255,255,0.08)';
        });
    }

    // Manual Lockdown Button inside Settings
    if (manualLockBtn) {
        manualLockBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hideSettings();
            triggerLockdown();
        });
    }

    // Beast Mode Audio Synthesizer
    function playBeastModeSound(active) {
        try {
            const audioCtx = getSharedAudioCtx();
            if (!audioCtx) return;
            const now = audioCtx.currentTime;
            
            const comp = audioCtx.createDynamicsCompressor();
            comp.threshold.setValueAtTime(-12, now);
            comp.ratio.setValueAtTime(8, now);
            comp.connect(audioCtx.destination);

            if (active) {
                const osc1 = audioCtx.createOscillator();
                const osc2 = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                const filter = audioCtx.createBiquadFilter();

                osc1.type = 'sawtooth';
                osc2.type = 'square';
                
                osc1.frequency.setValueAtTime(60, now);
                osc1.frequency.linearRampToValueAtTime(320, now + 1.2);
                osc1.frequency.exponentialRampToValueAtTime(150, now + 1.8);

                osc2.frequency.setValueAtTime(62, now);
                osc2.frequency.linearRampToValueAtTime(325, now + 1.2);
                osc2.frequency.exponentialRampToValueAtTime(152, now + 1.8);

                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(150, now);
                filter.frequency.linearRampToValueAtTime(2500, now + 1.2);
                filter.frequency.exponentialRampToValueAtTime(800, now + 1.8);
                filter.Q.setValueAtTime(8, now);

                gain.gain.setValueAtTime(0.001, now);
                gain.gain.linearRampToValueAtTime(0.25, now + 0.3);
                gain.gain.linearRampToValueAtTime(0.2, now + 1.2);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

                osc1.connect(filter);
                osc2.connect(filter);
                filter.connect(gain);
                gain.connect(comp);

                osc1.start(now);
                osc2.start(now);
                osc1.stop(now + 1.8);
                osc2.stop(now + 1.8);

                const sub = audioCtx.createOscillator();
                const subGain = audioCtx.createGain();
                sub.type = 'sine';
                sub.frequency.setValueAtTime(45, now + 1.2);
                sub.frequency.exponentialRampToValueAtTime(25, now + 1.8);
                subGain.gain.setValueAtTime(0, now);
                subGain.gain.setValueAtTime(0.4, now + 1.2);
                subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
                sub.connect(subGain);
                subGain.connect(comp);
                sub.start(now + 1.2);
                sub.stop(now + 1.8);
            } else {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(120, now);
                osc.frequency.linearRampToValueAtTime(30, now + 0.6);
                
                gain.gain.setValueAtTime(0.18, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

                osc.connect(gain);
                gain.connect(comp);
                osc.start(now);
                osc.stop(now + 0.6);
            }
        } catch(err) {
            console.warn('Beast mode sound failed:', err);
        }
    }

    function startBeastAutonomy() {
        if (beastInterval) clearInterval(beastInterval);
        
        beastInterval = setInterval(() => {
            if (!isBeastMode) {
                clearInterval(beastInterval);
                return;
            }

            const actionType = Math.floor(Math.random() * 4);
            const aiTextEl = document.getElementById('ai-text');
            
            if (actionType === 0) {
                // Autonomously customize cursor style
                const opts = document.querySelectorAll('.cursor-opt');
                if (opts.length > 0) {
                    const randomOpt = opts[Math.floor(Math.random() * opts.length)];
                    const styleName = randomOpt.textContent.trim();
                    randomOpt.click();
                    
                    const msg = `Autonomously calibrating synaptic interface to cursor effect: ${styleName}`;
                    if (aiTextEl) aiTextEl.textContent = msg;
                    if (typeof speakAloud === 'function') speakAloud(msg);
                }
            } else if (actionType === 1) {
                // Autonomously customize core design
                const opts = document.querySelectorAll('.core-design-opt');
                if (opts.length > 0) {
                    const randomOpt = opts[Math.floor(Math.random() * opts.length)];
                    const designName = randomOpt.textContent.trim();
                    randomOpt.click();
                    
                    const msg = `Autonomously re-aligning primary core geometry: ${designName}`;
                    if (aiTextEl) aiTextEl.textContent = msg;
                    if (typeof speakAloud === 'function') speakAloud(msg);
                }
            } else if (actionType === 2) {
                // Autonomously calibrate weapon joints / preview robotic arm
                const opts = document.querySelectorAll('.arm-opt');
                if (opts.length > 0) {
                    const randomOpt = opts[Math.floor(Math.random() * opts.length)];
                    const armName = randomOpt.textContent.trim();
                    randomOpt.click();
                    
                    const previewTrigger = document.getElementById('fun-arms-preview-trigger');
                    if (previewTrigger) previewTrigger.click();
                    
                    const msg = `Autonomously testing cybernetic combat joints: ${armName}`;
                    if (aiTextEl) aiTextEl.textContent = msg;
                    if (typeof speakAloud === 'function') speakAloud(msg);
                }
            } else if (actionType === 3) {
                // Autonomously cycle engine model
                const opts = document.querySelectorAll('.engine-opt');
                if (opts.length > 0) {
                    const randomOpt = opts[Math.floor(Math.random() * opts.length)];
                    const engineName = randomOpt.textContent.trim();
                    randomOpt.click();
                    
                    const msg = `Autonomously switching core engine processor to: ${engineName}`;
                    if (aiTextEl) aiTextEl.textContent = msg;
                    if (typeof speakAloud === 'function') speakAloud(msg);
                }
            }

            spawnEmotionParticles(['🔥', '🚨', '⚡', '🔴']);
        }, 4500); // Trigger action every 4.5 seconds
    }

    function stopBeastAutonomy() {
        if (beastInterval) {
            clearInterval(beastInterval);
            beastInterval = null;
        }
    }

    // Beast Mode Button click listener
    if (beastModeBtn) {
        beastModeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isBeastMode = !isBeastMode;
            
            const aiTextEl = document.getElementById('ai-text');
            
            if (isBeastMode) {
                document.body.classList.add('beast-mode-active');
                beastModeBtn.textContent = "Deactivate";
                beastModeBtn.classList.add('active');
                
                playBeastModeSound(true);
                
                if (statusTextEl) {
                    statusTextEl.textContent = "⚡ BEAST PROTOCOL ONLINE ⚡";
                }
                
                const comment = "Autonomous Beast Mode activated. Neural core operating at maximum capability.";
                if (aiTextEl) {
                    aiTextEl.textContent = comment;
                }
                if (typeof speakAloud === 'function') {
                    speakAloud(comment);
                }
                
                // Spawn warning red particles
                spawnEmotionParticles(['🔥', '🚨', '⚡', '🔴']);
                
                // Engage autonomous behavior
                startBeastAutonomy();
            } else {
                document.body.classList.remove('beast-mode-active');
                beastModeBtn.textContent = "Activate";
                beastModeBtn.classList.remove('active');
                
                playBeastModeSound(false);
                
                if (statusTextEl) {
                    statusTextEl.textContent = statuses[0];
                }
                
                const comment = "Autonomous protocols disengaged. System returning to standard standby.";
                if (aiTextEl) {
                    aiTextEl.textContent = comment;
                }
                if (typeof speakAloud === 'function') {
                    speakAloud(comment);
                }
                
                spawnEmotionParticles(['⚡', '✨']);
                
                // Disengage autonomous behavior
                stopBeastAutonomy();
            }
        });
    }

    // macOS Sonoma Lock Sound
    function playMacLockSound() {
        try {
            const audioCtx = getSharedAudioCtx();
            if (!audioCtx) return;
            const now = audioCtx.currentTime;

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(320, now);
            osc.frequency.exponentialRampToValueAtTime(130, now + 0.15);

            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.15);
        } catch (e) {}
    }

    // macOS Sonoma Unlock Sound
    function playMacUnlockSound() {
        try {
            const audioCtx = getSharedAudioCtx();
            if (!audioCtx) return;
            const now = audioCtx.currentTime;

            const osc1 = audioCtx.createOscillator();
            const gain1 = audioCtx.createGain();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(320, now);
            osc1.frequency.setValueAtTime(480, now + 0.05);

            gain1.gain.setValueAtTime(0.25, now);
            gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

            osc1.connect(gain1);
            gain1.connect(audioCtx.destination);
            osc1.start(now);
            osc1.stop(now + 0.2);
        } catch (e) {}
    }

    function triggerLockdown() {
        isSystemLocked = true;

        // Lock screen visible
        if (lockScreen) {
            lockScreen.classList.remove('hidden');
            lockScreen.offsetHeight;
            lockScreen.classList.add('visible');
        }

        if (lockPasswordInput) {
            lockPasswordInput.value = '';
            setTimeout(() => {
                lockPasswordInput.focus();
            }, 500);
        }

        // Use fallback profile icon
        if (lockCanvas) {
            lockCanvas.classList.add('hidden');
        }
        if (lockAvatarFallback) {
            lockAvatarFallback.classList.remove('hidden');
        }

        playMacLockSound();
        speakAloud("System lockdown triggered. Please enter passcode.");
    }

    if (lockForm) {
        lockForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!lockPasswordInput) return;

            const pass = lockPasswordInput.value.trim();
            if (pass === '1234') {
                isSystemLocked = false;
                playMacUnlockSound();

                if (lockScreen) {
                    lockScreen.classList.remove('visible');
                    setTimeout(() => {
                        lockScreen.classList.add('hidden');
                    }, 800);
                }

                speakAloud("System unlocked. Welcome back Operator.");

                const statusIndicator = document.getElementById('status-text');
                if (statusIndicator) {
                    const engineNames = {
                        'naz-core': 'NAZ-CORE v1.0',
                        'quantum-x': 'QUANTUM-X v2.4',
                        'phantom': 'PHANTOM v0.9',
                        'nebula': 'NEBULA v3.1'
                    };
                    const selectedEngine = localStorage.getItem('naz-engine') || 'naz-core';
                    statusIndicator.textContent = engineNames[selectedEngine] || 'NAZ-CORE v1.0';
                }
            } else {
                if (lockPasswordWrapper) {
                    lockPasswordWrapper.classList.add('macos-shake');
                    setTimeout(() => {
                        lockPasswordWrapper.classList.remove('macos-shake');
                    }, 400);
                }

                if (lockErrorMsg) {
                    lockErrorMsg.classList.remove('hidden');
                    setTimeout(() => {
                        lockErrorMsg.classList.add('hidden');
                    }, 3000);
                }

                lockPasswordInput.value = '';
                lockPasswordInput.focus();

                // Synth low frequency error chime
                try {
                    const audioCtx = getSharedAudioCtx();
                    if (audioCtx) {
                        const now = audioCtx.currentTime;
                        const osc = audioCtx.createOscillator();
                        const gain = audioCtx.createGain();
                        osc.type = 'sawtooth';
                        osc.frequency.setValueAtTime(100, now);
                        gain.gain.setValueAtTime(0.15, now);
                        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                        osc.connect(gain);
                        gain.connect(audioCtx.destination);
                        osc.start(now);
                        osc.stop(now + 0.35);
                    }
                } catch (err) {}
            }
        });
    }

    // Tab 1 preview trigger: Combat Arms Preview + hyper glitchy core
    if (funArmsPreviewTrigger) {
        funArmsPreviewTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isPreviewActive) return;

            previewTriggerSource = 'fun-zone';
            hideFunZone();

            // Setup preview variables
            isPreviewActive = true;
            previewFrame = 0;

            hand1Pos = { x: currentLayout.h1Start.x, y: currentLayout.h1Start.y };
            hand2Pos = { x: currentLayout.h2Start.x, y: currentLayout.h2Start.y };
            hand1Target = { x: currentLayout.h1Start.x, y: currentLayout.h1Start.y };
            hand2Target = { x: currentLayout.h2Start.x, y: currentLayout.h2Start.y };

            playWeaponReloadSound();

            // Glitch elements inside Combat Arms Tab in Fun Zone modal
            const funCore = document.getElementById('fun-core-element');
            const funCoreStatus = document.getElementById('fun-core-status');
            const funCoreCalib = document.getElementById('fun-core-calib');
            const funCoreShunt = document.getElementById('fun-core-shunt');

            if (funCore) funCore.classList.add('glitching');

            let glitchInterval = setInterval(() => {
                if (!isPreviewActive) {
                    clearInterval(glitchInterval);
                    if (funCore) funCore.classList.remove('glitching');
                    if (funCoreStatus) funCoreStatus.textContent = "STANDBY";
                    if (funCoreCalib) funCoreCalib.textContent = "100.0%";
                    if (funCoreShunt) funCoreShunt.textContent = "STABLE";
                    if (funCore) funCore.style.filter = '';
                    return;
                }

                if (funCoreStatus) {
                    const statuses = ["CALIBRATING", "INJECTING", "CHARGING", "OVERCLOCK", "TESTING JOINT"];
                    funCoreStatus.textContent = statuses[Math.floor(Math.random() * statuses.length)];
                }
                if (funCoreCalib) {
                    funCoreCalib.textContent = `${(Math.random() * 120 + 80).toFixed(1)}%`;
                }
                if (funCoreShunt) {
                    const shunts = ["STABLE", "VOLATILE", "FLUCTUATING", "CRITICAL", "DIVERGENT"];
                    funCoreShunt.textContent = shunts[Math.floor(Math.random() * shunts.length)];
                }

                if (funCore) {
                    const rHue = Math.floor(Math.random() * 360);
                    const rContrast = Math.floor(Math.random() * 150 + 100);
                    const rSaturate = Math.floor(Math.random() * 200 + 100);
                    funCore.style.filter = `hue-rotate(${rHue}deg) contrast(${rContrast}%) saturate(${rSaturate}%)`;
                }
            }, 80);
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
            const speedMultiplier = isBeastMode ? 4 : 1;
            this.x += this.speedX * speedMultiplier;
            this.y += this.speedY * speedMultiplier;
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
        } else if (style === 'nova') {
            for (let i = 0; i < 30; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 3.5 + 1.0;
                novaEmbers.push({
                    x: cx,
                    y: cy,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 1.2,
                    size: Math.random() * 4 + 2,
                    opacity: 1.0,
                    decay: Math.random() * 0.02 + 0.01
                });
            }
        } else if (style === 'cybergrid') {
            for (let i = 0; i < 12; i++) {
                cybergridPoints.push({
                    x: cx + (Math.random() - 0.5) * 80,
                    y: cy + (Math.random() - 0.5) * 80,
                    opacity: 1.0,
                    size: Math.random() * 6 + 3,
                    life: 1.0,
                    decay: Math.random() * 0.03 + 0.015
                });
            }
        }
    }

    // Apply cursor-dot style class for instant visual feedback
    function applyCursorDotStyle(style) {
        cursorDot.classList.remove('cursor-style-quantum', 'cursor-style-matrix', 'cursor-style-stardust', 'cursor-style-plasma', 'cursor-style-nova', 'cursor-style-cybergrid');
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
            novaEmbers = [];
            cybergridPoints = [];
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
        aiCoreEl.classList.remove('core-design-quantum', 'core-design-singularity', 'core-design-neural', 'core-design-eclipse', 'core-design-vortex');
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

    // ROBOTIC ARM Style Customization State
    let selectedArmStyle = localStorage.getItem('naz-arm-style') || 'cyber-link';
    const armStyleOpts = document.querySelectorAll('.arm-opt');
    
    function applyArmStyle(style) {
        selectedArmStyle = style;
        localStorage.setItem('naz-arm-style', style);
    }
    applyArmStyle(selectedArmStyle);
    
    armStyleOpts.forEach(btn => {
        if (btn.getAttribute('data-style') === selectedArmStyle) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
        btn.addEventListener('click', () => {
            selectedArmStyle = btn.getAttribute('data-style');
            localStorage.setItem('naz-arm-style', selectedArmStyle);

            // Synchronize active classes on all buttons across panels
            armStyleOpts.forEach(b => {
                if (b.getAttribute('data-style') === selectedArmStyle) {
                    b.classList.add('active');
                } else {
                    b.classList.remove('active');
                }
            });
            
            // Flash effect on core to confirm change
            if (aiCoreEl) {
                const currentTransition = aiCoreEl.style.transition;
                aiCoreEl.style.transition = 'none';
                aiCoreEl.style.transform = 'scale(1.15)';
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
            const audioCtx = getSharedAudioCtx();
            if (!audioCtx) return;
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
    let isPreviewActive = false;
    let previewFrame = 0;
    
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
    let novaEmbers = [];
    let cybergridPoints = [];
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

    // Drawing the robotic arm in three selectable styles: Cyber-Link, Nano-Swarm, or Mecha-Arm
    function drawRoboticArm(ctx, joints, primaryColor, secondaryColor, fingerAngle) {
        const sx = joints.shoulder.x;
        const sy = joints.shoulder.y;
        const ex = joints.elbow.x;
        const ey = joints.elbow.y;
        const wx = joints.wrist.x;
        const wy = joints.wrist.y;
        
        const time = Date.now() * 0.001;

        if (selectedArmStyle === 'nano-swarm') {
            // --- NANO-SWARM STYLE ---
            // An organic swirling cloud of glowing dust particles clustering to form the arm segments
            const drawSwarmSegment = (x1, y1, x2, y2, colorRGB) => {
                const dx = x2 - x1;
                const dy = y2 - y1;
                const len = Math.hypot(dx, dy);
                const angle = Math.atan2(dy, dx);
                const stepCount = Math.floor(len / 4);
                
                for (let i = 0; i <= stepCount; i++) {
                    const t = i / stepCount;
                    const bx = x1 + dx * t;
                    const by = y1 + dy * t;
                    
                    // Generate 4 swirling particles at each step
                    for (let j = 0; j < 4; j++) {
                        const spiralSpeed = 5;
                        const radius = 8 * Math.sin(t * Math.PI) + 4; // muscle taper
                        const theta = t * Math.PI * 6 + time * spiralSpeed + (j * Math.PI / 2);
                        const px = bx + Math.sin(theta) * radius + (Math.random() - 0.5) * 4;
                        const py = by + Math.cos(theta) * radius + (Math.random() - 0.5) * 4;
                        
                        ctx.beginPath();
                        ctx.arc(px, py, Math.random() * 1.5 + 0.6, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(${colorRGB}, ${0.4 + Math.sin(t * Math.PI) * 0.35})`;
                        ctx.fill();
                    }
                }
            };
            
            // Draw swarm segments
            drawSwarmSegment(sx, sy, ex, ey, primaryColor);
            drawSwarmSegment(ex, ey, wx, wy, primaryColor);
            
            // Joint particles clouds
            const drawSwarmJoint = (cx, cy, radius, colorRGB) => {
                for (let i = 0; i < 25; i++) {
                    const theta = Math.random() * Math.PI * 2;
                    const r = Math.random() * radius * 1.4;
                    const px = cx + Math.cos(theta) * r + Math.sin(time * 3 + i) * 3;
                    const py = cy + Math.sin(theta) * r + Math.cos(time * 3 + i) * 3;
                    
                    ctx.beginPath();
                    ctx.arc(px, py, Math.random() * 1.8 + 0.8, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${colorRGB}, ${Math.random() * 0.6 + 0.3})`;
                    ctx.fill();
                }
                // Bright center core
                ctx.beginPath();
                ctx.arc(cx, cy, 3, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
            };
            drawSwarmJoint(sx, sy, 14, secondaryColor);
            drawSwarmJoint(ex, ey, 11, secondaryColor);
            drawSwarmJoint(wx, wy, 8, secondaryColor);
            
            // Stardust finger streams wiggling outwards
            const wristAngle = Math.atan2(wy - ey, wx - ex);
            const fingerLength = 32;
            const tendrilOffsets = [-fingerAngle * 1.2, -fingerAngle * 0.4, fingerAngle * 0.4, fingerAngle * 1.2];
            
            tendrilOffsets.forEach(offset => {
                const angle = wristAngle + offset;
                const knuckleX = wx + Math.cos(angle) * (fingerLength * 0.55);
                const knuckleY = wy + Math.sin(angle) * (fingerLength * 0.55);
                
                const tipAngle = angle + (offset > 0 ? -0.25 : 0.25) * (1.2 - fingerAngle);
                const tipX = knuckleX + Math.cos(tipAngle) * (fingerLength * 0.5);
                const tipY = knuckleY + Math.sin(tipAngle) * (fingerLength * 0.5);
                
                // Draw swirling particle stream along knuckles and tips
                const drawSwarmCurve = (x1, y1, x2, y2) => {
                    const dx = x2 - x1;
                    const dy = y2 - y1;
                    const steps = 8;
                    for (let i = 0; i <= steps; i++) {
                        const t = i / steps;
                        const bx = x1 + dx * t;
                        const by = y1 + dy * t;
                        const wiggle = Math.sin(time * 8 + t * Math.PI) * 2;
                        
                        ctx.beginPath();
                        ctx.arc(bx + Math.cos(angle + Math.PI/2)*wiggle, by + Math.sin(angle + Math.PI/2)*wiggle, Math.random() * 1.6 + 0.8, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(${primaryColor}, ${1 - t * 0.5})`;
                        ctx.fill();
                    }
                };
                drawSwarmCurve(wx, wy, knuckleX, knuckleY);
                drawSwarmCurve(knuckleX, knuckleY, tipX, tipY);
                
                // Spark tip
                ctx.beginPath();
                ctx.arc(tipX, tipY, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = `rgb(${primaryColor})`;
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0;
            });
            
        } else if (selectedArmStyle === 'mecha-arm') {
            // --- MECHA-ARM STYLE ---
            // A heavy, solid industrial mechanical arm with armor plating and mechanical pins
            const drawMechaSegment = (x1, y1, x2, y2, colorRGB) => {
                const dx = x2 - x1;
                const dy = y2 - y1;
                const angle = Math.atan2(dy, dx);
                
                // 1. Dark gray inner chassis
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.strokeStyle = '#1e1e24';
                ctx.lineWidth = 26;
                ctx.lineCap = 'round';
                ctx.stroke();
                
                // 2. Main color armor plating (with gaps at joints for mechanical detail)
                const margin = 15;
                const len = Math.hypot(dx, dy);
                const p1x = x1 + Math.cos(angle) * margin;
                const p1y = y1 + Math.sin(angle) * margin;
                const p2x = x2 - Math.cos(angle) * margin;
                const p2y = y2 - Math.sin(angle) * margin;
                
                ctx.beginPath();
                ctx.moveTo(p1x, p1y);
                ctx.lineTo(p2x, p2y);
                ctx.strokeStyle = `rgb(${colorRGB})`;
                ctx.lineWidth = 14;
                ctx.lineCap = 'butt';
                ctx.stroke();
                
                // 3. Tech stripes (dark decals)
                ctx.beginPath();
                ctx.moveTo(p1x + (p2x - p1x) * 0.3, p1y + (p2y - p1y) * 0.3);
                ctx.lineTo(p1x + (p2x - p1x) * 0.7, p1y + (p2y - p1y) * 0.7);
                ctx.strokeStyle = '#0e0e12';
                ctx.lineWidth = 4;
                ctx.stroke();
                
                // 4. Highlight bevel wire
                ctx.beginPath();
                ctx.moveTo(p1x, p1y - 4);
                ctx.lineTo(p2x, p2y - 4);
                ctx.strokeStyle = 'rgba(255,255,255,0.45)';
                ctx.lineWidth = 1.2;
                ctx.stroke();
            };
            
            drawMechaSegment(sx, sy, ex, ey, primaryColor);
            drawMechaSegment(ex, ey, wx, wy, primaryColor);
            
            // Solid circular mechanical joint hubs
            const drawMechaJoint = (cx, cy, radius, colorRGB) => {
                // outer casing
                ctx.beginPath();
                ctx.arc(cx, cy, radius * 1.6, 0, Math.PI * 2);
                ctx.fillStyle = '#121218';
                ctx.strokeStyle = '#2d2d38';
                ctx.lineWidth = 2;
                ctx.fill();
                ctx.stroke();
                
                // inner core
                ctx.beginPath();
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgb(${colorRGB})`;
                ctx.fill();
                
                // rivet ring (concentric circles)
                ctx.beginPath();
                ctx.arc(cx, cy, radius * 0.6, 0, Math.PI * 2);
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 1.8;
                ctx.stroke();
                
                ctx.beginPath();
                ctx.arc(cx, cy, 2, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
            };
            
            drawMechaJoint(sx, sy, 14, secondaryColor);
            drawMechaJoint(ex, ey, 10, secondaryColor);
            drawMechaJoint(wx, wy, 8, secondaryColor);
            
            // Thick mecha fingers
            const wristAngle = Math.atan2(wy - ey, wx - ex);
            const fingerLength = 32;
            const tendrilOffsets = [-fingerAngle * 1.2, -fingerAngle * 0.4, fingerAngle * 0.4, fingerAngle * 1.2];
            
            tendrilOffsets.forEach(offset => {
                const angle = wristAngle + offset;
                const knuckleX = wx + Math.cos(angle) * (fingerLength * 0.6);
                const knuckleY = wy + Math.sin(angle) * (fingerLength * 0.6);
                
                const tipAngle = angle + (offset > 0 ? -0.3 : 0.3) * (1.2 - fingerAngle);
                const tipX = knuckleX + Math.cos(tipAngle) * (fingerLength * 0.55);
                const tipY = knuckleY + Math.sin(tipAngle) * (fingerLength * 0.55);
                
                // Draw thick joint 1
                ctx.beginPath();
                ctx.moveTo(wx, wy);
                ctx.lineTo(knuckleX, knuckleY);
                ctx.strokeStyle = '#1e1e24';
                ctx.lineWidth = 7;
                ctx.lineCap = 'round';
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(wx, wy);
                ctx.lineTo(knuckleX, knuckleY);
                ctx.strokeStyle = `rgb(${primaryColor})`;
                ctx.lineWidth = 4;
                ctx.lineCap = 'round';
                ctx.stroke();
                
                // Draw thick joint 2
                ctx.beginPath();
                ctx.moveTo(knuckleX, knuckleY);
                ctx.lineTo(tipX, tipY);
                ctx.strokeStyle = '#0f0f12';
                ctx.lineWidth = 5;
                ctx.lineCap = 'round';
                ctx.stroke();
                
                ctx.beginPath();
                ctx.moveTo(knuckleX, knuckleY);
                ctx.lineTo(tipX, tipY);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2.5;
                ctx.lineCap = 'round';
                ctx.stroke();
                
                // Knuckle pin
                ctx.beginPath();
                ctx.arc(knuckleX, knuckleY, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgb(${secondaryColor})`;
                ctx.fill();
                
                // Claw tip pin
                ctx.beginPath();
                ctx.arc(tipX, tipY, 3, 0, Math.PI * 2);
                ctx.fillStyle = `rgb(${primaryColor})`;
                ctx.fill();
            });
            
        } else if (selectedArmStyle === 'plasma-whip') {
            // --- PLASMA-WHIP STYLE ---
            const drawPlasmaSegment = (x1, y1, x2, y2, colorRGB) => {
                const dx = x2 - x1;
                const dy = y2 - y1;
                const len = Math.hypot(dx, dy);
                const angle = Math.atan2(dy, dx);
                
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.strokeStyle = `rgba(${colorRGB}, 0.25)`;
                ctx.lineWidth = 26;
                ctx.lineCap = 'round';
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                const steps = 15;
                for (let i = 0; i <= steps; i++) {
                    const t = i / steps;
                    const bx = x1 + dx * t;
                    const by = y1 + dy * t;
                    const perpX = -Math.sin(angle);
                    const perpY = Math.cos(angle);
                    const shift = Math.sin(time * 12 + t * Math.PI * 4) * 5;
                    ctx.lineTo(bx + perpX * shift, by + perpY * shift);
                }
                ctx.strokeStyle = `rgba(${colorRGB}, 0.85)`;
                ctx.lineWidth = 6;
                ctx.lineCap = 'round';
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                for (let i = 0; i <= steps; i++) {
                    const t = i / steps;
                    const bx = x1 + dx * t;
                    const by = y1 + dy * t;
                    const perpX = -Math.sin(angle);
                    const perpY = Math.cos(angle);
                    const shift = Math.sin(time * 12 + t * Math.PI * 4) * 5;
                    ctx.lineTo(bx + perpX * shift, by + perpY * shift);
                }
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.stroke();
            };

            drawPlasmaSegment(sx, sy, ex, ey, primaryColor);
            drawPlasmaSegment(ex, ey, wx, wy, primaryColor);

            const drawPlasmaJoint = (cx, cy, radius, colorRGB) => {
                ctx.beginPath();
                ctx.arc(cx, cy, radius * 1.5, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${colorRGB}, 0.3)`;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(cx, cy, radius * 0.7, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.fill();

                for (let i = 0; i < 3; i++) {
                    const ra = Math.random() * Math.PI * 2;
                    const rx = cx + Math.cos(ra) * radius * 1.8;
                    const ry = cy + Math.sin(ra) * radius * 1.8;
                    ctx.beginPath();
                    ctx.moveTo(cx, cy);
                    ctx.lineTo(rx, ry);
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                }
            };
            drawPlasmaJoint(sx, sy, 13, secondaryColor);
            drawPlasmaJoint(ex, ey, 10, secondaryColor);
            drawPlasmaJoint(wx, wy, 8, secondaryColor);

            const wristAngle = Math.atan2(wy - ey, wx - ex);
            const fingerLength = 32;
            const tendrilOffsets = [-fingerAngle * 1.2, -fingerAngle * 0.4, fingerAngle * 0.4, fingerAngle * 1.2];
            tendrilOffsets.forEach(offset => {
                const angle = wristAngle + offset;
                const knuckleX = wx + Math.cos(angle) * (fingerLength * 0.55);
                const knuckleY = wy + Math.sin(angle) * (fingerLength * 0.55);
                
                const tipAngle = angle + (offset > 0 ? -0.22 : 0.22) * (1.2 - fingerAngle);
                const tipX = knuckleX + Math.cos(tipAngle) * (fingerLength * 0.5);
                const tipY = knuckleY + Math.sin(tipAngle) * (fingerLength * 0.5);

                const drawWhipFinger = (x1, y1, x2, y2) => {
                    const dx = x2 - x1;
                    const dy = y2 - y1;
                    const Steps = 6;
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    for (let i = 0; i <= Steps; i++) {
                        const t = i / Steps;
                        const bx = x1 + dx * t;
                        const by = y1 + dy * t;
                        const w = Math.sin(time * 15 + t * Math.PI) * 3;
                        ctx.lineTo(bx + Math.cos(angle + Math.PI/2)*w, by + Math.sin(angle + Math.PI/2)*w);
                    }
                    ctx.strokeStyle = `rgb(${primaryColor})`;
                    ctx.lineWidth = 3.5;
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    for (let i = 0; i <= Steps; i++) {
                        const t = i / Steps;
                        const bx = x1 + dx * t;
                        const by = y1 + dy * t;
                        const w = Math.sin(time * 15 + t * Math.PI) * 3;
                        ctx.lineTo(bx + Math.cos(angle + Math.PI/2)*w, by + Math.sin(angle + Math.PI/2)*w);
                    }
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                };
                drawWhipFinger(wx, wy, knuckleX, knuckleY);
                drawWhipFinger(knuckleX, knuckleY, tipX, tipY);
            });

        } else if (selectedArmStyle === 'matrix-sentinel') {
            // --- MATRIX SENTINEL SPINE STYLE ---
            const drawSentinelSegment = (x1, y1, x2, y2) => {
                const dx = x2 - x1;
                const dy = y2 - y1;
                const len = Math.hypot(dx, dy);
                const angle = Math.atan2(dy, dx);
                const podCount = Math.floor(len / 18);

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.strokeStyle = '#050505';
                ctx.lineWidth = 8;
                ctx.stroke();

                for (let i = 0; i <= podCount; i++) {
                    const t = i / podCount;
                    const px = x1 + dx * t;
                    const py = y1 + dy * t;

                    ctx.save();
                    ctx.translate(px, py);
                    ctx.rotate(angle);
                    
                    ctx.beginPath();
                    ctx.ellipse(0, 0, 10, 8, 0, 0, Math.PI * 2);
                    ctx.fillStyle = '#1c1c20';
                    ctx.strokeStyle = '#2d2d35';
                    ctx.lineWidth = 1.5;
                    ctx.fill();
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
                    ctx.fillStyle = '#ff003c';
                    ctx.fill();
                    
                    ctx.beginPath();
                    ctx.arc(-1, -1, 1, 0, Math.PI * 2);
                    ctx.fillStyle = '#ffffff';
                    ctx.fill();

                    ctx.restore();
                }
            };

            drawSentinelSegment(sx, sy, ex, ey);
            drawSentinelSegment(ex, ey, wx, wy);

            const drawSentinelJoint = (cx, cy, radius) => {
                ctx.beginPath();
                ctx.arc(cx, cy, radius * 1.5, 0, Math.PI * 2);
                ctx.fillStyle = '#111115';
                ctx.strokeStyle = '#ff003c';
                ctx.lineWidth = 1.2;
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(cx, cy, radius * 0.6, 0, Math.PI * 2);
                ctx.fillStyle = '#000000';
                ctx.fill();

                for (let i = 0; i < 4; i++) {
                    const a = time * 3 + (i * Math.PI / 2);
                    const lx = cx + Math.cos(a) * (radius * 0.9);
                    const ly = cy + Math.sin(a) * (radius * 0.9);
                    ctx.beginPath();
                    ctx.arc(lx, ly, 2, 0, Math.PI * 2);
                    ctx.fillStyle = '#ff003c';
                    ctx.fill();
                }
            };
            drawSentinelJoint(sx, sy, 14);
            drawSentinelJoint(ex, ey, 10);
            drawSentinelJoint(wx, wy, 8);

            const wristAngle = Math.atan2(wy - ey, wx - ex);
            const fingerLength = 32;
            const tendrilOffsets = [-fingerAngle * 1.2, -fingerAngle * 0.4, fingerAngle * 0.4, fingerAngle * 1.2];
            tendrilOffsets.forEach(offset => {
                const angle = wristAngle + offset;
                const knuckleX = wx + Math.cos(angle) * (fingerLength * 0.55);
                const knuckleY = wy + Math.sin(angle) * (fingerLength * 0.55);
                
                const tipAngle = angle + (offset > 0 ? -0.22 : 0.22) * (1.2 - fingerAngle);
                const tipX = knuckleX + Math.cos(tipAngle) * (fingerLength * 0.5);
                const tipY = knuckleY + Math.sin(tipAngle) * (fingerLength * 0.5);

                ctx.beginPath();
                ctx.moveTo(wx, wy);
                ctx.lineTo(knuckleX, knuckleY);
                ctx.lineTo(tipX, tipY);
                ctx.strokeStyle = '#18181c';
                ctx.lineWidth = 4.5;
                ctx.lineCap = 'round';
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(tipX, tipY, 3.5, 0, Math.PI * 2);
                ctx.fillStyle = '#ff003c';
                ctx.fill();
            });

        } else if (selectedArmStyle === 'chrono-gear') {
            // --- CHRONO-GEAR STYLE ---
            const drawGearSegment = (x1, y1, x2, y2) => {
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.strokeStyle = '#b8860b';
                ctx.lineWidth = 14;
                ctx.lineCap = 'round';
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.strokeStyle = '#ffd700';
                ctx.lineWidth = 7;
                ctx.lineCap = 'round';
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(x1, y1 - 2);
                ctx.lineTo(x2, y2 - 2);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1.5;
                ctx.stroke();
            };

            drawGearSegment(sx, sy, ex, ey);
            drawGearSegment(ex, ey, wx, wy);

            const drawGearJoint = (cx, cy, radius, speedMultiplier) => {
                const teethCount = 8;
                const rotation = time * 2.5 * speedMultiplier;

                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(rotation);

                ctx.beginPath();
                ctx.arc(0, 0, radius * 1.3, 0, Math.PI * 2);
                ctx.fillStyle = '#cd7f32';
                ctx.strokeStyle = '#8b5a2b';
                ctx.lineWidth = 2;
                ctx.fill();
                ctx.stroke();

                for (let i = 0; i < teethCount; i++) {
                    const angle = (i * Math.PI * 2) / teethCount;
                    ctx.save();
                    ctx.rotate(angle);
                    ctx.fillStyle = '#b8860b';
                    ctx.fillRect(-3, -radius * 1.7, 6, radius * 0.7);
                    ctx.restore();
                }

                ctx.beginPath();
                ctx.arc(0, 0, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.fill();

                ctx.restore();
            };

            drawGearJoint(sx, sy, 12, 1);
            drawGearJoint(ex, ey, 9, -1.3);
            drawGearJoint(wx, wy, 7, 1.8);

            const wristAngle = Math.atan2(wy - ey, wx - ex);
            const fingerLength = 32;
            const tendrilOffsets = [-fingerAngle * 1.2, -fingerAngle * 0.4, fingerAngle * 0.4, fingerAngle * 1.2];
            tendrilOffsets.forEach(offset => {
                const angle = wristAngle + offset;
                const knuckleX = wx + Math.cos(angle) * (fingerLength * 0.55);
                const knuckleY = wy + Math.sin(angle) * (fingerLength * 0.55);
                
                const tipAngle = angle + (offset > 0 ? -0.22 : 0.22) * (1.2 - fingerAngle);
                const tipX = knuckleX + Math.cos(tipAngle) * (fingerLength * 0.5);
                const tipY = knuckleY + Math.sin(tipAngle) * (fingerLength * 0.5);

                ctx.beginPath();
                ctx.moveTo(wx, wy);
                ctx.lineTo(knuckleX, knuckleY);
                ctx.lineTo(tipX, tipY);
                ctx.strokeStyle = '#b8860b';
                ctx.lineWidth = 4;
                ctx.lineCap = 'round';
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(wx, wy);
                ctx.lineTo(knuckleX, knuckleY);
                ctx.lineTo(tipX, tipY);
                ctx.strokeStyle = '#ffd700';
                ctx.lineWidth = 1.8;
                ctx.lineCap = 'round';
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(tipX, tipY, 3, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.fill();
            });

        } else {
            // --- CYBER-LINK STYLE (DEFAULT) ---
            // Sleek glowing cybernetic energy beam segments
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
            } else if (selectedCursorStyle === 'nova') {
                for (let i = 0; i < 2; i++) {
                    novaEmbers.push({
                        x: dotPos.x + (Math.random() - 0.5) * 8,
                        y: dotPos.y + (Math.random() - 0.5) * 8,
                        vx: (Math.random() - 0.5) * 1.0,
                        vy: (Math.random() - 0.5) * 1.0 - 1.6, // upward drift
                        size: Math.random() * 3 + 1.5,
                        opacity: 1.0,
                        decay: Math.random() * 0.02 + 0.012
                    });
                }
            } else if (selectedCursorStyle === 'cybergrid') {
                cybergridPoints.push({
                    x: dotPos.x,
                    y: dotPos.y,
                    life: 1.0,
                    decay: 0.04
                });
                if (cybergridPoints.length > 25) cybergridPoints.shift();
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
        // 5. NOVA EMBERS
        else if (selectedCursorStyle === 'nova') {
            novaEmbers = novaEmbers.filter(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.opacity -= p.decay;
                if (p.opacity <= 0) return false;
                
                const fireRed = 255;
                const fireGreen = Math.round(110 + p.opacity * 110);
                const fireBlue = Math.round(10 + p.opacity * 50);
                
                trailCtx.shadowColor = `rgba(${fireRed}, ${fireGreen}, ${fireBlue}, ${p.opacity})`;
                trailCtx.shadowBlur = 10;
                
                trailCtx.beginPath();
                trailCtx.arc(p.x, p.y, p.size * p.opacity, 0, Math.PI * 2);
                trailCtx.fillStyle = `rgba(${fireRed}, ${fireGreen}, ${fireBlue}, ${p.opacity})`;
                trailCtx.fill();
                
                return true;
            });
            trailCtx.shadowBlur = 0;
        }
        // 6. CYBER-GRID HUD
        else if (selectedCursorStyle === 'cybergrid') {
            cybergridPoints = cybergridPoints.filter(p => {
                p.life -= p.decay;
                return p.life > 0;
            });
            
            if (cybergridPoints.length > 1) {
                trailCtx.beginPath();
                trailCtx.strokeStyle = `rgba(${cyanRGB[0]}, ${cyanRGB[1]}, ${cyanRGB[2]}, 0.35)`;
                trailCtx.lineWidth = 1.5;
                trailCtx.moveTo(cybergridPoints[0].x, cybergridPoints[0].y);
                for (let i = 1; i < cybergridPoints.length; i++) {
                    trailCtx.lineTo(cybergridPoints[i].x, cybergridPoints[i].y);
                }
                trailCtx.stroke();
                
                const head = cybergridPoints[cybergridPoints.length - 1];
                
                trailCtx.strokeStyle = `rgba(${purpleRGB[0]}, ${purpleRGB[1]}, ${purpleRGB[2]}, 0.12)`;
                trailCtx.lineWidth = 1;
                trailCtx.beginPath();
                trailCtx.moveTo(0, head.y);
                trailCtx.lineTo(window.innerWidth, head.y);
                trailCtx.stroke();
                trailCtx.beginPath();
                trailCtx.moveTo(head.x, 0);
                trailCtx.lineTo(head.x, window.innerHeight);
                trailCtx.stroke();
                
                trailCtx.shadowColor = `rgba(${cyanRGB[0]}, ${cyanRGB[1]}, ${cyanRGB[2]}, 0.8)`;
                trailCtx.shadowBlur = 8;
                trailCtx.strokeStyle = `rgba(${cyanRGB[0]}, ${cyanRGB[1]}, ${cyanRGB[2]}, 0.7)`;
                
                const boxSize = 14;
                trailCtx.strokeRect(head.x - boxSize, head.y - boxSize, boxSize * 2, boxSize * 2);
                
                const rotation = (Date.now() * 0.003) % (Math.PI * 2);
                trailCtx.beginPath();
                trailCtx.arc(head.x, head.y, 6, rotation, rotation + 0.5 * Math.PI);
                trailCtx.stroke();
                trailCtx.beginPath();
                trailCtx.arc(head.x, head.y, 6, rotation + Math.PI, rotation + 1.5 * Math.PI);
                trailCtx.stroke();
                
                cybergridPoints.forEach(pt => {
                    trailCtx.fillStyle = `rgba(${cyanRGB[0]}, ${cyanRGB[1]}, ${cyanRGB[2]}, ${pt.life})`;
                    trailCtx.fillRect(pt.x - 2, pt.y - 2, 4, 4);
                });
            }
            trailCtx.shadowBlur = 0;
        }

        // --- BACKGROUND ROBOT HANDS GAME ANIMATION LOOP ---
        if (isPreviewActive) {
            // INCREMENT PREVIEW FRAME
            previewFrame++;

            let coreCenterX = window.innerWidth / 2;
            let coreCenterY = window.innerHeight / 2;
            const coreEl = document.getElementById('ai-core');
            if (coreEl) {
                const rect = coreEl.getBoundingClientRect();
                coreCenterX = rect.left + rect.width / 2;
                coreCenterY = rect.top + rect.height / 2;
            }

            if (previewFrame < 40) {
                // Phase 1: Snappy Tactical Deploy
                hand1Target.x = coreCenterX - 180;
                hand1Target.y = coreCenterY + 40;
                hand2Target.x = coreCenterX + 180;
                hand2Target.y = coreCenterY + 40;

                hand1FingerAngle = 0.55;
                hand2FingerAngle = 0.55;

                hand1Pos.x += (hand1Target.x - hand1Pos.x) * 0.20;
                hand1Pos.y += (hand1Target.y - hand1Pos.y) * 0.20;
                hand2Pos.x += (hand2Target.x - hand2Pos.x) * 0.20;
                hand2Pos.y += (hand2Target.y - hand2Pos.y) * 0.20;
            } else if (previewFrame < 130) {
                // Phase 2: Action sequence depending on styling (Tactical Speed)
                if (selectedArmStyle === 'nano-swarm') {
                    // --- NANO-SWARM DISINTEGRATION ---
                    hand1Target.x = coreCenterX - 140;
                    hand1Target.y = coreCenterY;
                    hand2Target.x = coreCenterX + 140;
                    hand2Target.y = coreCenterY;

                    hand1FingerAngle = 0.5;
                    hand2FingerAngle = 0.5;

                    hand1Pos.x += (hand1Target.x - hand1Pos.x) * 0.12;
                    hand1Pos.y += (hand1Target.y - hand1Pos.y) * 0.12;
                    hand2Pos.x += (hand2Target.x - hand2Pos.x) * 0.12;
                    hand2Pos.y += (hand2Target.y - hand2Pos.y) * 0.12;

                    if (previewFrame === 40) {
                        playLaserSound(2.0); // digital hum
                    }

                    // Swirling particle lines going to core
                    for (let j = 0; j < 3; j++) {
                        const t = Math.random();
                        const p1x = hand1Pos.x + (coreCenterX - hand1Pos.x) * t + (Math.random() - 0.5) * 12;
                        const p1y = hand1Pos.y + (coreCenterY - hand1Pos.y) * t + (Math.random() - 0.5) * 12;
                        
                        trailCtx.beginPath();
                        trailCtx.arc(p1x, p1y, Math.random() * 2 + 1, 0, Math.PI * 2);
                        trailCtx.fillStyle = `rgba(${themeCyan}, 0.75)`;
                        trailCtx.fill();

                        const p2x = hand2Pos.x + (coreCenterX - hand2Pos.x) * t + (Math.random() - 0.5) * 12;
                        const p2y = hand2Pos.y + (coreCenterY - hand2Pos.y) * t + (Math.random() - 0.5) * 12;
                        
                        trailCtx.beginPath();
                        trailCtx.arc(p2x, p2y, Math.random() * 2 + 1, 0, Math.PI * 2);
                        trailCtx.fillStyle = `rgba(${themePurple}, 0.75)`;
                        trailCtx.fill();
                    }

                    if (previewFrame % 3 === 0) {
                        createExplosion(coreCenterX + (Math.random() - 0.5) * 16, coreCenterY + (Math.random() - 0.5) * 16, Math.random() > 0.5 ? themeCyan : themePurple);
                    }

                } else if (selectedArmStyle === 'mecha-arm') {
                    // --- MECHA INDUSTRIAL PUNCHING (Rapid Jackhammer) ---
                    const cycle = (previewFrame - 40) % 20;
                    if (cycle < 7) {
                        hand1Target.x = coreCenterX - 60;
                        hand1Target.y = coreCenterY;
                        hand2Target.x = coreCenterX + 170;
                        hand2Target.y = coreCenterY + 50;
                    } else if (cycle < 14) {
                        hand1Target.x = coreCenterX - 170;
                        hand1Target.y = coreCenterY + 50;
                        hand2Target.x = coreCenterX + 60;
                        hand2Target.y = coreCenterY;
                    } else {
                        hand1Target.x = coreCenterX - 140;
                        hand1Target.y = coreCenterY + 20;
                        hand2Target.x = coreCenterX + 140;
                        hand2Target.y = coreCenterY + 20;
                    }

                    hand1FingerAngle = 0.1;
                    hand2FingerAngle = 0.1;

                    hand1Pos.x += (hand1Target.x - hand1Pos.x) * 0.35;
                    hand1Pos.y += (hand1Target.y - hand1Pos.y) * 0.35;
                    hand2Pos.x += (hand2Target.x - hand2Pos.x) * 0.35;
                    hand2Pos.y += (hand2Target.y - hand2Pos.y) * 0.35;

                    if (cycle === 0 || cycle === 10) {
                        playMechaPunchSound();
                        createExplosion(coreCenterX + (cycle === 0 ? -60 : 60), coreCenterY, '255, 255, 255');
                    }

                } else if (selectedArmStyle === 'plasma-whip') {
                    // --- PLASMA WHIP ELECTRICAL ARC DISCHARGE ---
                    hand1Target.x = coreCenterX - 150;
                    hand1Target.y = coreCenterY;
                    hand2Target.x = coreCenterX + 150;
                    hand2Target.y = coreCenterY;

                    hand1FingerAngle = 0.5;
                    hand2FingerAngle = 0.5;

                    hand1Pos.x += (hand1Target.x - hand1Pos.x) * 0.12;
                    hand1Pos.y += (hand1Target.y - hand1Pos.y) * 0.12;
                    hand2Pos.x += (hand2Target.x - hand2Pos.x) * 0.12;
                    hand2Pos.y += (hand2Target.y - hand2Pos.y) * 0.12;

                    if (previewFrame === 40) {
                        playLaserSound(2.0);
                    }

                    // Draw 3-4 crackling lightning paths
                    trailCtx.save();
                    trailCtx.strokeStyle = '#ffffff';
                    trailCtx.shadowBlur = 10;
                    trailCtx.shadowColor = `rgba(${themeCyan}, 0.9)`;
                    trailCtx.lineWidth = 1.8;

                    for (let j = 0; j < 2; j++) {
                        trailCtx.beginPath();
                        trailCtx.moveTo(hand1Pos.x, hand1Pos.y);
                        const steps = 6;
                        for (let i = 1; i <= steps; i++) {
                            const t = i / steps;
                            const tx = hand1Pos.x + (coreCenterX - hand1Pos.x) * t + (Math.random() - 0.5) * 20;
                            const ty = hand1Pos.y + (coreCenterY - hand1Pos.y) * t + (Math.random() - 0.5) * 20;
                            trailCtx.lineTo(tx, ty);
                        }
                        trailCtx.stroke();
                    }
                    trailCtx.shadowColor = `rgba(${themePurple}, 0.9)`;
                    for (let j = 0; j < 2; j++) {
                        trailCtx.beginPath();
                        trailCtx.moveTo(hand2Pos.x, hand2Pos.y);
                        const steps = 6;
                        for (let i = 1; i <= steps; i++) {
                            const t = i / steps;
                            const tx = hand2Pos.x + (coreCenterX - hand2Pos.x) * t + (Math.random() - 0.5) * 20;
                            const ty = hand2Pos.y + (coreCenterY - hand2Pos.y) * t + (Math.random() - 0.5) * 20;
                            trailCtx.lineTo(tx, ty);
                        }
                        trailCtx.stroke();
                    }
                    trailCtx.restore();

                    if (previewFrame % 3 === 0) {
                        createExplosion(coreCenterX + (Math.random() - 0.5) * 16, coreCenterY + (Math.random() - 0.5) * 16, Math.random() > 0.5 ? themeCyan : themePurple);
                    }

                } else if (selectedArmStyle === 'matrix-sentinel') {
                    // --- MATRIX SPINE BINARY INJECTION ---
                    hand1Target.x = coreCenterX - 140;
                    hand1Target.y = coreCenterY;
                    hand2Target.x = coreCenterX + 140;
                    hand2Target.y = coreCenterY;

                    hand1FingerAngle = 0.2;
                    hand2FingerAngle = 0.2;

                    hand1Pos.x += (hand1Target.x - hand1Pos.x) * 0.12;
                    hand1Pos.y += (hand1Target.y - hand1Pos.y) * 0.12;
                    hand2Pos.x += (hand2Target.x - hand2Pos.x) * 0.12;
                    hand2Pos.y += (hand2Target.y - hand2Pos.y) * 0.12;

                    if (previewFrame === 40) {
                        playLaserSound(2.0);
                    }

                    // Feed binary text particles
                    if (previewFrame % 3 === 0) {
                        matrixChars.push({
                            x: hand1Pos.x + (coreCenterX - hand1Pos.x) * Math.random(),
                            y: hand1Pos.y + (coreCenterY - hand1Pos.y) * Math.random() + (Math.random() - 0.5) * 15,
                            char: Math.random() > 0.5 ? '1' : '0',
                            opacity: 1.0,
                            size: Math.random() * 4 + 10,
                            vy: Math.random() * 2 + 1
                        });
                        matrixChars.push({
                            x: hand2Pos.x + (coreCenterX - hand2Pos.x) * Math.random(),
                            y: hand2Pos.y + (coreCenterY - hand2Pos.y) * Math.random() + (Math.random() - 0.5) * 15,
                            char: Math.random() > 0.5 ? '1' : '0',
                            opacity: 1.0,
                            size: Math.random() * 4 + 10,
                            vy: Math.random() * 2 + 1
                        });
                    }

                    if (previewFrame % 3 === 0) {
                        createExplosion(coreCenterX + (Math.random() - 0.5) * 16, coreCenterY + (Math.random() - 0.5) * 16, '0, 255, 70');
                    }

                } else if (selectedArmStyle === 'chrono-gear') {
                    // --- CHRONO GEAR STEAM RELEASE ---
                    const torque = Math.sin(previewFrame * 0.8) * 20;
                    hand1Target.x = coreCenterX - 140 + torque;
                    hand1Target.y = coreCenterY - torque;
                    hand2Target.x = coreCenterX + 140 - torque;
                    hand2Target.y = coreCenterY + torque;

                    hand1FingerAngle = 0.5;
                    hand2FingerAngle = 0.5;

                    hand1Pos.x += (hand1Target.x - hand1Pos.x) * 0.12;
                    hand1Pos.y += (hand1Target.y - hand1Pos.y) * 0.12;
                    hand2Pos.x += (hand2Target.x - hand2Pos.x) * 0.12;
                    hand2Pos.y += (hand2Target.y - hand2Pos.y) * 0.12;

                    if (previewFrame % 5 === 0) {
                        playGearTickSound(); // mechanical tick
                    }

                    // Steam puff particles
                    if (previewFrame % 6 === 0) {
                        for (let i = 0; i < 4; i++) {
                            sparks.push({
                                x: hand1Pos.x + (Math.random() - 0.5) * 15,
                                  y: hand1Pos.y + (Math.random() - 0.5) * 15,
                                vx: (Math.random() - 0.5) * 2.5,
                                vy: -Math.random() * 2.5 - 1.5, // float up
                                color: '220, 220, 225',
                                opacity: 0.65,
                                size: Math.random() * 10 + 4
                            });
                            sparks.push({
                                x: hand2Pos.x + (Math.random() - 0.5) * 15,
                                y: hand2Pos.y + (Math.random() - 0.5) * 15,
                                vx: (Math.random() - 0.5) * 2.5,
                                vy: -Math.random() * 2.5 - 1.5, // float up
                                color: '220, 220, 225',
                                opacity: 0.65,
                                size: Math.random() * 10 + 4
                            });
                        }
                    }

                    if (previewFrame % 4 === 0) {
                        createExplosion(coreCenterX + (Math.random() - 0.5) * 16, coreCenterY + (Math.random() - 0.5) * 16, '218, 165, 32');
                    }

                } else {
                    // --- CYBER-LINK (DEFAULT) NEON LASERS ---
                    hand1Target.x = coreCenterX - 140;
                    hand1Target.y = coreCenterY;
                    hand2Target.x = coreCenterX + 140;
                    hand2Target.y = coreCenterY;

                    hand1FingerAngle = 0.15;
                    hand2FingerAngle = 0.15;

                    hand1Pos.x += (hand1Target.x - hand1Pos.x) * 0.12;
                    hand1Pos.y += (hand1Target.y - hand1Pos.y) * 0.12;
                    hand2Pos.x += (hand2Target.x - hand2Pos.x) * 0.12;
                    hand2Pos.y += (hand2Target.y - hand2Pos.y) * 0.12;

                    if (previewFrame === 40) {
                        playLaserSound(2.0);
                    }

                    // Draw neon lasers
                    trailCtx.save();
                    trailCtx.shadowBlur = 15;
                    
                    trailCtx.shadowColor = `rgba(${themeCyan}, 0.85)`;
                    trailCtx.strokeStyle = `rgba(${themeCyan}, ${0.65 + Math.random() * 0.35})`;
                    trailCtx.lineWidth = 3.5 + Math.random() * 2.5;
                    trailCtx.beginPath();
                    trailCtx.moveTo(hand1Pos.x, hand1Pos.y);
                    trailCtx.lineTo(coreCenterX + (Math.random() - 0.5) * 8, coreCenterY + (Math.random() - 0.5) * 8);
                    trailCtx.stroke();

                    trailCtx.shadowColor = `rgba(${themePurple}, 0.85)`;
                    trailCtx.strokeStyle = `rgba(${themePurple}, ${0.65 + Math.random() * 0.35})`;
                    trailCtx.lineWidth = 3.5 + Math.random() * 2.5;
                    trailCtx.beginPath();
                    trailCtx.moveTo(hand2Pos.x, hand2Pos.y);
                    trailCtx.lineTo(coreCenterX + (Math.random() - 0.5) * 8, coreCenterY + (Math.random() - 0.5) * 8);
                    trailCtx.stroke();
                    
                    trailCtx.restore();

                    // Sparks near core center
                    if (previewFrame % 3 === 0) {
                        createExplosion(coreCenterX + (Math.random() - 0.5) * 16, coreCenterY + (Math.random() - 0.5) * 16, Math.random() > 0.5 ? themeCyan : themePurple);
                    }
                }
            } else if (previewFrame < 190) {
                // Phase 3: Energy Orbit (High-speed charging)
                const radius = 135;
                const angle = (previewFrame - 130) * 0.12;
                const orbX = coreCenterX + Math.cos(angle) * radius;
                const orbY = coreCenterY + Math.sin(angle) * radius;

                // Draw orbiting energy orb
                trailCtx.save();
                trailCtx.shadowBlur = 25;
                trailCtx.shadowColor = `rgba(${themeCyan}, 0.85)`;
                trailCtx.beginPath();
                let orbGrad = trailCtx.createRadialGradient(orbX, orbY, 0, orbX, orbY, 35);
                orbGrad.addColorStop(0, '#ffffff');
                orbGrad.addColorStop(0.3, `rgba(${themeCyan}, 0.9)`);
                orbGrad.addColorStop(0.7, `rgba(${themePurple}, 0.45)`);
                orbGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                trailCtx.fillStyle = orbGrad;
                trailCtx.arc(orbX, orbY, 35, 0, Math.PI * 2);
                trailCtx.fill();
                trailCtx.restore();

                // Target positions: track orb
                hand1Target.x = orbX;
                hand1Target.y = orbY;

                const oppX = coreCenterX - Math.cos(angle) * radius;
                const oppY = coreCenterY - Math.sin(angle) * radius;
                hand2Target.x = oppX;
                hand2Target.y = oppY;

                hand1FingerAngle = 0.5;
                hand2FingerAngle = 0.5;

                hand1Pos.x += (hand1Target.x - hand1Pos.x) * 0.22;
                hand1Pos.y += (hand1Target.y - hand1Pos.y) * 0.22;
                hand2Pos.x += (hand2Target.x - hand2Pos.x) * 0.22;
                hand2Pos.y += (hand2Target.y - hand2Pos.y) * 0.22;
            } else if (previewFrame < 220) {
                // Phase 4: High-speed cross-intercept clash
                hand1Target.x = coreCenterX + 90;
                hand1Target.y = coreCenterY;
                hand2Target.x = coreCenterX - 90;
                hand2Target.y = coreCenterY;

                hand1FingerAngle = 0.15;
                hand2FingerAngle = 0.15;

                hand1Pos.x += (hand1Target.x - hand1Pos.x) * 0.35;
                hand1Pos.y += (hand1Target.y - hand1Pos.y) * 0.35;
                hand2Pos.x += (hand2Target.x - hand2Pos.x) * 0.35;
                hand2Pos.y += (hand2Target.y - hand2Pos.y) * 0.35;

                if (previewFrame === 190) {
                    playDestructionSound();
                    createExplosion(coreCenterX, coreCenterY, themeCyan);
                    createExplosion(coreCenterX, coreCenterY, themePurple);
                    createExplosion(coreCenterX, coreCenterY, '255, 255, 255');
                    createExplosion(coreCenterX - 50, coreCenterY, themeCyan);
                    createExplosion(coreCenterX + 50, coreCenterY, themePurple);
                }
            } else {
                // Phase 5: Fast Retract
                hand1Target.x = currentLayout.h1Start.x;
                hand1Target.y = currentLayout.h1Start.y;
                hand2Target.x = currentLayout.h2Start.x;
                hand2Target.y = currentLayout.h2Start.y;

                hand1FingerAngle = 0.6;
                hand2FingerAngle = 0.6;

                hand1Pos.x += (hand1Target.x - hand1Pos.x) * 0.25;
                hand1Pos.y += (hand1Target.y - hand1Pos.y) * 0.25;
                hand2Pos.x += (hand2Target.x - hand2Pos.x) * 0.25;
                hand2Pos.y += (hand2Target.y - hand2Pos.y) * 0.25;

                if (previewFrame >= 240) {
                    isPreviewActive = false;
                    if (previewTriggerSource === 'settings') {
                        const panel = document.getElementById('cursor-settings-panel');
                        if (panel) {
                            panel.classList.remove('hidden');
                        }
                    } else if (previewTriggerSource === 'fun-zone') {
                        showFunZone();
                    }
                    gameStage = 'cooldown';
                    gameCooldownTimer = 180;
                }
            }

            const arm1Joints = solveIK(arm1Base.x, arm1Base.y, hand1Pos.x, hand1Pos.y, 240, 200, false);
            const arm2Joints = solveIK(arm2Base.x, arm2Base.y, hand2Pos.x, hand2Pos.y, 240, 200, true);

            drawRoboticArm(trailCtx, arm1Joints, themeCyan, '15, 30, 45', hand1FingerAngle);
            drawRoboticArm(trailCtx, arm2Joints, themePurple, '35, 15, 45', hand2FingerAngle);
        } else if (!isCursorInApp) {
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

    // ── Session-based Conversation Memory (persisted in localStorage)
    const SESSIONS_KEY = 'naz-chat-sessions';
    const ACTIVE_SESSION_ID_KEY = 'naz-active-session-id';

    function getSessions() {
        try {
            return JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]');
        } catch { return []; }
    }

    function saveSessions(sessions) {
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
    }

    function getActiveSessionId() {
        let id = sessionStorage.getItem(ACTIVE_SESSION_ID_KEY);
        if (!id) {
            id = 'session-' + Date.now();
            sessionStorage.setItem(ACTIVE_SESSION_ID_KEY, id);
        }
        return id;
    }

    function getChatHistory(sessionId = getActiveSessionId()) {
        const sessions = getSessions();
        const s = sessions.find(item => item.id === sessionId);
        return s && Array.isArray(s.history) ? s.history : [];
    }

    function saveChatHistory(history, sessionId = getActiveSessionId()) {
        const sessions = getSessions();
        let s = sessions.find(item => item.id === sessionId);
        
        if (!s) {
            // Generate a simple title based on the first message
            let title = 'New Chat';
            const firstUserMsg = history.find(m => m.role === 'user');
            if (firstUserMsg) {
                title = firstUserMsg.text.substring(0, 20) + (firstUserMsg.text.length > 20 ? '...' : '');
            }
            s = { id: sessionId, title: title, history: history };
            sessions.push(s);
        } else {
            s.history = history;
            // Update title if it was default
            if (s.title === 'New Chat' || s.title === 'New Conversation') {
                const firstUserMsg = history.find(m => m.role === 'user');
                if (firstUserMsg) {
                    s.title = firstUserMsg.text.substring(0, 20) + (firstUserMsg.text.length > 20 ? '...' : '');
                }
            }
        }
        
        saveSessions(sessions);
        renderSessionsList();
    }

    // Side Chat UI Selectors (appContainer is already declared above)
    const sideChatPanel = document.getElementById('side-chat-panel');
    const chatMessagesContainer = document.getElementById('chat-messages-container');
    const chatInputField = document.getElementById('chat-input-field');
    const chatSendBtn = document.getElementById('chat-send-btn');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const newChatBtn = document.getElementById('new-chat-btn');
    const sessionsListEl = document.getElementById('sessions-list');
    const chatToggle = document.getElementById('chat-toggle');

    function openChatPanel() {
        if (!appContainer) return;
        
        // Hide Settings and Fun Zone modals if open to keep viewport clean
        if (typeof hideSettings === 'function') hideSettings();
        if (typeof hideFunZone === 'function') hideFunZone();
        
        appContainer.classList.add('chat-active');
        // Unregister PWA keyboard override drawer since we have a dedicated side panel
        if (inputContainer) inputContainer.classList.add('collapsed');
        renderChatHistory();
        renderSessionsList();
        setTimeout(() => {
            if (chatInputField) chatInputField.focus();
        }, 100);
    }

    function closeChatPanel() {
        if (!appContainer) return;
        appContainer.classList.remove('chat-active');
    }

    function renderSessionsList() {
        if (!sessionsListEl) return;
        sessionsListEl.innerHTML = '';
        const sessions = getSessions();
        const activeId = getActiveSessionId();

        if (sessions.length === 0) {
            const emptyEl = document.createElement('div');
            emptyEl.style.fontSize = '0.65rem';
            emptyEl.style.color = 'rgba(255, 255, 255, 0.2)';
            emptyEl.style.padding = '8px';
            emptyEl.style.textAlign = 'center';
            emptyEl.textContent = 'No past chats';
            sessionsListEl.appendChild(emptyEl);
            return;
        }

        // Render newer sessions first
        sessions.slice().reverse().forEach(session => {
            const item = document.createElement('div');
            item.className = 'session-item' + (session.id === activeId ? ' active' : '');
            
            const titleSpan = document.createElement('span');
            titleSpan.className = 'session-item-title';
            titleSpan.textContent = session.title;
            item.appendChild(titleSpan);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'session-delete-btn';
            deleteBtn.innerHTML = '&times;';
            deleteBtn.title = 'Delete Chat';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent loading session when deleting
                deleteSession(session.id);
            });
            item.appendChild(deleteBtn);

            item.addEventListener('click', () => {
                selectSession(session.id);
            });
            
            sessionsListEl.appendChild(item);
        });
    }

    function selectSession(sessionId) {
        sessionStorage.setItem(ACTIVE_SESSION_ID_KEY, sessionId);
        renderSessionsList();
        renderChatHistory();
    }

    function deleteSession(sessionId) {
        let sessions = getSessions();
        sessions = sessions.filter(s => s.id !== sessionId);
        saveSessions(sessions);
        
        // If we deleted the current active session, reset active session ID
        if (getActiveSessionId() === sessionId) {
            sessionStorage.removeItem(ACTIVE_SESSION_ID_KEY);
        }
        
        renderSessionsList();
        renderChatHistory();
    }

    function renderChatHistory() {
        if (!chatMessagesContainer) return;
        chatMessagesContainer.innerHTML = '';
        const history = getChatHistory();
        
        if (history.length === 0) {
            // Default system greeting bubble
            const greetMsg = document.createElement('div');
            greetMsg.className = 'chat-message system';
            greetMsg.innerHTML = '<div class="bubble">⚡ Synapse link established. Say something to start your session.</div>';
            chatMessagesContainer.appendChild(greetMsg);
        } else {
            history.forEach(msg => {
                const bubbleWrapper = document.createElement('div');
                bubbleWrapper.className = `chat-message ${msg.role === 'user' ? 'user' : 'model'}`;
                
                const bubble = document.createElement('div');
                bubble.className = 'bubble';
                bubble.textContent = msg.text;
                bubbleWrapper.appendChild(bubble);
                
                chatMessagesContainer.appendChild(bubbleWrapper);
            });
        }
        
        // Auto scroll to bottom
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    function appendMessageBubble(role, text) {
        if (!chatMessagesContainer) return;
        
        // Remove default welcome bubble if it is the first real message
        const systemMsg = chatMessagesContainer.querySelector('.chat-message.system');
        if (systemMsg) {
            systemMsg.remove();
        }

        const bubbleWrapper = document.createElement('div');
        bubbleWrapper.className = `chat-message ${role === 'user' ? 'user' : (role === 'system' ? 'system' : 'model')}`;
        
        // Add high-tech metadata label (except for system notification text)
        if (role !== 'system') {
            const meta = document.createElement('div');
            meta.className = 'chat-message-meta';
            meta.textContent = role === 'user' ? '👤 VISHAL' : '🤖 NAZ';
            bubbleWrapper.appendChild(meta);
        }

        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.textContent = text;
        bubbleWrapper.appendChild(bubble);
        
        chatMessagesContainer.appendChild(bubbleWrapper);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }
    
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
            // Force reset scroll offsets to fix layout shift bugs on focus/blur
            const appContainer = document.querySelector('.app-container');
            if (appContainer) appContainer.scrollTop = 0;
            window.scrollTo(0, 0);
        } else {
            inputContainer.classList.remove('collapsed');
            userInput.focus();
        }
    }
    
    // Prevent internal scrolling within the glass container (locks header at top)
    const appCont = document.querySelector('.app-container');
    if (appCont) {
        appCont.addEventListener('scroll', () => {
            appCont.scrollTop = 0;
        });
    }
    
    if (userInput) {
        userInput.addEventListener('blur', () => {
            const appContainer = document.querySelector('.app-container');
            if (appContainer) appContainer.scrollTop = 0;
            window.scrollTo(0, 0);
        });
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

    document.addEventListener('keydown', (e) => {
        if (isSystemLocked) return;

        // Escape key closes the side chat panel
        if (e.key === 'Escape') {
            closeChatPanel();
            if (chatInputField) chatInputField.blur();
            return;
        }

        // Ignore if user is already typing in an input/textarea, or if modifier keys are pressed (Ctrl, Cmd, Alt)
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' || e.ctrlKey || e.metaKey || e.altKey) {
            return;
        }

        // Detect printable character keypresses (e.key length is 1) to open side chat panel dynamically
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            // Cancel active voice speech or synthesis to prioritize manual typing
            isContinuousVoiceActive = false; // Turn off voice loop when typing
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            stopMicrophone();
            voiceState = 'idle';
            aiCore.classList.remove('listening', 'thinking');
            voiceInstruction.textContent = 'MANUAL OVERRIDE SEQUENCE ACTIVE';

            openChatPanel();
            if (chatInputField) {
                chatInputField.value = e.key;
                chatInputField.focus();
            }
            e.preventDefault();
        }
    });

    // Bind event listeners for the side chat panel
    if (closeChatBtn) {
        closeChatBtn.addEventListener('click', closeChatPanel);
    }

    if (chatToggle) {
        chatToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (appContainer.classList.contains('chat-active')) {
                closeChatPanel();
            } else {
                openChatPanel();
            }
        });
    }

    if (newChatBtn) {
        newChatBtn.addEventListener('click', () => {
            sessionStorage.removeItem(ACTIVE_SESSION_ID_KEY); // Force create new session ID
            isContinuousVoiceActive = false; // Turn off voice loop
            renderSessionsList();
            renderChatHistory();
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            stopMicrophone();
            voiceState = 'idle';
            aiCore.classList.remove('listening', 'thinking');
            voiceInstruction.textContent = 'SYNAPSE RESET COMPLETED';
            speakAloud('Synapse reset. Starting a new conversation.');
        });
    }

    function submitChatMessage() {
        if (!chatInputField) return;
        const text = chatInputField.value.trim();
        if (!text) return;
        
        isContinuousVoiceActive = false; // Disable voice loop when manually typing
        appendMessageBubble('user', text);
        chatInputField.value = '';
        
        simulateAIResponse(text, false); // False = text-only input (do not speak aloud)
    }

    if (chatSendBtn) {
        chatSendBtn.addEventListener('click', submitChatMessage);
    }

    if (chatInputField) {
        chatInputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitChatMessage();
            }
        });
        chatInputField.addEventListener('focus', () => {
            isContinuousVoiceActive = false; // Disable voice loop when manually typing
        });
    }

    let voiceState = 'idle'; // 'idle', 'listening', 'processing'
    let ttsEnabled = true;
    let isContinuousVoiceActive = false;

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
        
        if (isPreviewActive && coreElement) {
            let shakeX = 0;
            let shakeY = 0;
            if (previewFrame < 90) {
                // Phase 1: Warning pulse
                targetAmp = 25;
                targetFreq = 0.015;
                targetSpeed = 0.02;
                const breath = 1.1 + Math.sin(previewFrame * 0.15) * 0.12;
                coreElement.style.transform = `scale(${breath})`;
                coreElement.style.borderColor = 'rgb(255, 69, 0)';
                coreElement.style.boxShadow = `
                    0 0 30px rgba(255, 69, 0, 0.8),
                    0 0 60px rgba(255, 69, 0, 0.4),
                    inset 0 0 15px rgba(255, 69, 0, 0.6)
                `;
            } else if (previewFrame < 270) {
                // Phase 2: Firing lasers - shake heavily and glow magenta/pink warning
                targetAmp = 40;
                targetFreq = 0.035;
                targetSpeed = 0.09;
                shakeX = (Math.random() - 0.5) * 8;
                shakeY = (Math.random() - 0.5) * 8;
                coreElement.style.transform = `scale(1.25) translate(${shakeX}px, ${shakeY}px)`;
                coreElement.style.borderColor = 'rgb(255, 0, 128)';
                coreElement.style.boxShadow = `
                    0 0 35px rgba(255, 0, 128, 0.9),
                    0 0 65px rgba(255, 0, 128, 0.5),
                    inset 0 0 20px rgba(255, 0, 128, 0.7)
                `;
            } else if (previewFrame < 390) {
                // Phase 3: Energy Orbit
                targetAmp = 30;
                targetFreq = 0.02;
                targetSpeed = 0.04;
                const breath = 1.05 + Math.sin(Date.now() * 0.015) * 0.05;
                coreElement.style.transform = `scale(${breath})`;
                coreElement.style.borderColor = `rgba(${themeCyan}, 1)`;
                coreElement.style.boxShadow = `
                    0 0 35px rgba(${themeCyan}, 0.8),
                    0 0 65px rgba(${themePurple}, 0.5),
                    inset 0 0 20px rgba(${themeCyan}, 0.6)
                `;
            } else if (previewFrame < 440) {
                // Phase 4: High-speed cross / Explosion
                targetAmp = 80;
                targetFreq = 0.05;
                targetSpeed = 0.15;
                shakeX = (Math.random() - 0.5) * 12;
                shakeY = (Math.random() - 0.5) * 12;
                coreElement.style.transform = `scale(1.4) translate(${shakeX}px, ${shakeY}px)`;
                coreElement.style.borderColor = '#ffffff';
                coreElement.style.boxShadow = `
                    0 0 45px #ffffff,
                    0 0 85px rgba(${themeCyan}, 0.95),
                    0 0 110px rgba(${themePurple}, 0.75),
                    inset 0 0 30px #ffffff
                `;
            } else {
                // Phase 5: Recovering
                targetAmp = 18;
                targetFreq = 0.008;
                targetSpeed = 0.012;
                coreElement.style.transform = 'scale(1)';
                coreElement.style.borderColor = `rgba(${themeCyan}, 0.8)`;
                coreElement.style.boxShadow = `0 0 20px rgba(${themeCyan}, 0.5)`;
            }
        } else if (voiceState === 'idle') {
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
        
        const femaleNames = ['siri', 'samantha', 'zira', 'karen', 'tessa', 'moira', 'veena', 'google uk english female', 'female', 'hazel', 'susan', 'victoria', 'kathy', 'princess', 'fiona', 'serena', 'premium', 'natural', 'enhanced'];
        
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

    // Robust voice loading with retry for slower devices
    let voicesReady = false;
    let voiceLoadRetries = 0;
    const MAX_VOICE_RETRIES = 10;

    function tryLoadVoices() {
        populateVoiceList();
        const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
        if (voices.length > 0) {
            voicesReady = true;
            console.log('Naz: Voice engines loaded successfully (' + voices.length + ' voices)');
        } else if (voiceLoadRetries < MAX_VOICE_RETRIES) {
            voiceLoadRetries++;
            setTimeout(tryLoadVoices, 500);
        } else {
            console.warn('Naz: Voice engines unavailable after retries');
        }
    }

    tryLoadVoices();
    if (window.speechSynthesis) {
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = () => {
                voicesReady = true;
                populateVoiceList();
            };
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

    const voiceToneSelect = document.getElementById('voice-tone-select');
    if (voiceToneSelect) {
        const storedTone = localStorage.getItem('naz-voice-tone') || 'default';
        voiceToneSelect.value = storedTone;
        voiceToneSelect.addEventListener('change', () => {
            localStorage.setItem('naz-voice-tone', voiceToneSelect.value);
            const alertText = voiceToneSelect.value === 'supportive' ? "Naz conversation tone set to supportive and friendly mode." : 
                              (voiceToneSelect.value === 'diagnostic' ? "Naz conversation tone set to strict binary diagnostic mode." : 
                              "Naz conversation tone set to default system mode.");
            speakAloud(alertText);
            simulateAIResponse(voiceToneSelect.value === 'supportive' ? "hello" : "sync", false);
        });
    }

    function speakAloud(text) {
        if (!ttsEnabled || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        
        // Replaces markdown formatting and strips emojis/symbols so TTS doesn't read them aloud
        let cleanText = text.replace(/[*_#`~[\]"']/g, '');
        // Strip out emojis and unicode pictographs
        cleanText = cleanText.replace(/[\u{1F300}-\u{1FAFF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FAFF}]/gu, '');
        // Strip other symbols and icons
        cleanText = cleanText.replace(/[👤⚙️⚡👾•]/gu, '');
        // Standardize whitespace
        cleanText = cleanText.replace(/\s+/g, ' ').trim();

        const utterance = new SpeechSynthesisUtterance(cleanText);
        let voices = window.speechSynthesis.getVoices();
        
        // If voices haven't loaded yet, wait and retry once
        if (voices.length === 0) {
            setTimeout(() => {
                voices = window.speechSynthesis.getVoices();
                if (voices.length > 0) {
                    speakAloud(text);
                }
            }, 300);
            return;
        }
        
        let voice = voices.find(v => v.name === selectedVoiceName);
        if (!voice) {
            const femaleVoiceNames = ['siri', 'samantha', 'zira', 'karen', 'tessa', 'moira', 'veena', 'google uk english female', 'female', 'hazel', 'susan', 'victoria', 'kathy', 'princess', 'fiona', 'serena', 'premium', 'natural', 'enhanced'];
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
            
            // If continuous voice mode is active, wait a moment and trigger listening again!
            if (isContinuousVoiceActive) {
                setTimeout(() => {
                    if (isContinuousVoiceActive && voiceState === 'idle') {
                        triggerVoiceActive();
                    }
                }, 800); // 800ms natural flow pause
            }
        };
        
        window.speechSynthesis.speak(utterance);
    }

    async function triggerVoiceActive() {
        if (isSystemLocked) return;
        
        if (voiceState === 'idle') {
            // Shift to LISTENING in continuous voice loop mode
            isContinuousVoiceActive = true;
            voiceState = 'listening';
            aiCore.classList.add('listening');
            voiceInstruction.textContent = 'VOICE ACTIVE... TAP TO STOP';
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
                    
                    simulateAIResponse(transcript, true); // true = voice input (speak output aloud)
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
                    voiceInstruction.textContent = 'SPEECH TIMEOUT. TAP TO RESTART';
                    isContinuousVoiceActive = false; // Turn off on error
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
                        "Hello Naz, how are you today?",
                        "Optimize the system pathways."
                    ];
                    const commandText = dummyCommands[Math.floor(Math.random() * dummyCommands.length)];
                    
                    userTextElement.textContent = `"${commandText}"`;
                     stopMicrophone();
                     voiceState = 'processing';
                     aiCore.classList.remove('listening');
                     aiCore.classList.add('thinking');
                     voiceInstruction.textContent = 'DECRYPTING TRANSCRIPT...';
                     simulateAIResponse(commandText, true);
                }, 4000);
            }
        } else {
            // Turn off continuous voice chat on explicit user click while active
            isContinuousVoiceActive = false;
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            stopMicrophone();
            
            if (recognition) {
                try { recognition.stop(); } catch(e) {}
            }
            
            voiceState = 'idle';
            aiCore.classList.remove('listening', 'thinking');
            voiceInstruction.textContent = 'TAP CORE TO TRANSMIT COMMAND';
        }
    }

    if (voiceTrigger) {
        voiceTrigger.addEventListener('click', triggerVoiceActive);
    }

    async function simulateAIResponse(queryText, isVoiceMode = false) {
        voiceState = 'processing';
        aiCore.classList.add('thinking');
        aiTextElement.innerHTML = '';
        voiceInstruction.textContent = 'NAZ IS THINKING...';
        
        // Dynamic slide: Ensure the side chat panel is visible when AI starts responding
        openChatPanel();

        // Update active message list to show user message if it is not already there
        const history = getChatHistory();
        const userExists = history.length > 0 && history[history.length - 1].role === 'user' && history[history.length - 1].text === queryText;
        if (!userExists) {
            history.push({ role: 'user', text: queryText });
            appendMessageBubble('user', queryText);
        }

        const cursorSpan = document.createElement('span');
        cursorSpan.className = 'typing-cursor';
        aiTextElement.appendChild(cursorSpan);

        let response = '';

        // Use production API URL if testing locally (file://, localhost, or local IP) to bypass local environment gaps
        const isLocal = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1' || 
                        window.location.hostname === '0.0.0.0' || 
                        window.location.hostname.startsWith('192.168.') || 
                        window.location.hostname.startsWith('10.') || 
                        window.location.hostname.startsWith('172.') || 
                        !window.location.hostname.includes('.') || 
                        window.location.protocol === 'file:';
        const apiEndpoint = isLocal ? 'https://sentient-stack.vercel.app/api/chat' : '/api/chat';

        try {
            const customApiKey = localStorage.getItem('naz-custom-api-key') || '';
            const headers = { 'Content-Type': 'application/json' };
            if (customApiKey) {
                headers['x-gemini-api-key'] = customApiKey;
            }

            const res = await fetch(apiEndpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    message: queryText,
                    history: history
                })
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || `Server responded with ${res.status}`);
            }

            const data = await res.json();
            response = data.reply || "Hmm, I couldn't form a thought there. Try asking me again?";

        } catch (err) {
            console.error('Naz API error:', err);
            // Graceful fallback — Naz still responds with personality
            const fallbacks = [
                "Hey Vishal, I'm having a little trouble connecting to my brain right now. Give me a moment and try again? 💫",
                "Oops, my neural link is being a bit shaky right now. Can you try again in a sec? I'm still here for you! 🌟",
                "Something went wrong on my end, but don't worry — I'm not going anywhere. Try sending that again? 💜",
                "My connection hiccuped! I really want to help you with that. Mind trying once more? ✨"
            ];
            response = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        }

        // Save Naz's response to history
        history.push({ role: 'model', text: response });
        saveChatHistory(history);

        // Render Naz's message bubble as empty first, then fill it using typewriter
        appendMessageBubble('model', '');
        const allBubbles = chatMessagesContainer.querySelectorAll('.chat-message.model .bubble');
        const activeBubble = allBubbles[allBubbles.length - 1];

        // 🌟 SPEAK IMMEDIATELY FOR NATURAL EXPRESSION AND NO LAG (ONLY FOR VOICE INPUT)
        if (isVoiceMode) {
            speakAloud(response);
        }

        // Typewriter logic for the AI text blocks (runs in parallel)
        let i = 0;
        aiTextElement.innerHTML = '';
        aiTextElement.appendChild(cursorSpan);
        
        function typeWriter() {
            if (i < response.length) {
                const char = response.charAt(i);
                
                // Update old HUD text
                aiTextElement.insertBefore(document.createTextNode(char), cursorSpan);
                // Update active chat bubble text
                if (activeBubble) {
                    activeBubble.textContent = response.substring(0, i + 1);
                }
                
                // Auto scroll to make sure typewriter text is in view
                if (chatMessagesContainer) {
                    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
                }
                
                i++;
                const speed = Math.random() * 12 + 4;
                setTimeout(typeWriter, speed);
            } else {
                cursorSpan.remove();
                aiCore.classList.remove('thinking');
                if (activeBubble) {
                    activeBubble.textContent = response; // finalize
                }
                if (chatMessagesContainer) {
                    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
                }
            }
        }
        typeWriter();
    }

    function handleSend() {
        const text = userInput.value.trim();
        if (text) {
            userTextElement.textContent = `"${text}"`;
            userInput.value = '';
            
            // Hide input container on send
            toggleKeyboardDrawer(true);
            
            simulateAIResponse(text, false);
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

    // -----------------------------------------------------------------
    // CROSS-DEVICE SETTINGS SYNC SYSTEM
    // -----------------------------------------------------------------
    const SETTINGS_KEYS = [
        'assistant-theme',
        'naz-cursor-style', 
        'naz-core-design',
        'naz-arm-style',
        'naz-voice-focus',
        'naz-voice-profile'
    ];

    function gatherSettings() {
        const settings = {};
        SETTINGS_KEYS.forEach(key => {
            const val = localStorage.getItem(key);
            if (val) settings[key] = val;
        });
        return settings;
    }

    function encodeSettings(settings) {
        try {
            return btoa(JSON.stringify(settings));
        } catch (e) {
            console.error('Settings encode error:', e);
            return '';
        }
    }

    function decodeSettings(encoded) {
        try {
            return JSON.parse(atob(encoded));
        } catch (e) {
            console.error('Settings decode error:', e);
            return null;
        }
    }

    function applyImportedSettings(settings) {
        if (!settings || typeof settings !== 'object') return false;
        
        let applied = 0;
        SETTINGS_KEYS.forEach(key => {
            if (settings[key]) {
                localStorage.setItem(key, settings[key]);
                applied++;
            }
        });
        
        if (applied > 0) {
            // Apply theme immediately
            if (settings['assistant-theme']) {
                const idx = themes.findIndex(t => t.name === settings['assistant-theme']);
                if (idx !== -1) {
                    currentThemeIndex = idx;
                    applyTheme(currentThemeIndex);
                }
            }
            
            // Apply cursor style
            if (settings['naz-cursor-style']) {
                selectedCursorStyle = settings['naz-cursor-style'];
                applyCursorDotStyle(selectedCursorStyle);
                cursorOpts.forEach(btn => {
                    if (btn.getAttribute('data-style') === selectedCursorStyle) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }
            
            // Apply core design
            if (settings['naz-core-design']) {
                selectedCoreDesign = settings['naz-core-design'];
                applyCoreDesign(selectedCoreDesign);
                coreDesignOpts.forEach(btn => {
                    if (btn.getAttribute('data-design') === selectedCoreDesign) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }

            // Apply robotic arm style
            if (settings['naz-arm-style']) {
                selectedArmStyle = settings['naz-arm-style'];
                applyArmStyle(selectedArmStyle);
                armStyleOpts.forEach(btn => {
                    if (btn.getAttribute('data-style') === selectedArmStyle) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }
            
            // Apply voice focus
            if (settings['naz-voice-focus'] && voiceFocusSelect) {
                selectedVoiceFocus = settings['naz-voice-focus'];
                voiceFocusSelect.value = selectedVoiceFocus;
                populateVoiceList();
            }
            
            // Apply voice name (will be matched on next voice list population)
            if (settings['naz-voice-profile']) {
                selectedVoiceName = settings['naz-voice-profile'];
            }
            
            return true;
        }
        return false;
    }

    // Check URL hash for incoming settings on page load
    function checkURLForSettings() {
        const hash = window.location.hash;
        if (hash && hash.startsWith('#naz-settings=')) {
            const encoded = hash.replace('#naz-settings=', '');
            const settings = decodeSettings(encoded);
            if (settings && applyImportedSettings(settings)) {
                // Clean the URL hash after import
                history.replaceState(null, '', window.location.pathname + window.location.search);
                showSyncStatus('✅ SETTINGS IMPORTED FROM LINK');
                speakAloud('Settings synchronized from shared link.');
                return true;
            }
        }
        return false;
    }

    function showSyncStatus(msg) {
        const statusEl = document.getElementById('sync-status');
        if (statusEl) {
            statusEl.textContent = msg;
            statusEl.style.opacity = '1';
            setTimeout(() => {
                statusEl.style.opacity = '0';
                setTimeout(() => { statusEl.textContent = ''; }, 300);
            }, 3000);
        }
    }

    // Export settings button
    const exportBtn = document.getElementById('export-settings-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async () => {
            const settings = gatherSettings();
            const encoded = encodeSettings(settings);
            const url = window.location.origin + window.location.pathname + '#naz-settings=' + encoded;
            
            try {
                await navigator.clipboard.writeText(url);
                showSyncStatus('✅ SETTINGS LINK COPIED TO CLIPBOARD');
                speakAloud('Settings link copied. Open it on any device to sync.');
            } catch (e) {
                // Fallback: show the link in a prompt
                prompt('Copy this settings link:', url);
                showSyncStatus('📋 COPY THE LINK ABOVE');
            }
        });
    }

    // Import settings button
    const importBtn = document.getElementById('import-settings-btn');
    if (importBtn) {
        importBtn.addEventListener('click', async () => {
            try {
                const clipText = await navigator.clipboard.readText();
                
                let settings = null;
                // Check if it's a full URL with hash
                if (clipText.includes('#naz-settings=')) {
                    const encoded = clipText.split('#naz-settings=')[1];
                    settings = decodeSettings(encoded);
                } else {
                    // Try direct base64 decode
                    settings = decodeSettings(clipText);
                }
                
                if (settings && applyImportedSettings(settings)) {
                    showSyncStatus('✅ SETTINGS IMPORTED FROM CLIPBOARD');
                    speakAloud('Settings imported successfully.');
                } else {
                    showSyncStatus('❌ NO VALID SETTINGS IN CLIPBOARD');
                }
            } catch (e) {
                // Clipboard read not available, ask user to paste
                const input = prompt('Paste your settings link here:');
                if (input) {
                    let settings = null;
                    if (input.includes('#naz-settings=')) {
                        const encoded = input.split('#naz-settings=')[1];
                        settings = decodeSettings(encoded);
                    } else {
                        settings = decodeSettings(input);
                    }
                    
                    if (settings && applyImportedSettings(settings)) {
                        showSyncStatus('✅ SETTINGS IMPORTED');
                        speakAloud('Settings imported successfully.');
                    } else {
                        showSyncStatus('❌ INVALID SETTINGS DATA');
                    }
                }
            }
        });
    }

    // Auto-import from URL hash on load
    checkURLForSettings();

    // Unregister any active Service Workers and clear caches to avoid sticky caching issues
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            for (let registration of registrations) {
                registration.unregister().then(() => {
                    console.log('Service Worker unregistered');
                });
            }
        });
        caches.keys().then(names => {
            for (let name of names) {
                caches.delete(name);
            }
        });
    }

});

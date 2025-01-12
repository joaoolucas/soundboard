class SoundBoard {
    constructor() {
        this.sounds = {};
        this.context = new (window.AudioContext || window.webkitAudioContext)();
        this.init();
    }

    async init() {
        const soundFiles = {
            rain: 'sounds/rain.mp3',
            neon: 'sounds/neon.mp3',
            sirens: 'sounds/sirens.mp3',
            hovercars: 'sounds/hovercars.mp3'
        };

        for (const [name, file] of Object.entries(soundFiles)) {
            try {
                const response = await fetch(file);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
                
                this.sounds[name] = {
                    buffer: audioBuffer,
                    source: null,
                    gainNode: this.context.createGain()
                };
                
                this.sounds[name].gainNode.connect(this.context.destination);
            } catch (error) {
                console.error(`Error loading sound ${name}:`, error);
            }
        }

        this.setupEventListeners();
    }

    setupEventListeners() {
        const buttons = document.querySelectorAll('.sound-btn');
        buttons.forEach(button => {
            const soundName = button.dataset.sound;
            const slider = button.querySelector('.volume-slider');

            button.addEventListener('click', () => {
                if (!this.sounds[soundName].source) {
                    this.playSound(soundName);
                    button.classList.add('active');
                } else {
                    this.stopSound(soundName);
                    button.classList.remove('active');
                }
            });

            slider.addEventListener('input', (e) => {
                if (this.sounds[soundName].gainNode) {
                    this.sounds[soundName].gainNode.gain.value = e.target.value;
                }
            });
        });
    }

    playSound(name) {
        const sound = this.sounds[name];
        if (!sound) return;

        sound.source = this.context.createBufferSource();
        sound.source.buffer = sound.buffer;
        sound.source.loop = true;
        sound.source.connect(sound.gainNode);
        sound.source.start();
    }

    stopSound(name) {
        const sound = this.sounds[name];
        if (sound && sound.source) {
            sound.source.stop();
            sound.source = null;
        }
    }
}

// Initialize the soundboard when the page loads
window.addEventListener('load', () => {
    const soundboard = new SoundBoard();
}); 
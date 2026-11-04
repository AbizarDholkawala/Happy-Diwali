/**
 * Diwali Audio Engine
 * Supports HTML5 audio playback of 5 tracks from /audio/ (or /music/) with seamless
 * loop, play, pause, track switching, scrubber seek, volume, and procedural fallback.
 * Mobile & Android compliant with direct synchronous playback and preloaded sources.
 */

export const TRACKS = [
  {
    id: 0,
    title: 'Divine Bansuri',
    subtitle: 'Soothing Bamboo Flute & Temple Chimes',
    src: '/audio/1.mp3',
    altSrc: '/audio/track-1.mp3',
    duration: '1:31',
    durationSec: 91,
    mood: 'Peaceful & Devotional',
    icon: '🪔',
    color: '#F5A623',
    preset: 'bansuri',
  },
  {
    id: 1,
    title: 'Soulful Sitar',
    subtitle: 'Classical Plucked Sitar & Tanpura Drone',
    src: '/audio/2.mp3',
    altSrc: '/audio/track-2.mp3',
    duration: '2:20',
    durationSec: 140,
    mood: 'Meditative & Royal',
    icon: '✨',
    color: '#FFD180',
    preset: 'sitar',
  },
  {
    id: 2,
    title: 'Temple Dawn',
    subtitle: 'Morning Aarti, Singing Bowls & Resonance',
    src: '/audio/3.mp3',
    altSrc: '/audio/track-3.mp3',
    duration: '2:08',
    durationSec: 128,
    mood: 'Spiritual & Calming',
    icon: '🕉️',
    color: '#E8732A',
    preset: 'temple',
  },
  {
    id: 3,
    title: 'Festive Joy',
    subtitle: 'Uplifting Diwali Rhythms & Folk Charm',
    src: '/audio/4.mp3',
    altSrc: '/audio/track-4.mp3',
    duration: '2:39',
    durationSec: 159,
    mood: 'Joyful & Radiant',
    icon: '🎆',
    color: '#FF6B6B',
    preset: 'festive',
  },
  {
    id: 4,
    title: 'Deepavali Aarti',
    subtitle: 'Deep Diya Glow Harmony & Sacred Bells',
    src: '/audio/5.mp3',
    altSrc: '/audio/track-5.mp3',
    duration: '4:44',
    durationSec: 284,
    mood: 'Enchanting & Serene',
    icon: '🌙',
    color: '#D4A847',
    preset: 'aarti',
  },
];

class AudioEngine {
  constructor() {
    this.currentTrackIndex = 0;
    this.isPlaying = false;
    this.isLooping = true;
    this.volume = 0.65;
    this.currentTime = 0;
    this.duration = TRACKS[0].durationSec;
    this.audioElement = null;
    this.audioCtx = null;
    this.synthActive = false;
    this.synthIntervals = [];
    this.synthNodes = [];
    this.listeners = new Set();

    if (typeof window !== 'undefined') {
      this.initAudioElement();
    }
  }

  initAudioElement() {
    this.audioElement = new Audio();
    this.audioElement.setAttribute('playsinline', '');
    this.audioElement.setAttribute('webkit-playsinline', '');
    // Pre-attach Track 1 src immediately so user gesture doesn't need to call .load()
    this.audioElement.src = TRACKS[0].src;
    this.audioElement.volume = this.volume;
    this.audioElement.loop = this.isLooping;
    this.audioElement.preload = 'auto';

    // Auto advance when song finishes and loop is off
    this.audioElement.addEventListener('ended', () => {
      if (!this.isLooping) {
        this.nextTrack();
      }
    });

    // Time update for progress bar and elapsed time
    this.audioElement.addEventListener('timeupdate', () => {
      if (this.audioElement) {
        this.currentTime = this.audioElement.currentTime || 0;
        const rawDur = this.audioElement.duration;
        if (Number.isFinite(rawDur) && rawDur > 0) {
          this.duration = rawDur;
        } else {
          this.duration = TRACKS[this.currentTrackIndex]?.durationSec || 0;
        }
        this.notify();
      }
    });

    this.audioElement.addEventListener('loadedmetadata', () => {
      if (this.audioElement) {
        const rawDur = this.audioElement.duration;
        if (Number.isFinite(rawDur) && rawDur > 0) {
          this.duration = rawDur;
        } else {
          this.duration = TRACKS[this.currentTrackIndex]?.durationSec || 0;
        }
        this.notify();
      }
    });

    // When the real MP3 starts playing, kill any synth fallback
    this.audioElement.addEventListener('playing', () => {
      this.stopSynth();
      this.isPlaying = true;
      const rawDur = this.audioElement ? this.audioElement.duration : null;
      if (Number.isFinite(rawDur) && rawDur > 0) {
        this.duration = rawDur;
      }
      this.notify();
    });

    // On audio load error, attempt fallback source or synth
    this.audioElement.addEventListener('error', () => {
      const track = TRACKS[this.currentTrackIndex];
      const currentSrc = this.audioElement.src || '';
      if (track && track.altSrc && !currentSrc.endsWith(track.altSrc)) {
        console.warn(`Primary audio src failed, trying alternate ${track.altSrc}`);
        this.audioElement.src = track.altSrc;
        this.audioElement.load();
        if (this.isPlaying) {
          this.audioElement.play().catch(() => {
            if (this.isPlaying && !this.synthActive) this.startSynth(this.currentTrackIndex);
          });
        }
      } else if (this.isPlaying && !this.synthActive) {
        console.warn('Audio element error, falling back to procedural ambient raga');
        this.startSynth(this.currentTrackIndex);
      }
    });
  }

  getAudioContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const state = this.getState();
    this.listeners.forEach(fn => fn(state));
  }

  getState() {
    const rawDur = this.audioElement ? this.audioElement.duration : null;
    const resolvedDuration = (Number.isFinite(this.duration) && this.duration > 0)
      ? this.duration
      : ((Number.isFinite(rawDur) && rawDur > 0)
          ? rawDur
          : (TRACKS[this.currentTrackIndex]?.durationSec || 0));

    return {
      currentTrack: TRACKS[this.currentTrackIndex],
      currentTrackIndex: this.currentTrackIndex,
      isPlaying: this.isPlaying,
      isLooping: this.isLooping,
      volume: this.volume,
      currentTime: Number.isFinite(this.currentTime) ? this.currentTime : 0,
      duration: resolvedDuration,
      tracks: TRACKS,
    };
  }

  play() {
    this.isPlaying = true;
    const track = TRACKS[this.currentTrackIndex];

    try {
      this.stopSynth();

      if (track && track.src && this.audioElement) {
        const currentSrc = this.audioElement.src || '';
        // Only re-assign and call load() if switching to a DIFFERENT track!
        // When playing the initial track, src is already assigned, preserving mobile touch gesture activation.
        if (!currentSrc.endsWith(track.src) && !currentSrc.endsWith(track.altSrc || '')) {
          this.audioElement.src = track.src;
          this.audioElement.load();
        }

        this.audioElement.loop = this.isLooping;
        this.audioElement.volume = this.volume;

        const playPromise = this.audioElement.play();
        if (playPromise !== undefined) {
          return playPromise
            .then(() => {
              this.isPlaying = true;
              this.stopSynth();
              this.notify();
              return true;
            })
            .catch((err) => {
              // Ignore intentional interruption (AbortError)
              if (err && err.name === 'AbortError') {
                return false;
              }
              if (err && err.name === 'NotAllowedError') {
                // Browser blocked autoplay due to autoplay policy
                this.isPlaying = false;
                this.notify();
                throw err;
              }
              console.warn('Playback error:', err);
              if (this.isPlaying && !this.synthActive) {
                this.startSynth(this.currentTrackIndex);
              }
              return false;
            });
        }
      } else {
        this.startSynth(this.currentTrackIndex);
      }
    } catch (e) {
      if (e && e.name === 'NotAllowedError') {
        this.isPlaying = false;
        this.notify();
        throw e;
      }
      console.warn('Play error:', e);
      if (this.isPlaying && !this.synthActive) {
        this.startSynth(this.currentTrackIndex);
      }
    }

    this.notify();
    return Promise.resolve(true);
  }

  pause() {
    this.isPlaying = false;
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.stopSynth();
    this.notify();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
      return Promise.resolve(false);
    } else {
      return this.play();
    }
  }

  setTrack(index) {
    if (index < 0 || index >= TRACKS.length) return;
    this.currentTrackIndex = index;
    const track = TRACKS[this.currentTrackIndex];

    this.stopSynth();

    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.audioElement.src = track.src;
      this.audioElement.load();
      this.currentTime = 0;
      this.duration = track.durationSec || 0;
    }

    if (this.isPlaying) {
      this.play();
    } else {
      this.notify();
    }
  }

  nextTrack() {
    const nextIdx = (this.currentTrackIndex + 1) % TRACKS.length;
    this.setTrack(nextIdx);
  }

  prevTrack() {
    const prevIdx = (this.currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    this.setTrack(prevIdx);
  }

  seek(seconds) {
    if (this.audioElement && Number.isFinite(seconds)) {
      this.audioElement.currentTime = seconds;
      this.currentTime = seconds;
      this.notify();
    }
  }

  toggleLoop() {
    this.isLooping = !this.isLooping;
    if (this.audioElement) {
      this.audioElement.loop = this.isLooping;
    }
    this.notify();
  }

  setVolume(val) {
    const clamped = Math.max(0, Math.min(1, val));
    this.volume = clamped;
    if (this.audioElement) {
      this.audioElement.volume = clamped;
    }
    if (this.synthMasterGain && this.audioCtx) {
      this.synthMasterGain.gain.setValueAtTime(clamped * 0.25, this.audioCtx.currentTime);
    }
    this.notify();
  }

  /* ═══════════════════════════════════════════
     PROCEDURAL WEB AUDIO AMBIENT RAGA SYNTHESIZER
     Authentic Indian Classical Tanpura, Flute & Bell Ambient
     Used ONLY as a fallback if no audio file can be fetched.
     ═══════════════════════════════════════════ */
  startSynth(trackIndex) {
    this.stopSynth();
    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.synthActive = true;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.22, ctx.currentTime);
    masterGain.connect(ctx.destination);
    this.synthMasterGain = masterGain;

    // Raga scale frequencies (Sa, Re, Ga, Pa, Dha, Sa') in C#
    const rootSa = 138.59; // C#3
    const fifthPa = 207.65; // G#3
    const octaveSa = 277.18; // C#4

    // 1. Continuous Tanpura Drone
    const droneOsc1 = ctx.createOscillator();
    droneOsc1.type = 'triangle';
    droneOsc1.frequency.setValueAtTime(rootSa, ctx.currentTime);

    const droneOsc2 = ctx.createOscillator();
    droneOsc2.type = 'sine';
    droneOsc2.frequency.setValueAtTime(fifthPa, ctx.currentTime);

    const droneOsc3 = ctx.createOscillator();
    droneOsc3.type = 'triangle';
    droneOsc3.frequency.setValueAtTime(octaveSa * 0.5, ctx.currentTime);

    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0.35, ctx.currentTime);

    // Soft chorus filter
    const droneFilter = ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(450, ctx.currentTime);

    droneOsc1.connect(droneGain);
    droneOsc2.connect(droneGain);
    droneOsc3.connect(droneGain);
    droneGain.connect(droneFilter);
    droneFilter.connect(masterGain);

    droneOsc1.start();
    droneOsc2.start();
    droneOsc3.start();

    this.synthNodes.push(droneOsc1, droneOsc2, droneOsc3, droneGain, droneFilter);

    // 2. Preset-specific Melodic / Harmonic Generators
    const preset = TRACKS[trackIndex]?.preset || 'bansuri';

    const ragaNotes = [
      octaveSa, // Sa
      octaveSa * (9 / 8), // Re (311.8 Hz)
      octaveSa * (5 / 4), // Ga (346.4 Hz)
      octaveSa * (3 / 2), // Pa (415.7 Hz)
      octaveSa * (5 / 3), // Dha (461.9 Hz)
      octaveSa * 2, // Sa' (554.3 Hz)
    ];

    const phraseInterval = setInterval(() => {
      if (!this.synthActive || ctx.state !== 'running') return;
      this.playFluteNote(ctx, masterGain, ragaNotes, preset);
    }, preset === 'festive' ? 1400 : 2400);

    const bellInterval = setInterval(() => {
      if (!this.synthActive || ctx.state !== 'running') return;
      this.playTempleBell(ctx, masterGain, preset);
    }, 5500);

    this.synthIntervals.push(phraseInterval, bellInterval);
  }

  playFluteNote(ctx, destination, notes, preset) {
    const note = notes[Math.floor(Math.random() * notes.length)];
    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = preset === 'sitar' ? 'sawtooth' : 'sine';
    osc.frequency.setValueAtTime(note, ctx.currentTime);

    const filter = ctx.createBiquadFilter();
    filter.type = preset === 'sitar' ? 'bandpass' : 'lowpass';
    filter.frequency.setValueAtTime(preset === 'sitar' ? 1200 : 800, ctx.currentTime);

    const now = ctx.currentTime;
    const duration = preset === 'festive' ? 1.2 : 2.5;

    noteGain.gain.setValueAtTime(0.001, now);
    noteGain.gain.linearRampToValueAtTime(0.45, now + 0.35);
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(destination);

    osc.start(now);
    osc.stop(now + duration + 0.1);
  }

  playTempleBell(ctx, destination, preset) {
    const baseFreq = preset === 'aarti' ? 880 : 1320;
    const osc = ctx.createOscillator();
    const bellGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);

    const now = ctx.currentTime;
    bellGain.gain.setValueAtTime(0.25, now);
    bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

    osc.connect(bellGain);
    bellGain.connect(destination);

    osc.start(now);
    osc.stop(now + 4);
  }

  stopSynth() {
    this.synthActive = false;
    this.synthIntervals.forEach(id => clearInterval(id));
    this.synthIntervals = [];

    this.synthNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch {}
    });
    this.synthNodes = [];
  }
}

// Global Singleton Instance
export const audioEngine = typeof window !== 'undefined' ? new AudioEngine() : null;

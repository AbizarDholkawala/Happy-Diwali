import { useState, useEffect } from 'react';
import {
  Play, Pause, SkipForward, SkipBack, Repeat,
  Volume2, VolumeX, Disc, X, Sparkles
} from 'lucide-react';
import { audioEngine, TRACKS } from '../utils/audioEngine';

function formatTime(seconds) {
  if (!seconds || !Number.isFinite(seconds) || isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function MusicPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [audioState, setAudioState] = useState(() => audioEngine ? audioEngine.getState() : {
    currentTrack: TRACKS[0],
    currentTrackIndex: 0,
    isPlaying: false,
    isLooping: true,
    volume: 0.65,
    currentTime: 0,
    duration: 0,
    tracks: TRACKS,
  });

  useEffect(() => {
    if (!audioEngine) return;
    const unsubscribe = audioEngine.subscribe(newState => {
      setAudioState(newState);
    });
    return unsubscribe;
  }, []);

  /* ─── Autoplay Music on Page Load / First User Gesture (Android & Mobile Compliant) ─── */
  useEffect(() => {
    if (!audioEngine) return;

    let unlocked = false;

    // 1. Try immediate autoplay on page load (desktop browsers / returning visitors)
    audioEngine.play()
      .then(() => {
        unlocked = true;
      })
      .catch(() => {
        // Autoplay blocked by mobile browser; user gesture unlocker handles it below
      });

    // 2. Mobile User Gesture Unlocker:
    // On Android & iOS, 'touchend' and 'click' are the ONLY valid user activations for media playback.
    // 'touchstart' and 'pointerdown' DO NOT unlock HTML5 audio on Android Chrome.
    const unlockAndPlay = () => {
      if (unlocked || (audioEngine && audioEngine.isPlaying)) return;

      audioEngine.play()
        .then(() => {
          unlocked = true;
          removeListeners();
        })
        .catch(() => {
          // If still blocked on Android, keep listeners active so next tap starts it
        });
    };

    const removeListeners = () => {
      window.removeEventListener('touchend', unlockAndPlay, true);
      window.removeEventListener('click', unlockAndPlay, true);
      document.removeEventListener('touchend', unlockAndPlay, true);
      document.removeEventListener('click', unlockAndPlay, true);
    };

    window.addEventListener('touchend', unlockAndPlay, { capture: true, passive: true });
    window.addEventListener('click', unlockAndPlay, { capture: true, passive: true });
    document.addEventListener('touchend', unlockAndPlay, { capture: true, passive: true });
    document.addEventListener('click', unlockAndPlay, { capture: true, passive: true });

    return () => {
      removeListeners();
    };
  }, []);

  const { currentTrack, currentTrackIndex, isPlaying, isLooping, volume, currentTime, duration } = audioState;

  const effectiveDuration = (Number.isFinite(duration) && duration > 0)
    ? duration
    : (currentTrack?.durationSec || 100);

  const displayDuration = (Number.isFinite(duration) && duration > 0)
    ? formatTime(duration)
    : (currentTrack?.duration || '0:00');

  const handlePlayPause = (e) => {
    e?.stopPropagation();
    if (audioEngine) audioEngine.togglePlay();
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    if (audioEngine) audioEngine.nextTrack();
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    if (audioEngine) audioEngine.prevTrack();
  };

  const handleToggleLoop = (e) => {
    e?.stopPropagation();
    if (audioEngine) audioEngine.toggleLoop();
  };

  const handleSelectTrack = (idx) => {
    if (audioEngine) {
      if (idx === currentTrackIndex) {
        audioEngine.togglePlay();
      } else {
        audioEngine.setTrack(idx);
        audioEngine.play();
      }
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    if (audioEngine) audioEngine.setVolume(val);
  };

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    if (audioEngine) audioEngine.seek(val);
  };

  const toggleMute = () => {
    if (audioEngine) {
      audioEngine.setVolume(volume > 0 ? 0 : 0.65);
    }
  };

  return (
    <>
      {/* ─── Floating Collapsed Music Pill ─── */}
      <aside
        className={`music-floating-pill ${isPlaying ? 'playing' : 'pulse-prompt'}`}
        onClick={() => setIsOpen(true)}
        role="region"
        aria-label="Diwali Music Player"
      >
        <div className={`pill-disc ${isPlaying ? 'spinning' : ''}`}>
          <Disc size={18} color="var(--amber)" />
        </div>

        <div className="pill-info">
          <span className="pill-title">{currentTrack?.title || 'Diwali Music'}</span>
          <span className="pill-status">
            {isPlaying ? (
              <span className="pill-eq">
                <span className="bar" />
                <span className="bar" />
                <span className="bar" />
              </span>
            ) : (
              'Tap for Music 🎵'
            )}
          </span>
        </div>

        <button
          className="pill-play-btn"
          onClick={handlePlayPause}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" style={{ marginLeft: '2px' }} />}
        </button>
      </aside>

      {/* ─── Backdrop Overlay when Drawer is Open ─── */}
      {isOpen && (
        <div className="music-drawer-backdrop" onClick={() => setIsOpen(false)} />
      )}

      {/* ─── Slide-out Side Player Drawer ─── */}
      <section
        className={`music-side-drawer ${isOpen ? 'open' : ''}`}
        aria-hidden={!isOpen}
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <span className="drawer-badge">
              <Sparkles size={14} color="var(--amber)" /> Background Atmosphere
            </span>
            <h3 className="drawer-heading">Diwali Music Player</h3>
          </div>
          <button
            className="drawer-close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="Close music player"
          >
            <X size={18} />
          </button>
        </div>

        {/* Now Playing Hero Box */}
        <div className="now-playing-card">
          <div className="hero-disc-wrapper">
            <div className={`hero-disc ${isPlaying ? 'spinning' : ''}`}>
              <span className="hero-track-icon">{currentTrack?.icon || '🪔'}</span>
            </div>
            {isPlaying && (
              <div className="hero-soundwave">
                <span className="wave-bar" />
                <span className="wave-bar" />
                <span className="wave-bar" />
                <span className="wave-bar" />
                <span className="wave-bar" />
              </div>
            )}
          </div>

          <div className="hero-track-details">
            <span className="hero-mood-tag">{currentTrack?.mood}</span>
            <h4 className="hero-track-title">{currentTrack?.title}</h4>
            <p className="hero-track-subtitle">{currentTrack?.subtitle}</p>
          </div>

          {/* Scrubber / Progress Bar */}
          <div className="scrubber-container">
            <input
              type="range"
              min="0"
              max={effectiveDuration}
              step="0.5"
              value={Number.isFinite(currentTime) && currentTime >= 0 ? currentTime : 0}
              onChange={handleSeek}
              className="scrubber-bar"
              aria-label="Track progress"
            />
            <div className="scrubber-times">
              <span>{formatTime(currentTime)}</span>
              <span>{displayDuration}</span>
            </div>
          </div>

          {/* Primary Audio Controls (Play, Pause, Loop, Prev, Next) */}
          <div className="audio-controls-row">
            {/* Loop Toggle */}
            <button
              className={`control-btn loop-btn ${isLooping ? 'active' : ''}`}
              onClick={handleToggleLoop}
              title={isLooping ? 'Loop enabled (repeats track)' : 'Loop disabled (auto-advances)'}
              aria-label="Toggle loop"
            >
              <Repeat size={16} />
              {isLooping && <span className="loop-dot" />}
            </button>

            {/* Previous Track */}
            <button
              className="control-btn"
              onClick={handlePrev}
              title="Previous Song"
              aria-label="Previous song"
            >
              <SkipBack size={18} />
            </button>

            {/* Big Play / Pause CTA */}
            <button
              className={`main-play-btn ${isPlaying ? 'playing' : ''}`}
              onClick={handlePlayPause}
              title={isPlaying ? 'Pause' : 'Play'}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" style={{ marginLeft: '3px' }} />}
            </button>

            {/* Next Track */}
            <button
              className="control-btn"
              onClick={handleNext}
              title="Next Song"
              aria-label="Next song"
            >
              <SkipForward size={18} />
            </button>

            {/* Mute / Unmute */}
            <button
              className="control-btn"
              onClick={toggleMute}
              title={volume === 0 ? 'Unmute' : 'Mute'}
              aria-label="Mute / unmute"
            >
              {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>

          {/* Volume Slider */}
          <div className="volume-slider-group">
            <Volume2 size={13} color="var(--text-muted)" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-range"
              aria-label="Volume slider"
            />
            <span className="volume-percent">{Math.round(volume * 100)}%</span>
          </div>
        </div>

        {/* Playlist Section (5 Songs) */}
        <div className="playlist-section">
          <div className="playlist-header">
            <span className="playlist-label">Select from 5 Festive Tracks</span>
            <span className="playlist-count">5 songs</span>
          </div>

          <div className="playlist-list">
            {TRACKS.map((t, idx) => {
              const isSelected = idx === currentTrackIndex;
              return (
                <div
                  key={t.id}
                  className={`playlist-item ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSelectTrack(idx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleSelectTrack(idx); }}
                >
                  <div className="item-left">
                    <span className="item-icon">{t.icon}</span>
                    <div className="item-info">
                      <span className="item-title">{t.title}</span>
                      <span className="item-subtitle">{t.subtitle}</span>
                    </div>
                  </div>

                  <div className="item-right">
                    <span className="track-duration-pill">{t.duration}</span>
                    {isSelected && isPlaying ? (
                      <span className="playing-eq">
                        <span className="p-bar" />
                        <span className="p-bar" />
                        <span className="p-bar" />
                      </span>
                    ) : (
                      <span className="item-play-icon">
                        <Play size={13} fill="currentColor" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

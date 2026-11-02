import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Flame, Send, Copy, Check, Download, Share2, X,
  Sparkles, Heart, Star, ArrowRight, ArrowLeft, Eye,
  MessageCircleHeart, Palette, Type
} from 'lucide-react';
import BokehBackground from './components/BokehBackground';
import DiyaSVG from './components/DiyaSVG';
import RangoliSVG from './components/RangoliSVG';
import GreetingView from './components/GreetingView';
import ShareModal from './components/ShareModal';
import PreviewModal from './components/PreviewModal';
import FirecrackerEffects from './components/FirecrackerEffects';
import MusicPlayer from './components/MusicPlayer';
import { encodeGreeting, decodeGreeting } from './utils/codec';

/* ─── Diya Style Options ─── */
const DIYA_STYLES = [
  { id: 'classic', label: 'Classic', desc: 'Traditional clay diya' },
  { id: 'ornate', label: 'Ornate', desc: 'Decorated festival diya' },
  { id: 'modern', label: 'Modern', desc: 'Sleek minimalist diya' },
  { id: 'lotus', label: 'Lotus', desc: 'Lotus-shaped petal diya' },
];

/* ─── Background Theme Options ─── */
const BG_THEMES = [
  { id: 'ethereal', label: 'Ethereal Glow', color: '#1a1005' },
  { id: 'festive', label: 'Festive Red', color: '#1a0808' },
  { id: 'celestial', label: 'Celestial Blue', color: '#0a0a1a' },
  { id: 'garden', label: 'Garden Green', color: '#0a1a0a' },
];

const TOTAL_STEPS = 3;

export default function App() {
  /* ─── Synchronously decode greeting from URL to eliminate render flash ─── */
  const initialGreeting = useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      const params = new URLSearchParams(window.location.search);
      const encoded = params.get('g');
      if (encoded) {
        const decoded = decodeGreeting(encoded);
        if (decoded && decoded.recipientName) {
          return decoded;
        }
      }
    } catch (e) {
      console.error('Failed to decode greeting:', e);
    }
    return null;
  }, []);

  const [greetingData, setGreetingData] = useState(initialGreeting);
  const [isCreator, setIsCreator] = useState(!initialGreeting);

  if (!isCreator && greetingData) {
    return (
      <>
        <GreetingView
          data={greetingData}
          onCreateOwn={() => {
            window.history.replaceState({}, '', window.location.pathname);
            setIsCreator(true);
            setGreetingData(null);
          }}
        />
        <MusicPlayer />
      </>
    );
  }

  return (
    <>
      <CreatorView />
      <MusicPlayer />
    </>
  );
}

/* ═══════════════════════════════════════════
   CREATOR VIEW — Step-by-step greeting builder
   ═══════════════════════════════════════════ */
function CreatorView() {
  const [step, setStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [direction, setDirection] = useState('forward');
  const [hasNavigated, setHasNavigated] = useState(false);
  const [burstCount, setBurstCount] = useState(0);

  /* Form State */
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [diyaStyle, setDiyaStyle] = useState('classic');
  const [bgTheme, setBgTheme] = useState('ethereal');
  const [diyas, setDiyas] = useState(3);

  const formData = useMemo(() => ({
    senderName,
    recipientName,
    message,
    diyaStyle,
    bgTheme,
    photo: null,
    diyas,
  }), [senderName, recipientName, message, diyaStyle, bgTheme, diyas]);

  const generateLink = useCallback(() => {
    const encoded = encodeGreeting(formData);
    const url = `${window.location.origin}${window.location.pathname}?g=${encoded}`;
    setShareUrl(url);
    setShowShare(true);
    setBurstCount(b => b + 1);
  }, [formData]);

  const canProceed = () => {
    switch (step) {
      case 0: return recipientName.trim().length > 0;
      case 1: return message.trim().length > 0;
      case 2: return true;
      default: return true;
    }
  };

  const goNext = () => {
    if (canProceed() && step < TOTAL_STEPS - 1) {
      setHasNavigated(true);
      setDirection('forward');
      setStep(s => s + 1);
      setBurstCount(b => b + 1); // trigger celebratory fireworks
    }
  };

  const goBack = () => {
    if (step > 0) {
      setHasNavigated(true);
      setDirection('backward');
      setStep(s => s - 1);
    }
  };

  return (
    <div className="greeting-bg theme-ethereal creator-page-wrapper">
      <BokehBackground />
      <FirecrackerEffects triggerBurst={burstCount} />

      {/* ─── Centralized Frame (Fits inside 1 single frame at 100% zoom) ─── */}
      <main className="creator-main-frame">
        {/* ─── Header ─── */}
        <header className="creator-header">
          <div className="creator-header-badge">
            <Flame size={15} color="var(--amber)" className="flame-flicker" />
            <span className="mono-text">
              Diwali Diya Greeting
            </span>
          </div>
          <h1 className="creator-title">
            Light a Diya for Someone Special
          </h1>
          <p className="creator-subtitle">
            Craft a personalized Diwali greeting and share the warmth
          </p>
        </header>

        {/* ─── Step Indicator ─── */}
        <div className="step-indicator" role="navigation" aria-label="Creation steps">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className={`step-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
              title={`Step ${i + 1}`}
            />
          ))}
        </div>

        {/* ─── Standardized Container (Unified width across all steps) ─── */}
        <div
          className={`creator-container ${!hasNavigated ? 'fade-in-initial' : (direction === 'forward' ? 'slide-in-right' : 'slide-in-left')}`}
          key={step}
        >
          {step === 0 && (
            <StepNames
              recipientName={recipientName}
              setRecipientName={setRecipientName}
              senderName={senderName}
              setSenderName={setSenderName}
              onEnterKey={goNext}
            />
          )}
          {step === 1 && (
            <StepMessage
              message={message}
              setMessage={setMessage}
            />
          )}
          {step === 2 && (
            <StepCustomize
              diyaStyle={diyaStyle}
              setDiyaStyle={setDiyaStyle}
              bgTheme={bgTheme}
              setBgTheme={setBgTheme}
              diyas={diyas}
              setDiyas={setDiyas}
            />
          )}

          {/* ─── Navigation ─── */}
          {step === 0 && (
            <div className="creator-nav creator-nav-center">
              <button
                className="btn btn-primary btn-next-step0"
                onClick={goNext}
                disabled={!canProceed()}
                style={{ opacity: canProceed() ? 1 : 0.45 }}
              >
                Next <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="creator-nav-stacked">
              {/* Row 1: Back and Next in the same line */}
              <div className="creator-nav-row">
                <button className="btn btn-ghost btn-nav-half" onClick={goBack}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  className="btn btn-primary btn-nav-half"
                  onClick={goNext}
                  disabled={!canProceed()}
                  style={{ opacity: canProceed() ? 1 : 0.5 }}
                >
                  Next <ArrowRight size={16} />
                </button>
              </div>

              {/* Row 2: Preview in the next div tag */}
              <div className="creator-nav-row">
                <button
                  className="btn btn-secondary btn-nav-full"
                  onClick={() => setShowPreview(true)}
                >
                  <Eye size={16} /> Preview Greeting
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="creator-nav-stacked">
              {/* Row 1: Back and Preview in the same line */}
              <div className="creator-nav-row">
                <button className="btn btn-ghost btn-nav-half" onClick={goBack}>
                  <ArrowLeft size={16} /> Back
                </button>
                <button
                  className="btn btn-secondary btn-nav-half"
                  onClick={() => setShowPreview(true)}
                >
                  <Eye size={16} /> Preview
                </button>
              </div>

              {/* Row 2: Generate & Share in the lower line div */}
              <div className="creator-nav-row">
                <button
                  className="btn btn-primary btn-generate btn-nav-full"
                  onClick={generateLink}
                  disabled={!recipientName.trim()}
                  style={{ opacity: recipientName.trim() ? 1 : 0.5 }}
                >
                  <Share2 size={16} /> Generate & Share
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ─── Zoomable, Fixed-Size Preview Modal ─── */}
      {showPreview && (
        <PreviewModal
          data={formData}
          onClose={() => setShowPreview(false)}
        />
      )}

      {/* ─── Share Modal ─── */}
      {showShare && (
        <ShareModal
          url={shareUrl}
          data={formData}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   STEP 1: RECIPIENT & SENDER NAMES
   ═══════════════════════════════════════════ */
function StepNames({ recipientName, setRecipientName, senderName, setSenderName, onEnterKey }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && recipientName.trim()) {
      onEnterKey();
    }
  };

  return (
    <div className="step-card glass">
      <div className="step-card-header">
        <div className="step-icon-wrapper">
          <MessageCircleHeart size={20} color="var(--amber)" />
        </div>
        <div>
          <h2 className="step-card-title">Who's this greeting for?</h2>
          <p className="step-card-desc">Enter their name to personalize their digital diya</p>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="recipient-input">Recipient's Name *</label>
        <input
          id="recipient-input"
          className="input-field"
          type="text"
          placeholder="e.g. Mom, Dad ..."
          value={recipientName}
          onChange={e => setRecipientName(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={50}
          autoFocus
        />
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label" htmlFor="sender-input">Your Name (optional)</label>
        <input
          id="sender-input"
          className="input-field"
          type="text"
          placeholder="e.g. Your loving brother ..."
          value={senderName}
          onChange={e => setSenderName(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={50}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   STEP 2: HEARTFELT MESSAGE
   ═══════════════════════════════════════════ */
function StepMessage({ message, setMessage }) {
  const presetMessages = [
    "May the divine light of Diwali spread into your life peace, prosperity, happiness, and good health. Wishing you a very Happy Diwali! 🪔✨",
    "This Diwali, may your life be as colorful and bright as the rangolis, as sweet as the mithai, and as sparkling as the diyas. Happy Diwali! 🎆",
    "May the festival of lights illuminate your path with joy, health, and prosperity. Sending you warmth and love this Diwali season! 💛🪔",
    "Wishing you a Diwali filled with laughter, togetherness, and the gentle glow of countless diyas. May every moment sparkle with joy! ✨",
  ];

  return (
    <div className="step-card glass">
      <div className="step-card-header">
        <div className="step-icon-wrapper">
          <Type size={20} color="var(--amber)" />
        </div>
        <div>
          <h2 className="step-card-title">Write your message</h2>
          <p className="step-card-desc">Express your heartfelt Diwali wishes</p>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="message-textarea">Personal Message *</label>
        <textarea
          id="message-textarea"
          className="input-field textarea-field"
          placeholder="Write something heartfelt..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          maxLength={500}
          rows={3}
        />
        <span className="char-counter">
          {message.length}/500
        </span>
      </div>

      <div className="preset-section">
        <p className="preset-label">
          <Sparkles size={13} color="var(--amber)" /> Quick presets (click to apply):
        </p>
        <div className="preset-list">
          {presetMessages.map((msg, i) => (
            <button
              key={i}
              type="button"
              className={`preset-btn ${message === msg ? 'active' : ''}`}
              onClick={() => setMessage(msg)}
            >
              {msg}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   STEP 3: CUSTOMIZE (DIYA, THEME & COUNT)
   ═══════════════════════════════════════════ */
function StepCustomize({ diyaStyle, setDiyaStyle, bgTheme, setBgTheme, diyas, setDiyas }) {
  return (
    <div className="step-card glass">
      <div className="step-card-header">
        <div className="step-icon-wrapper">
          <Palette size={20} color="var(--amber)" />
        </div>
        <div>
          <h2 className="step-card-title">Customize your greeting</h2>
          <p className="step-card-desc">Choose diya style, background aura & count</p>
        </div>
      </div>

      {/* Diya Style Selection */}
      <div className="form-group">
        <label className="form-label">Diya Style</label>
        <div className="select-grid">
          {DIYA_STYLES.map(s => (
            <div
              key={s.id}
              className={`select-card ${diyaStyle === s.id ? 'active' : ''}`}
              onClick={() => setDiyaStyle(s.id)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setDiyaStyle(s.id); }}
            >
              <div className="select-card-icon">
                <DiyaSVG style={s.id} size={36} animate={false} />
              </div>
              <span className="select-card-label">{s.label}</span>
              <span className="select-card-desc">{s.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Background Theme */}
      <div className="form-group">
        <label className="form-label">Background Theme</label>
        <div className="select-grid">
          {BG_THEMES.map(t => (
            <div
              key={t.id}
              className={`select-card ${bgTheme === t.id ? 'active' : ''}`}
              onClick={() => setBgTheme(t.id)}
              role="button"
              tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setBgTheme(t.id); }}
            >
              <div
                className="select-card-swatch"
                style={{
                  background: `radial-gradient(circle, ${t.color}, var(--bg-void))`,
                }}
              />
              <span className="select-card-label">{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Number of Diyas Slider */}
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label" htmlFor="diya-slider">
          Number of Diyas: <span className="diya-count">{diyas} 🪔</span>
        </label>
        <input
          id="diya-slider"
          type="range"
          min={1}
          max={7}
          value={diyas}
          onChange={e => setDiyas(Number(e.target.value))}
          className="range-slider"
        />
        <div className="range-labels">
          <span>1 diya</span>
          <span>4 diyas</span>
          <span>7 diyas</span>
        </div>
      </div>

      {/* Ready hint */}
      <div className="ready-hint">
        <Sparkles size={14} color="var(--amber)" style={{ flexShrink: 0, marginTop: '2px' }} />
        <p>
          Your greeting is ready! Click <strong>"Generate & Share"</strong> below to copy your link, share directly on WhatsApp, or download a high-res image.
        </p>
      </div>
    </div>
  );
}

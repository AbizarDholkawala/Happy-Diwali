import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { audioEngine } from '../utils/audioEngine';

/* ─── Shape Types & Royal Diwali Palettes ─── */
const PALETTES = {
  square: {
    name: 'Ruby Square',
    theme: 'Ruby Festive Red',
    boxBg: 'linear-gradient(180deg, #96102C 0%, #70071C 50%, #4A0311 100%)',
    lidBg: 'linear-gradient(180deg, #B81838 0%, #8E0E27 100%)',
    ribbon: 'linear-gradient(90deg, #B38700 0%, #FFDF6B 25%, #FFFCE8 50%, #FFDF6B 75%, #B38700 100%)',
    ribbonH: 'linear-gradient(180deg, #B38700 0%, #FFDF6B 25%, #FFFCE8 50%, #FFDF6B 75%, #B38700 100%)',
    glow: 'rgba(230, 20, 60, 0.75)',
    accent: '#FFD700',
    primary: '#E82A52',
  },
  rectangle: {
    name: 'Emerald Hamper',
    theme: 'Emerald Royal Jade',
    boxBg: 'linear-gradient(180deg, #0E6B40 0%, #0A5230 50%, #05331E 100%)',
    lidBg: 'linear-gradient(180deg, #138550 0%, #0C613A 100%)',
    ribbon: 'linear-gradient(90deg, #B38700 0%, #FFDF6B 25%, #FFFCE8 50%, #FFDF6B 75%, #B38700 100%)',
    ribbonH: 'linear-gradient(180deg, #B38700 0%, #FFDF6B 25%, #FFFCE8 50%, #FFDF6B 75%, #B38700 100%)',
    glow: 'rgba(16, 185, 129, 0.75)',
    accent: '#F5C542',
    primary: '#10B981',
  },
  round: {
    name: 'Saffron Round',
    theme: 'Imperial Royal Saffron',
    boxBg: 'linear-gradient(180deg, #C25100 0%, #993D00 50%, #6E2B00 100%)',
    lidBg: 'linear-gradient(180deg, #E66200 0%, #B84700 100%)',
    ribbon: 'linear-gradient(90deg, #B38700 0%, #FFDF6B 25%, #FFFCE8 50%, #FFDF6B 75%, #B38700 100%)',
    ribbonH: 'linear-gradient(180deg, #B38700 0%, #FFDF6B 25%, #FFFCE8 50%, #FFDF6B 75%, #B38700 100%)',
    glow: 'rgba(245, 166, 35, 0.85)',
    accent: '#FFD180',
    primary: '#F5A623',
  },
  heart: {
    name: 'Prem Heart',
    theme: 'Velvet Crimson Heart',
    boxBg: 'linear-gradient(180deg, #9C115A 0%, #780B44 50%, #52052D 100%)',
    lidBg: 'linear-gradient(180deg, #BD1A71 0%, #941155 100%)',
    ribbon: 'linear-gradient(90deg, #B38700 0%, #FFDF6B 25%, #FFFCE8 50%, #FFDF6B 75%, #B38700 100%)',
    ribbonH: 'linear-gradient(180deg, #B38700 0%, #FFDF6B 25%, #FFFCE8 50%, #FFDF6B 75%, #B38700 100%)',
    glow: 'rgba(235, 45, 125, 0.75)',
    accent: '#FF85BA',
    primary: '#E82A7A',
  },
  star: {
    name: 'Shubh Star',
    theme: 'Celestial Sapphire Gold',
    boxBg: 'linear-gradient(180deg, #184A94 0%, #11366E 50%, #0B2347 100%)',
    lidBg: 'linear-gradient(180deg, #205FB8 0%, #16478E 100%)',
    ribbon: 'linear-gradient(90deg, #B38700 0%, #FFDF6B 25%, #FFFCE8 50%, #FFDF6B 75%, #B38700 100%)',
    ribbonH: 'linear-gradient(180deg, #B38700 0%, #FFDF6B 25%, #FFFCE8 50%, #FFDF6B 75%, #B38700 100%)',
    glow: 'rgba(56, 140, 255, 0.75)',
    accent: '#FFD700',
    primary: '#3B82F6',
  },
};

/* ─── Embedded Gold Foil Mandala SVG Pattern ─── */
function GoldMandalaSVG({ size = 110, opacity = 0.35 }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className="gold-mandala-foil"
      style={{ opacity, pointerEvents: 'none' }}
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke="#FFD700" strokeWidth="0.8" strokeDasharray="2,2"/>
      <circle cx="50" cy="50" r="42" fill="none" stroke="#FFD700" strokeWidth="1"/>
      <circle cx="50" cy="50" r="34" fill="none" stroke="#FFD700" strokeWidth="0.6"/>
      <circle cx="50" cy="50" r="26" fill="none" stroke="#FFD700" strokeWidth="0.8"/>
      <circle cx="50" cy="50" r="14" fill="none" stroke="#FFD700" strokeWidth="1.2"/>
      <circle cx="50" cy="50" r="5" fill="#FFD700" opacity="0.6"/>
      {Array.from({ length: 8 }, (_, i) => {
        const angle = i * 45;
        return (
          <g key={i} transform={`rotate(${angle} 50 50)`}>
            <path
              d="M50 8 C53 22 62 30 50 44 C38 30 47 22 50 8Z"
              fill="none"
              stroke="#FFD700"
              strokeWidth="0.9"
            />
            <circle cx="50" cy="20" r="1.5" fill="#FFD700"/>
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Iconic 3D Top Gift Ribbon Bow with Loops & Tails ─── */
function TopGiftRibbonBow({ isUnwrapping }) {
  return (
    <div className={`top-gift-bow-wrapper ${isUnwrapping ? 'bow-unravel' : ''}`}>
      <svg
        viewBox="0 0 180 100"
        width="170"
        height="95"
        className="top-gift-bow-svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="bowGoldLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C99700" />
            <stop offset="20%" stopColor="#FFDE59" />
            <stop offset="50%" stopColor="#FFFCE8" />
            <stop offset="80%" stopColor="#FFDE59" />
            <stop offset="100%" stopColor="#9E7300" />
          </linearGradient>
          <linearGradient id="bowGoldDark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E6B800" />
            <stop offset="100%" stopColor="#6E4D00" />
          </linearGradient>
          <filter id="bowGlowShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000000" floodOpacity="0.55"/>
          </filter>
        </defs>

        {/* ── Flowing Ribbon Tails (Cascading down over lid) ── */}
        <path
          d="M84 52 Q68 72 52 98 L66 102 Q78 78 88 56 Z"
          fill="url(#bowGoldDark)"
          filter="url(#bowGlowShadow)"
        />
        <path
          d="M96 52 Q112 72 128 98 L114 102 Q102 78 92 56 Z"
          fill="url(#bowGoldDark)"
          filter="url(#bowGlowShadow)"
        />

        {/* ── Upper Diagonal Depth Loops ── */}
        <path
          d="M90 50 C74 25 58 14 62 7 C66 1 82 20 90 45 Z"
          fill="url(#bowGoldDark)"
        />
        <path
          d="M90 50 C106 25 122 14 118 7 C114 1 98 20 90 45 Z"
          fill="url(#bowGoldDark)"
        />

        {/* ── Main Left Satin Loop ── */}
        <path
          d="M88 50 C56 16 14 18 10 34 C6 50 48 58 84 52 Z"
          fill="url(#bowGoldLight)"
          filter="url(#bowGlowShadow)"
        />
        {/* Left Inside Fold Shadow */}
        <path
          d="M34 32 C32 26 52 24 70 38 C54 38 40 36 34 32 Z"
          fill="#5C4100"
          opacity="0.65"
        />

        {/* ── Main Right Satin Loop ── */}
        <path
          d="M92 50 C124 16 166 18 170 34 C174 50 132 58 96 52 Z"
          fill="url(#bowGoldLight)"
          filter="url(#bowGlowShadow)"
        />
        {/* Right Inside Fold Shadow */}
        <path
          d="M146 32 C148 26 128 24 110 38 C126 38 140 36 146 32 Z"
          fill="#5C4100"
          opacity="0.65"
        />

        {/* ── Center Knot with Specular Highlight & Gold Bead ── */}
        <circle cx="90" cy="50" r="16" fill="url(#bowGoldLight)" filter="url(#bowGlowShadow)"/>
        <circle cx="90" cy="50" r="10" fill="url(#bowGoldDark)"/>
        <circle cx="87" cy="47" r="4" fill="#FFFFFF" opacity="0.85"/>
      </svg>
    </div>
  );
}

/* ─── Confetti & Celebration Fireworks Canvas (On Unbox) ─── */
function UnboxCelebrationCanvas({ active, palette }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const particles = [];
    const colors = [
      '#FFD700', '#FFA500', '#FF4500', '#FF1493',
      '#00E5FF', '#76FF03', '#FFFFFF', '#FFE082',
      palette.primary, palette.accent,
    ];

    const originX = width / 2;
    const originY = height / 2 - 30;

    for (let i = 0; i < 160; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 15;
      const size = 3 + Math.random() * 6;
      const type = Math.random() > 0.4 ? 'confetti' : (Math.random() > 0.5 ? 'spark' : 'petal');

      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (4 + Math.random() * 6),
        gravity: 0.22 + Math.random() * 0.15,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        color: colors[Math.floor(Math.random() * colors.length)],
        size,
        life: 1,
        decay: 0.012 + Math.random() * 0.018,
        type,
      });
    }

    let animId;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.rotation += p.vRot;
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        if (p.type === 'confetti') {
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size, -p.size * 0.5, p.size * 2, p.size);
        } else if (p.type === 'petal') {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.4, p.size * 0.8, 0, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        } else {
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      if (particles.length > 0) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [active, palette]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="unbox-celebration-canvas"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 250,
        pointerEvents: 'none',
        width: '100vw',
        height: '100vh',
      }}
    />
  );
}

/* ════════════════════════════════════════════════════════════════════
   MAIN COMPONENT: GiftBoxReveal
   Upright, Non-slanted Symmetrical 3D Gift Box with Iconic Top Ribbon
   ════════════════════════════════════════════════════════════════════ */
export default function GiftBoxReveal({ recipientName, boxStyle, onOpen }) {
  const [isOpened, setIsOpened] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const hasTriggeredRef = useRef(false);

  // Directly respect user-chosen boxStyle (default to 'square')
  const shape = boxStyle || 'square';
  const palette = PALETTES[shape] || PALETTES.square;

  /* Tap / Click Handler: Guaranteed Audio Unlock + Explosive Unboxing */
  const handleTapToOpen = useCallback(() => {
    if (hasTriggeredRef.current || isOpened) return;
    hasTriggeredRef.current = true;

    // Trigger audio immediately in user activation call stack
    if (audioEngine) {
      audioEngine.play().catch(() => {});
    }

    setIsOpened(true);
    setShowCelebration(true);

    setTimeout(() => {
      setIsExiting(true);
    }, 1100);

    setTimeout(() => {
      onOpen();
    }, 1650);
  }, [isOpened, onOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleTapToOpen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTapToOpen]);

  return (
    <div
      className={`gift-stage-overlay ${isExiting ? 'fade-stage-out' : ''}`}
      onClick={handleTapToOpen}
      onTouchEnd={(e) => {
        e.preventDefault();
        handleTapToOpen();
      }}
      role="button"
      tabIndex={0}
      aria-label="Tap to unlock your Diwali gift surprise"
    >
      {/* Background Divine Aura */}
      <div
        className="divine-radial-aura"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${palette.glow} 0%, rgba(10,10,15,0.92) 65%, var(--bg-void) 100%)`,
        }}
      />

      {/* Rotating Celestial Sunburst Rays */}
      <div className={`divine-god-rays ${isOpened ? 'burst-rays' : ''}`} />

      {/* Drifting Golden Embers */}
      <div className="gift-ambient-sparks">
        {Array.from({ length: 14 }, (_, i) => (
          <span
            key={i}
            className="ambient-spark-dot"
            style={{
              left: `${10 + (i * 6.5) + (Math.sin(i) * 5)}%`,
              top: `${15 + (i * 5.5) + (Math.cos(i) * 10)}%`,
              animationDelay: `${i * 0.28}s`,
              animationDuration: `${2.2 + (i % 3) * 0.7}s`,
            }}
          />
        ))}
      </div>

      {/* ─── Perfectly Upright, Symmetrical Gift Box Presentation ─── */}
      <div className="gift-upright-stage">
        {/* Floor Shadow beneath box */}
        <div className={`gift-floor-shadow ${isOpened ? 'shadow-vanish' : ''}`} />

        {/* Floor Rangoli Mandala */}
        <div className="gift-floor-mandala" />

        {/* ── Upright Gift Box ── */}
        <div
          className={`gift-box-upright ${shape}-box ${isOpened ? 'box-burst-open' : 'duo-wobble-upright'}`}
        >
          {/* Seam Light Glow between lid and body */}
          <div className="box-seam-light" />

          {/* ── BOX LID ASSEMBLY (Separates and flies upwards) ── */}
          <div className={`gift-lid-unit ${isOpened ? 'lid-pop-away' : ''}`}>
            {/* Top Gift Ribbon Bow (Crisp, Plush Satin Loops + Center Knot) */}
            <TopGiftRibbonBow isUnwrapping={isOpened} />

            {/* Lid Main Box Face */}
            <div
              className="lid-card-face"
              style={{ background: palette.lidBg }}
            >
              <div className="face-specular-highlight" />

              {/* Vertical Ribbon through Lid */}
              <div
                className="ribbon-vertical ribbon-lid"
                style={{ background: palette.ribbon }}
              />

              {/* Gold Trim Bottom Lip */}
              <div className="lid-bottom-gold-lip" />

              {/* Gold Filigree on Lid */}
              <span className="corner-filigree top-left">❦</span>
              <span className="corner-filigree top-right">❦</span>
            </div>
          </div>

          {/* ── BOX BODY ASSEMBLY ── */}
          <div
            className="gift-body-unit"
            style={{ background: palette.boxBg }}
          >
            <div className="face-specular-highlight" />

            {/* Embossed Gold Mandala */}
            <GoldMandalaSVG size={120} opacity={0.32} />

            {/* Cross Ribbons on Body */}
            <div
              className="ribbon-vertical ribbon-body"
              style={{ background: palette.ribbon }}
            />
            <div
              className="ribbon-horizontal ribbon-body"
              style={{ background: palette.ribbonH }}
            />

            {/* Brass Filigree Corners */}
            <span className="corner-filigree btm-left">❦</span>
            <span className="corner-filigree btm-right">❦</span>

            {/* Divine Internal Light Shaft */}
            <div
              className={`box-inner-light ${isOpened ? 'beam-erupt' : ''}`}
              style={{
                background: `radial-gradient(circle at 50% 50%, #FFFFFF 0%, ${palette.accent} 45%, ${palette.primary} 80%, transparent 100%)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Confetti Celebration Fireworks */}
      <UnboxCelebrationCanvas active={showCelebration} palette={palette} />

      {/* Bottom Interactive Prompt & Badges */}
      {!isOpened && (
        <div className="gift-instruction-deck">
          <div className="gift-pulse-pill">
            <span className="gift-pill-emoji">🎁</span>
            <span className="gift-pill-text">
              Tap to open your Diwali surprise!
            </span>
            <span className="gift-pill-sparkle">✨</span>
          </div>

          {recipientName && (
            <div className="gift-personalized-tag">
              <span className="tag-script">Specially crafted for</span>
              <h2 className="tag-recipient-name">{recipientName}</h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

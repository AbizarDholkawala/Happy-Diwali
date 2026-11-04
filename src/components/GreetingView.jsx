import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Flame, Sparkles, Heart, ArrowRight } from 'lucide-react';
import DiyaSVG from './DiyaSVG';
import RangoliSVG from './RangoliSVG';
import BokehBackground from './BokehBackground';
import FirecrackerEffects from './FirecrackerEffects';

/* ─── Firework Particle System ─── */
function FireworkCanvas({ active }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = [
      '#FFD180', '#F5A623', '#E8732A', '#FF6B6B',
      '#FFE082', '#FFC107', '#FF9800', '#FFAB40',
      '#FF7043', '#FFD54F', '#FFB74D', '#FFFFFF',
    ];

    function createBurst(x, y) {
      const count = 35 + Math.floor(Math.random() * 30);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
        const speed = 2.5 + Math.random() * 5;
        const life = 70 + Math.random() * 50;
        particlesRef.current.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life,
          maxLife: life,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 1.5 + Math.random() * 2.5,
          trail: [],
          sparkle: Math.random() > 0.7, // some particles sparkle
        });
      }
    }

    // Launch bursts staggered
    let burstCount = 0;
    const maxBursts = 10;
    const launchBurst = () => {
      if (burstCount >= maxBursts) return;
      burstCount++;
      const x = 80 + Math.random() * (window.innerWidth - 160);
      const y = 60 + Math.random() * (window.innerHeight * 0.45);
      createBurst(x, y);
      if (burstCount < maxBursts) {
        setTimeout(launchBurst, 300 + Math.random() * 700);
      }
    };
    launchBurst();

    function animate() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.035;
        p.vx *= 0.99;
        p.life--;

        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 8) p.trail.shift();

        const alpha = Math.max(0, p.life / p.maxLife);

        // Trail
        if (p.trail.length > 1) {
          ctx.globalAlpha = alpha * 0.25;
          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.size * 0.4;
          ctx.beginPath();
          ctx.moveTo(p.trail[0].x, p.trail[0].y);
          for (let t = 1; t < p.trail.length; t++) {
            ctx.lineTo(p.trail[t].x, p.trail[t].y);
          }
          ctx.stroke();
        }

        // Particle
        const drawSize = p.sparkle
          ? p.size * alpha * (0.5 + Math.random() * 0.5)
          : p.size * alpha;

        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, drawSize, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Glow
        ctx.globalAlpha = alpha * 0.12;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4 * alpha, 0, Math.PI * 2);
        ctx.fill();

        if (p.life <= 0) particles.splice(i, 1);
      }
      ctx.globalAlpha = 1;
      if (particles.length > 0) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      particlesRef.current = [];
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        pointerEvents: 'none',
        width: '100vw',
        height: '100vh',
      }}
    />
  );
}

/* ─── Floating Lantern Effect ─── */
function FloatingLanterns({ count = 5 }) {
  const lanterns = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: 8 + Math.random() * 84,
      size: 6 + Math.random() * 10,
      duration: 18 + Math.random() * 14,
      delay: i * 2 + Math.random() * 4,
      opacity: 0.12 + Math.random() * 0.18,
      drift: (Math.random() - 0.5) * 40,
    }))
    , [count]);

  return (
    <>
      {lanterns.map(l => (
        <div
          key={l.id}
          className="floating-lantern"
          style={{
            left: `${l.x}%`,
            width: `${l.size}px`,
            height: `${l.size * 1.4}px`,
            animationDuration: `${l.duration}s`,
            animationDelay: `${l.delay}s`,
            opacity: l.opacity,
            '--drift': `${l.drift}px`,
          }}
        />
      ))}
    </>
  );
}

/**
 * GreetingView — The cinematic greeting that the recipient sees.
 * isPreview: smaller, embedded view in preview modal
 * isCapture: sized for PNG export (1080×1920)
 */
export default function GreetingView({ data, onCreateOwn, isPreview = false, isCapture = false }) {
  const {
    senderName = '',
    recipientName = 'Friend',
    message = '',
    diyaStyle = 'classic',
    bgTheme = 'ethereal',
    photo = null,
    diyas = 3,
  } = data || {};

  const [phase, setPhase] = useState('dark');
  const [typedMessage, setTypedMessage] = useState('');
  const [showFullMessage, setShowFullMessage] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const [hasTapped, setHasTapped] = useState(false);
  const containerRef = useRef(null);

  const revealed = phase === 'revealed';
  const skipAnimations = isPreview || isCapture;

  /* ─── Tap Listener for Mini Note & Firecracker Love ─── */
  useEffect(() => {
    if (skipAnimations) return;
    const handleTap = () => {
      setHasTapped(true);
    };
    window.addEventListener('pointerdown', handleTap, { passive: true });
    window.addEventListener('touchend', handleTap, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handleTap);
      window.removeEventListener('touchend', handleTap);
    };
  }, [skipAnimations]);

  /* ─── Grand Entrance: Dramatic lighting ceremony ─── */
  useEffect(() => {
    if (skipAnimations) {
      setPhase('revealed');
      setShowFullMessage(true);
      setTypedMessage(message);
      return;
    }
    const t1 = setTimeout(() => setPhase('lighting'), 600);
    const t2 = setTimeout(() => setPhase('revealed'), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [skipAnimations, message]);

  /* ─── Typewriter Effect for Message ─── */
  useEffect(() => {
    if (skipAnimations) return; // Already set above
    if (!revealed || !message) return;
    let idx = 0;
    let interval;
    setTypedMessage('');
    const startDelay = setTimeout(() => {
      interval = setInterval(() => {
        idx++;
        setTypedMessage(message.slice(0, idx));
        if (idx >= message.length) {
          clearInterval(interval);
          setShowFullMessage(true);
          setTimeout(() => setShowFireworks(true), 400);
        }
      }, 25);
    }, 800);
    return () => {
      clearTimeout(startDelay);
      if (interval) clearInterval(interval);
    };
  }, [revealed, message, skipAnimations]);

  /* ─── Sparkle Effects ─── */
  useEffect(() => {
    if (!revealed || skipAnimations) return;
    const interval = setInterval(() => {
      setSparkles(prev => {
        const now = Date.now();
        const filtered = prev.filter(s => now - s.created < 2500);
        if (filtered.length < 12) {
          filtered.push({
            id: now + Math.random(),
            x: 5 + Math.random() * 90,
            y: 5 + Math.random() * 80,
            size: 2 + Math.random() * 4,
            created: now,
            color: ['#FFD180', '#F5A623', '#FFE082', '#FFFFFF'][Math.floor(Math.random() * 4)],
          });
        }
        return filtered;
      });
    }, 280);
    return () => clearInterval(interval);
  }, [revealed, skipAnimations]);

  /* ─── Layout the diyas in an arc ─── */
  const diyaPositions = useMemo(() => {
    const count = Math.min(diyas, 7);
    const positions = [];
    if (count === 1) {
      positions.push({ x: 50, scale: 1.2 });
    } else {
      const spread = Math.min(80, count * 14);
      const startX = 50 - spread / 2;
      for (let i = 0; i < count; i++) {
        const x = startX + (spread / (count - 1)) * i;
        const distFromCenter = Math.abs(x - 50) / (spread / 2);
        const scale = 0.7 + (1 - distFromCenter) * 0.5;
        positions.push({ x, scale });
      }
    }
    return positions;
  }, [diyas]);

  const themeClass = `theme-${bgTheme}`;
  const isLit = phase === 'lighting' || phase === 'revealed';

  // For capture mode, use fixed dimensions
  const containerStyle = isCapture ? {
    width: '1080px',
    height: '1920px',
    padding: '4rem 3rem',
    textAlign: 'center',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  } : isPreview ? {
    width: '100%',
    height: '100%',
    minHeight: 'auto',
    padding: '1.25rem 1rem',
    textAlign: 'center',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  } : {
    minHeight: '100dvh',
    padding: '2rem 1.5rem',
    textAlign: 'center',
    position: 'relative',
  };

  const diyaSize = isCapture ? 100 : isPreview ? 46 : undefined; // responsive via CSS otherwise

  return (
    <div
      ref={containerRef}
      id={isCapture ? 'capture-render' : 'greeting-capture'}
      className={`greeting-bg ${themeClass} ${isCapture ? '' : 'greeting-responsive'} ${isPreview ? 'preview-card-bg' : ''}`}
      style={containerStyle}
    >
      <BokehBackground intensity={revealed ? 1.3 : 0.3} />

      {/* Interactive Firecrackers on Tap/Click & Ambient Rockets */}
      {!skipAnimations && <FirecrackerEffects />}

      {/* Fireworks */}
      {!skipAnimations && <FireworkCanvas active={showFireworks} />}

      {/* Floating Lanterns */}
      {revealed && !skipAnimations && <FloatingLanterns count={5} />}

      {/* Rangoli */}
      <div className="rangoli-pattern" style={{
        bottom: isPreview ? '-45px' : '-80px',
        opacity: revealed ? 0.06 : 0,
        transition: skipAnimations ? 'none' : 'opacity 2s ease 0.5s',
      }}>
        <RangoliSVG size={isPreview ? 220 : isCapture ? 500 : 380} opacity={1} />
      </div>

      {/* Sparkles */}
      {sparkles.map(s => (
        <div
          key={s.id}
          className="sparkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: s.color,
            boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
          }}
        />
      ))}

      {/* ─── Content ─── */}
      <div className={`greeting-content ${isPreview ? 'preview-mode' : ''}`}>

        {/* Top Accent */}
        <div className="greeting-fade-in" style={{
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(-20px)',
          transition: skipAnimations ? 'none' : 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s',
        }}>
          <span className="greeting-subheading">
            <span className="greeting-line" />
            <span className="greeting-hindi-text">शुभ दीपावली</span>
            <span className="greeting-line" />
          </span>
        </div>

        {/* Title */}
        <div className="greeting-fade-in" style={{
          opacity: isLit ? 1 : 0,
          transform: isLit ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
          transition: skipAnimations ? 'none' : 'all 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s',
        }}>
          <h1 className={`greeting-title ${isCapture ? 'capture' : ''}`}>
            Happy Diwali
          </h1>
          <h2 className={`greeting-recipient ${isCapture ? 'capture' : ''}`} style={{
            opacity: revealed ? 1 : 0,
            transition: skipAnimations ? 'none' : 'opacity 0.8s ease 0.5s',
          }}>
            <span className="greeting-dear-word">Dear</span>
            <span className="greeting-name-highlight">{recipientName}</span>
          </h2>
        </div>

        {/* Photo */}
        {photo && (
          <div className="greeting-photo" style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
            transition: skipAnimations ? 'none' : 'all 1s ease 0.7s',
          }}>
            <img src={photo} alt="" />
          </div>
        )}

        {/* Divider */}
        <div className="greeting-divider" style={{
          opacity: revealed ? 0.4 : 0,
          transition: skipAnimations ? 'none' : 'opacity 1.2s ease 0.6s',
        }}>
          <span className="greeting-line-long" />
          <span className="greeting-diamond">✦</span>
          <span className="greeting-line-long" />
        </div>

        {/* Diyas Row */}
        <div className="greeting-diyas-row" style={{
          opacity: isLit ? 1 : 0,
          transform: isLit ? 'translateY(0)' : 'translateY(40px)',
          transition: skipAnimations ? 'none' : 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s',
        }}>
          {diyaPositions.map((pos, i) => (
            <div
              key={i}
              className="greeting-diya-wrapper"
              style={{
                transform: `scale(${pos.scale})`,
                animation: revealed && !skipAnimations ? `float ${3 + i * 0.5}s ease-in-out infinite` : 'none',
                animationDelay: `${i * 0.3}s`,
                opacity: revealed ? 1 : (phase === 'lighting' ? 0.5 : 0),
                transition: skipAnimations ? 'none' : 'opacity 0.5s ease',
              }}
            >
              <DiyaSVG
                style={diyaStyle}
                size={diyaSize || 68}
                animate={revealed && !isCapture}
              />
            </div>
          ))}
        </div>

        {/* Glow reflection */}
        <div className="greeting-glow" style={{
          width: `${Math.min(diyas * 60, 350)}px`,
          opacity: revealed ? 0.5 : 0,
          transition: skipAnimations ? 'none' : 'opacity 1.5s ease 0.8s',
        }} />

        {/* Message */}
        <div className="greeting-message-wrapper" style={{
          opacity: revealed ? 1 : 0,
          transition: skipAnimations ? 'none' : 'opacity 0.8s ease 1.2s',
        }}>
          <div className="greeting-message-card">
            <p className="greeting-message-text">
              {showFullMessage ? message : typedMessage}
              {!showFullMessage && revealed && !skipAnimations && (
                <span className="typing-cursor" />
              )}
            </p>
          </div>
        </div>

        {/* Sender */}
        {senderName && (
          <div className="greeting-sender" style={{
            opacity: showFullMessage ? 1 : 0,
            transform: showFullMessage ? 'translateY(0)' : 'translateY(10px)',
            transition: skipAnimations ? 'none' : 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}>
            <Heart size={14} color="var(--saffron)" fill="var(--saffron)" style={{ opacity: 0.7 }} />
            <span>{senderName}</span>
          </div>
        )}

        {/* Mini Note: Show some love by tapping the screen */}
        {!isPreview && !isCapture && (
          <div className={`tap-love-note ${hasTapped ? 'tapped' : ''}`}>
            <span className="tap-love-sparkle">✨</span>
            <span className="tap-love-text">
              {hasTapped ? 'Spreading Diwali Love! ' : 'Show some love by tapping the screen'}
            </span>
          </div>
        )}

        {/* Bottom text */}
        <div className="greeting-footer" style={{
          opacity: showFullMessage ? 1 : 0,
          transition: skipAnimations ? 'none' : 'opacity 1s ease 0.5s',
        }}>
          <Sparkles size={13} color="var(--amber)" style={{ opacity: 0.5 }} />
          <span>May your life shine with prosperity & joy</span>
          <Sparkles size={13} color="var(--amber)" style={{ opacity: 0.5 }} />
        </div>

        {/* CTA */}
        {!isPreview && !isCapture && (
          <div className="greeting-cta" style={{
            opacity: showFullMessage ? 1 : 0,
            transform: showFullMessage ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.8s ease 0.5s',
          }}>
            <button className="btn btn-primary btn-cta-glow" onClick={onCreateOwn}>
              <Flame size={16} /> Light a Diya for Someone
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useRef, useCallback } from 'react';

/**
 * FirecrackerEffects
 * Ambient fireworks, click/tap sparklers, and navigation celebration bursts.
 * Fully optimized for both Android/touchscreens and Desktop mouse clicks.
 */
export default function FirecrackerEffects({ triggerBurst = 0 }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rocketsRef = useRef([]);
  const animFrameRef = useRef(null);

  const colors = [
    '#FFD180', '#F5A623', '#E8732A', '#FF6B6B',
    '#FFE082', '#FFC107', '#FF9800', '#FFAB40',
    '#FFFFFF', '#FF80AB', '#FFD54F',
  ];

  const createBurst = useCallback((x, y, count = 28, speedMult = 1) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = (2 + Math.random() * 4) * speedMult;
      const life = 45 + Math.random() * 35;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life,
        maxLife: life,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 1.5 + Math.random() * 2,
        twinkle: Math.random() > 0.5,
      });
    }
  }, []);

  // Launch ambient celebratory rocket
  const launchRocket = useCallback(() => {
    const startX = 60 + Math.random() * (window.innerWidth - 120);
    const targetY = 80 + Math.random() * (window.innerHeight * 0.45);
    const speed = 7 + Math.random() * 4;
    rocketsRef.current.push({
      x: startX,
      y: window.innerHeight + 10,
      targetY,
      speed,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }, []);

  // Trigger burst when prop changes
  useEffect(() => {
    if (triggerBurst > 0) {
      createBurst(window.innerWidth / 2, window.innerHeight * 0.35, 45, 1.4);
      setTimeout(() => {
        createBurst(window.innerWidth * 0.35, window.innerHeight * 0.28, 30, 1.1);
      }, 180);
      setTimeout(() => {
        createBurst(window.innerWidth * 0.65, window.innerHeight * 0.30, 30, 1.1);
      }, 350);
    }
  }, [triggerBurst, createBurst]);

  useEffect(() => {
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

    // Interactive sparkler burst on click/tap (Android & Desktop)
    const handleTapOrClick = (e) => {
      let x = e.clientX;
      let y = e.clientY;

      // Extract accurate coordinates on Android touch devices
      if ((x === undefined || y === undefined || (x === 0 && y === 0)) && e.changedTouches && e.changedTouches.length > 0) {
        x = e.changedTouches[0].clientX;
        y = e.changedTouches[0].clientY;
      } else if ((x === undefined || y === undefined || (x === 0 && y === 0)) && e.touches && e.touches.length > 0) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      }

      if (x !== undefined && y !== undefined && x > 0 && y > 0) {
        createBurst(x, y, 24, 1.15);
      }
    };

    window.addEventListener('pointerdown', handleTapOrClick, { passive: true });
    window.addEventListener('touchend', handleTapOrClick, { passive: true });

    // Ambient rocket interval (every 4-7 seconds)
    const rocketInterval = setInterval(() => {
      if (Math.random() > 0.3) {
        launchRocket();
      }
    }, 4500);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // 1. Process Rockets
      const rockets = rocketsRef.current;
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y -= r.speed;

        // Spark tail
        ctx.beginPath();
        ctx.arc(r.x + (Math.random() - 0.5) * 3, r.y + 4, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFE082';
        ctx.fill();

        if (r.y <= r.targetY) {
          createBurst(r.x, r.y, 35, 1.2);
          rockets.splice(i, 1);
        }
      }

      // 2. Process Particles
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // gravity
        p.vx *= 0.985;
        p.life--;

        const alpha = Math.max(0, p.life / p.maxLife);
        const radius = p.twinkle && Math.random() > 0.4 ? p.size * 1.5 : p.size;

        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * alpha, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Glow ring
        ctx.globalAlpha = alpha * 0.15;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius * 3 * alpha, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        if (p.life <= 0) particles.splice(i, 1);
      }
      ctx.globalAlpha = 1;

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointerdown', handleTapOrClick);
      window.removeEventListener('touchend', handleTapOrClick);
      clearInterval(rocketInterval);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [createBurst, launchRocket]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 35,
        pointerEvents: 'none',
        width: '100vw',
        height: '100vh',
      }}
    />
  );
}

import { useMemo } from 'react';

const PARTICLE_COUNT = 18;

export default function BokehBackground({ intensity = 1 }) {
  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const size = 4 + Math.random() * 30;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = Math.random() * 8;
      const duration = 12 + Math.random() * 18;
      const opacity = 0.06 + Math.random() * 0.18;

      // Warm amber-golden palette
      const colors = [
        'rgba(245, 166, 35, VAR)',
        'rgba(255, 209, 128, VAR)',
        'rgba(232, 115, 42, VAR)',
        'rgba(212, 168, 71, VAR)',
        'rgba(255, 183, 77, VAR)',
        'rgba(255, 152, 0, VAR)',
      ];
      const color = colors[i % colors.length].replace('VAR', String(opacity * intensity));

      return { size, x, y, delay, duration, color, id: i };
    });
  }, [intensity]);

  return (
    <div className="bokeh-container">
      {particles.map(p => (
        <div
          key={p.id}
          className="bokeh-particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: `radial-gradient(circle, ${p.color}, transparent 70%)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            filter: `blur(${p.size * 0.3}px)`,
          }}
        />
      ))}

      {/* Ambient glow spots */}
      <div style={{
        position: 'absolute',
        width: '50vw',
        height: '50vh',
        bottom: '-10%',
        left: '25%',
        background: 'radial-gradient(ellipse, rgba(245, 166, 35, 0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        width: '30vw',
        height: '30vh',
        top: '10%',
        right: '10%',
        background: 'radial-gradient(ellipse, rgba(232, 115, 42, 0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

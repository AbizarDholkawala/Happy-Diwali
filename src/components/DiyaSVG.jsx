/**
 * DiyaSVG — Four unique diya styles rendered as pure SVG
 * Each style: classic, ornate, modern, lotus
 */
export default function DiyaSVG({ style = 'classic', size = 80, animate = true, glowColor = '#F5A623' }) {
  const s = size;
  const flameAnim = animate ? 'flame-dance 2s ease-in-out infinite' : 'none';
  const flickerAnim = animate ? 'flicker 3s ease-in-out infinite' : 'none';

  const glowFilter = (
    <defs>
      <filter id={`glow-${style}`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <radialGradient id={`flame-grad-${style}`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
        <stop offset="25%" stopColor="#FFE082" stopOpacity="0.95" />
        <stop offset="55%" stopColor="#F5A623" stopOpacity="0.8" />
        <stop offset="85%" stopColor="#E8732A" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#E8732A" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`body-grad-${style}`} cx="50%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#D4A847" />
        <stop offset="60%" stopColor="#B8860B" />
        <stop offset="100%" stopColor="#8B6914" />
      </radialGradient>
      <radialGradient id={`inner-glow-${style}`} cx="50%" cy="0%" r="80%">
        <stop offset="0%" stopColor={glowColor} stopOpacity="0.3" />
        <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
      </radialGradient>
    </defs>
  );

  /* ─── Flame Component ─── */
  const Flame = ({ cx, cy, fsize = 1 }) => (
    <g style={{ animation: flameAnim, transformOrigin: `${cx}px ${cy + 5}px` }}>
      {/* Outer glow */}
      <ellipse
        cx={cx} cy={cy - 6 * fsize}
        rx={6 * fsize} ry={14 * fsize}
        fill={`url(#flame-grad-${style})`}
        opacity="0.5"
        style={{ animation: flickerAnim }}
      />
      {/* Main flame */}
      <path
        d={`M${cx},${cy} 
           C${cx - 3.5 * fsize},${cy - 5 * fsize} ${cx - 5 * fsize},${cy - 12 * fsize} ${cx - 2 * fsize},${cy - 18 * fsize}
           C${cx},${cy - 22 * fsize} ${cx},${cy - 22 * fsize} ${cx + 2 * fsize},${cy - 18 * fsize}
           C${cx + 5 * fsize},${cy - 12 * fsize} ${cx + 3.5 * fsize},${cy - 5 * fsize} ${cx},${cy}Z`}
        fill={`url(#flame-grad-${style})`}
        filter={`url(#glow-${style})`}
      />
      {/* Inner white core */}
      <ellipse
        cx={cx} cy={cy - 6 * fsize}
        rx={1.5 * fsize} ry={5 * fsize}
        fill="white"
        opacity="0.85"
      />
    </g>
  );

  const viewSize = 100;

  if (style === 'classic') {
    return (
      <svg viewBox={`0 0 ${viewSize} ${viewSize}`} width={s} height={s} xmlns="http://www.w3.org/2000/svg">
        {glowFilter}
        {/* Glow halo */}
        <circle cx="50" cy="38" r="22" fill={`url(#inner-glow-${style})`} opacity="0.4" />
        {/* Diya body — traditional clay shape */}
        <ellipse cx="50" cy="68" rx="22" ry="7" fill={`url(#body-grad-${style})`} />
        <path d="M28,68 C28,58 32,52 38,50 L62,50 C68,52 72,58 72,68" fill={`url(#body-grad-${style})`} />
        {/* Rim */}
        <ellipse cx="50" cy="50" rx="13" ry="3.5" fill="none" stroke="#D4A847" strokeWidth="1.2" />
        {/* Wick nub */}
        <rect x="48.5" y="47" width="3" height="5" rx="1" fill="#5D4E37" />
        {/* Flame */}
        <Flame cx={50} cy={46} fsize={0.9} />
      </svg>
    );
  }

  if (style === 'ornate') {
    return (
      <svg viewBox={`0 0 ${viewSize} ${viewSize}`} width={s} height={s} xmlns="http://www.w3.org/2000/svg">
        {glowFilter}
        <circle cx="50" cy="35" r="24" fill={`url(#inner-glow-${style})`} opacity="0.4" />
        {/* Ornate base */}
        <ellipse cx="50" cy="72" rx="18" ry="5" fill={`url(#body-grad-${style})`} />
        <rect x="43" y="67" width="14" height="6" rx="1" fill="#B8860B" />
        {/* Body with decorative curves */}
        <path d="M32,65 C32,54 36,48 42,46 L58,46 C64,48 68,54 68,65" fill={`url(#body-grad-${style})`} />
        {/* Decorative dots */}
        {[38, 44, 50, 56, 62].map((x, i) => (
          <circle key={i} cx={x} cy={58} r="1.2" fill="#FFD180" opacity="0.7" />
        ))}
        {/* Decorative arches */}
        <path d="M35,62 Q38,56 41,62" fill="none" stroke="#FFD180" strokeWidth="0.8" opacity="0.5" />
        <path d="M44,62 Q47,56 50,62" fill="none" stroke="#FFD180" strokeWidth="0.8" opacity="0.5" />
        <path d="M53,62 Q56,56 59,62" fill="none" stroke="#FFD180" strokeWidth="0.8" opacity="0.5" />
        {/* Rim with scalloped edge */}
        <ellipse cx="50" cy="46" rx="14" ry="3" fill="none" stroke="#D4A847" strokeWidth="1.5" />
        {[36, 39, 42, 45, 48, 51, 54, 57, 60, 63].map((x, i) => (
          <circle key={`sc-${i}`} cx={x} cy={46} r="1" fill="#FFD180" opacity="0.6" />
        ))}
        <rect x="48.5" y="43" width="3" height="5" rx="1" fill="#5D4E37" />
        <Flame cx={50} cy={42} fsize={1} />
      </svg>
    );
  }

  if (style === 'modern') {
    return (
      <svg viewBox={`0 0 ${viewSize} ${viewSize}`} width={s} height={s} xmlns="http://www.w3.org/2000/svg">
        {glowFilter}
        <circle cx="50" cy="36" r="20" fill={`url(#inner-glow-${style})`} opacity="0.4" />
        {/* Sleek geometric body */}
        <rect x="38" y="72" width="24" height="3" rx="1.5" fill="#B8860B" />
        <path d="M40,72 L44,50 L56,50 L60,72 Z" fill={`url(#body-grad-${style})`} />
        {/* Clean lines */}
        <line x1="44" y1="50" x2="40" y2="72" stroke="#FFD180" strokeWidth="0.5" opacity="0.3" />
        <line x1="56" y1="50" x2="60" y2="72" stroke="#FFD180" strokeWidth="0.5" opacity="0.3" />
        {/* Minimal rim */}
        <line x1="42" y1="50" x2="58" y2="50" stroke="#D4A847" strokeWidth="1.5" strokeLinecap="round" />
        {/* Wick */}
        <rect x="49" y="46" width="2" height="5" rx="1" fill="#5D4E37" />
        <Flame cx={50} cy={45} fsize={0.85} />
      </svg>
    );
  }

  if (style === 'lotus') {
    return (
      <svg viewBox={`0 0 ${viewSize} ${viewSize}`} width={s} height={s} xmlns="http://www.w3.org/2000/svg">
        {glowFilter}
        <circle cx="50" cy="38" r="22" fill={`url(#inner-glow-${style})`} opacity="0.4" />
        {/* Center bowl */}
        <ellipse cx="50" cy="62" rx="10" ry="5" fill={`url(#body-grad-${style})`} />
        {/* Petals */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const px = 50 + Math.cos(rad) * 16;
          const py = 60 + Math.sin(rad) * 8;
          return (
            <ellipse
              key={i}
              cx={px}
              cy={py}
              rx="7"
              ry="3.5"
              fill={`url(#body-grad-${style})`}
              transform={`rotate(${angle}, ${px}, ${py})`}
              opacity="0.85"
              stroke="#FFD180"
              strokeWidth="0.3"
            />
          );
        })}
        {/* Inner cup */}
        <ellipse cx="50" cy="57" rx="6" ry="4" fill="#8B6914" />
        <ellipse cx="50" cy="56" rx="5" ry="3" fill="#5D4E37" />
        {/* Wick */}
        <rect x="49" y="50" width="2" height="6" rx="1" fill="#5D4E37" />
        <Flame cx={50} cy={49} fsize={0.95} />
      </svg>
    );
  }

  // Fallback
  return <DiyaSVG style="classic" size={size} animate={animate} glowColor={glowColor} />;
}

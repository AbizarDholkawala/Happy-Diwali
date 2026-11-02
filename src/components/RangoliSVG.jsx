/**
 * RangoliSVG — Decorative rangoli pattern for greeting backgrounds
 */
export default function RangoliSVG({ size = 300, opacity = 0.08, color = '#F5A623' }) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      {/* Outer ring */}
      <circle cx="100" cy="100" r="95" fill="none" stroke={color} strokeWidth="0.5" />
      <circle cx="100" cy="100" r="90" fill="none" stroke={color} strokeWidth="0.3" strokeDasharray="4 4" />

      {/* Petal pattern — 12 petals */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 100 + Math.cos(angle) * 30;
        const y1 = 100 + Math.sin(angle) * 30;
        const x2 = 100 + Math.cos(angle) * 75;
        const y2 = 100 + Math.sin(angle) * 75;
        const cpOff = 20;
        const perpAngle = angle + Math.PI / 2;
        const cx1 = (x1 + x2) / 2 + Math.cos(perpAngle) * cpOff;
        const cy1 = (y1 + y2) / 2 + Math.sin(perpAngle) * cpOff;
        const cx2 = (x1 + x2) / 2 - Math.cos(perpAngle) * cpOff;
        const cy2 = (y1 + y2) / 2 - Math.sin(perpAngle) * cpOff;

        return (
          <g key={i}>
            <path
              d={`M${x1},${y1} Q${cx1},${cy1} ${x2},${y2} Q${cx2},${cy2} ${x1},${y1}`}
              fill="none"
              stroke={color}
              strokeWidth="0.6"
            />
          </g>
        );
      })}

      {/* Inner concentric pattern */}
      <circle cx="100" cy="100" r="28" fill="none" stroke={color} strokeWidth="0.5" />
      <circle cx="100" cy="100" r="18" fill="none" stroke={color} strokeWidth="0.5" />
      <circle cx="100" cy="100" r="8" fill={color} opacity="0.3" />

      {/* Dot accents on outer ring */}
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i * 15 * Math.PI) / 180;
        const cx = 100 + Math.cos(angle) * 85;
        const cy = 100 + Math.sin(angle) * 85;
        return <circle key={`d-${i}`} cx={cx} cy={cy} r="1.2" fill={color} opacity="0.5" />;
      })}

      {/* Inner dots */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const cx = 100 + Math.cos(angle) * 23;
        const cy = 100 + Math.sin(angle) * 23;
        return <circle key={`id-${i}`} cx={cx} cy={cy} r="1.5" fill={color} opacity="0.4" />;
      })}

      {/* Star pattern in center */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i * 60 * Math.PI) / 180;
        const x1 = 100 + Math.cos(angle) * 6;
        const y1 = 100 + Math.sin(angle) * 6;
        const angle2 = ((i * 60 + 30) * Math.PI) / 180;
        const x2 = 100 + Math.cos(angle2) * 15;
        const y2 = 100 + Math.sin(angle2) * 15;
        return (
          <line
            key={`s-${i}`}
            x1={x1} y1={y1}
            x2={x2} y2={y2}
            stroke={color}
            strokeWidth="0.4"
            opacity="0.5"
          />
        );
      })}

      {/* Decorative curves between petals */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle1 = (i * 30 * Math.PI) / 180;
        const angle2 = ((i + 1) * 30 * Math.PI) / 180;
        const midAngle = ((i * 30 + 15) * Math.PI) / 180;
        const x1 = 100 + Math.cos(angle1) * 75;
        const y1 = 100 + Math.sin(angle1) * 75;
        const x2 = 100 + Math.cos(angle2) * 75;
        const y2 = 100 + Math.sin(angle2) * 75;
        const cpx = 100 + Math.cos(midAngle) * 92;
        const cpy = 100 + Math.sin(midAngle) * 92;
        return (
          <path
            key={`c-${i}`}
            d={`M${x1},${y1} Q${cpx},${cpy} ${x2},${y2}`}
            fill="none"
            stroke={color}
            strokeWidth="0.4"
            opacity="0.4"
          />
        );
      })}
    </svg>
  );
}

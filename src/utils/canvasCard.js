/**
 * Canvas Greeting Card Generator
 * Generates an ultra high-resolution, beautifully styled Diwali greeting card
 * directly on an HTML5 canvas. 100% reliable across all browsers, iOS Safari,
 * Android Chrome, and desktops without external font or CORS issues.
 */
export async function generateGreetingCardBlob(data) {
  const width = 1080;
  const height = 1350; // Standard 4:5 social/portrait ratio
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const {
    recipientName = 'Loved One',
    senderName = '',
    message = 'Wishing you and your family a very Happy Diwali!',
    diyaStyle = 'classic',
    bgTheme = 'ethereal',
    diyas = 3,
  } = data || {};

  // Theme palettes
  const themes = {
    ethereal: { bg1: '#1a1005', bg2: '#0d0803', bg3: '#060402', glow: '#F5A623', flame: '#FFD180' },
    festive: { bg1: '#260a0a', bg2: '#140505', bg3: '#070202', glow: '#FF6B6B', flame: '#FFA07A' },
    celestial: { bg1: '#0e122b', bg2: '#080a18', bg3: '#03040a', glow: '#82B1FF', flame: '#FFD180' },
    garden: { bg1: '#0d2214', bg2: '#06130a', bg3: '#020703', glow: '#81C784', flame: '#FFE082' },
  };
  const theme = themes[bgTheme] || themes.ethereal;

  // 1. Draw Deep Gradient Background
  const bgGrad = ctx.createRadialGradient(width / 2, height * 0.45, 100, width / 2, height / 2, width * 0.85);
  bgGrad.addColorStop(0, theme.bg1);
  bgGrad.addColorStop(0.5, theme.bg2);
  bgGrad.addColorStop(1, theme.bg3);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Draw Ambient Bokeh & Golden Glow Particles
  for (let i = 0; i < 40; i++) {
    const bx = Math.random() * width;
    const by = Math.random() * height;
    const br = 4 + Math.random() * 24;
    const bGrad = ctx.createRadialGradient(bx, by, 0, bx, by, br);
    const alpha = 0.04 + Math.random() * 0.12;
    bGrad.addColorStop(0, `rgba(245, 166, 35, ${alpha})`);
    bGrad.addColorStop(1, 'rgba(245, 166, 35, 0)');
    ctx.fillStyle = bGrad;
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Draw Decorative Ornate Border
  ctx.strokeStyle = 'rgba(245, 166, 35, 0.25)';
  ctx.lineWidth = 2;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  ctx.strokeStyle = 'rgba(245, 166, 35, 0.1)';
  ctx.lineWidth = 1;
  ctx.strokeRect(52, 52, width - 104, height - 104);

  // Corner Ornaments
  const corners = [
    [40, 40],
    [width - 40, 40],
    [40, height - 40],
    [width - 40, height - 40],
  ];
  ctx.fillStyle = '#D4A847';
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  // 4. Shubh Deepavali Sanskrit Header
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255, 209, 128, 0.85)';
  ctx.font = '500 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans Devanagari", sans-serif';
  ctx.letterSpacing = '0px';
  ctx.fillText('—  शुभ दीपावली  —', width / 2, 120);

  // 5. "Happy Diwali" Grand Golden Title
  ctx.font = 'italic 700 84px "Cormorant Garamond", Georgia, serif';
  const titleGrad = ctx.createLinearGradient(width / 2 - 250, 0, width / 2 + 250, 0);
  titleGrad.addColorStop(0, '#FFE082');
  titleGrad.addColorStop(0.5, '#F5A623');
  titleGrad.addColorStop(1, '#E8732A');
  ctx.fillStyle = titleGrad;
  ctx.shadowColor = 'rgba(245, 166, 35, 0.4)';
  ctx.shadowBlur = 30;
  ctx.fillText('Happy Diwali', width / 2, 220);
  ctx.shadowBlur = 0; // reset

  // 6. "Dear [Recipient]" — Guaranteed distinct space, perfectly centered
  const dearWord = 'Dear';
  const cleanName = (recipientName || 'Loved One').trim();

  ctx.font = '400 36px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif';
  const dearWidth = ctx.measureText(dearWord).width;
  const spaceWidth = 14; // Explicit physical space of 14px

  ctx.font = '600 38px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif';
  const nameWidth = ctx.measureText(cleanName).width;

  const combinedWidth = dearWidth + spaceWidth + nameWidth;
  const startX = (width - combinedWidth) / 2;

  // Use left alignment so the two words are sequentially drawn with guaranteed space
  ctx.textAlign = 'left';

  ctx.font = '400 36px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#B8A994';
  ctx.fillText(dearWord, startX, 292);

  ctx.font = '600 38px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#FFD180';
  ctx.shadowColor = 'rgba(245, 166, 35, 0.45)';
  ctx.shadowBlur = 16;
  ctx.fillText(cleanName, startX + dearWidth + spaceWidth, 292);
  ctx.shadowBlur = 0; // reset

  // 7. Draw Decorative Center Golden Diyas
  const diyaCount = Math.min(Math.max(diyas, 1), 7);
  const diyaY = 460;
  const spread = Math.min(600, diyaCount * 90);
  const startDiyaX = (width - spread) / 2;

  // Background glow behind diyas
  const diyaHalo = ctx.createRadialGradient(width / 2, diyaY - 20, 30, width / 2, diyaY - 20, 350);
  diyaHalo.addColorStop(0, 'rgba(245, 166, 35, 0.28)');
  diyaHalo.addColorStop(0.5, 'rgba(232, 115, 42, 0.1)');
  diyaHalo.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = diyaHalo;
  ctx.beginPath();
  ctx.arc(width / 2, diyaY - 20, 350, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < diyaCount; i++) {
    const dx = diyaCount === 1 ? width / 2 : startDiyaX + (spread / (diyaCount - 1)) * i;
    const distFromCenter = Math.abs(dx - width / 2) / (spread / 2 || 1);
    const dScale = 0.85 + (1 - distFromCenter) * 0.35;

    ctx.save();
    ctx.translate(dx, diyaY);
    ctx.scale(dScale, dScale);

    // Clay Base
    const baseGrad = ctx.createRadialGradient(0, 15, 5, 0, 15, 45);
    baseGrad.addColorStop(0, '#E6A147');
    baseGrad.addColorStop(0.6, '#B8732A');
    baseGrad.addColorStop(1, '#6E3C0F');
    ctx.fillStyle = baseGrad;

    ctx.beginPath();
    ctx.ellipse(0, 20, 38, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-38, 20);
    ctx.quadraticCurveTo(-20, 0, 0, -2);
    ctx.quadraticCurveTo(20, 0, 38, 20);
    ctx.quadraticCurveTo(0, 34, -38, 20);
    ctx.fill();

    // Diya Rim
    ctx.strokeStyle = '#FFD180';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Wick
    ctx.fillStyle = '#42250B';
    ctx.fillRect(-2, -6, 4, 8);

    // Glowing Flame
    const flameGrad = ctx.createRadialGradient(0, -25, 2, 0, -25, 28);
    flameGrad.addColorStop(0, '#FFFFFF');
    flameGrad.addColorStop(0.2, '#FFE082');
    flameGrad.addColorStop(0.6, '#F5A623');
    flameGrad.addColorStop(0.9, '#E8732A');
    flameGrad.addColorStop(1, 'rgba(232, 115, 42, 0)');

    ctx.shadowColor = '#F5A623';
    ctx.shadowBlur = 25;
    ctx.fillStyle = flameGrad;

    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.bezierCurveTo(-14, -20, -10, -45, 0, -56);
    ctx.bezierCurveTo(10, -45, 14, -20, 0, -6);
    ctx.fill();

    ctx.shadowBlur = 0; // reset
    ctx.restore();
  }

  // Diya Glow Line Reflection
  const reflGrad = ctx.createRadialGradient(width / 2, diyaY + 45, 10, width / 2, diyaY + 45, 250);
  reflGrad.addColorStop(0, 'rgba(245, 166, 35, 0.4)');
  reflGrad.addColorStop(1, 'rgba(245, 166, 35, 0)');
  ctx.fillStyle = reflGrad;
  ctx.beginPath();
  ctx.ellipse(width / 2, diyaY + 45, 260, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // 8. Message Card Background Box
  const boxX = 120;
  const boxY = 620;
  const boxW = width - 240;
  const boxH = 380;
  const boxR = 24;

  ctx.fillStyle = 'rgba(22, 22, 31, 0.75)';
  ctx.strokeStyle = 'rgba(245, 166, 35, 0.18)';
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, boxR);
  ctx.fill();
  ctx.stroke();

  // 9. Personal Message with word wrap
  ctx.font = '400 32px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#FAF0E6';
  ctx.textAlign = 'center';

  const maxLineWidth = boxW - 80;
  const words = message.split(' ');
  let line = '';
  const lines = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxLineWidth && n > 0) {
      lines.push(line);
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  const startMsgY = boxY + 70 + (4 - Math.min(lines.length, 4)) * 14;
  lines.slice(0, 5).forEach((msgLine, idx) => {
    ctx.fillText(msgLine.trim(), width / 2, startMsgY + idx * 48);
  });

  // 10. Sender Signature
  if (senderName) {
    ctx.textAlign = 'center';
    ctx.font = 'italic 600 38px "Cormorant Garamond", Georgia, serif';
    ctx.fillStyle = '#FFD180';
    ctx.fillText(`— With love, ${senderName.trim()}`, width / 2, boxY + boxH - 50);
  }

  // 11. Footer Blessing
  ctx.textAlign = 'center';
  ctx.font = '500 20px "IBM Plex Mono", monospace';
  ctx.fillStyle = 'rgba(184, 169, 148, 0.6)';
  ctx.letterSpacing = '3px';
  ctx.fillText('✦  MAY YOUR LIFE SHINE WITH PROSPERITY & JOY  ✦', width / 2, height - 90);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png');
  });
}

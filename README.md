# 🪔 Shubh Deepawali — Digital Diya Greeting Experience

> A modern, contest-grade interactive Diwali digital greeting web application. Create, customize, and share personalized Diwali greetings with glowing digital diyas, festive music, firecrackers, and shareable links with zero database setup.

[![Live Demo](https://img.shields.io/badge/Live_Demo-shubhdeepawali.web.app-F5A623?style=for-the-badge&logo=firebase&logoColor=white)](https://shubhdeepawali.web.app)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Firebase](https://img.shields.io/badge/Hosted_on-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)

---

## ✨ Features

- **🎨 3-Step Interactive Greeting Builder**:
  - **Names**: Enter the recipient's name and optional sender signature.
  - **Heartfelt Wishes**: Write your own custom message or choose from curated quick Diwali presets.
  - **Festive Customization**: Choose between 4 distinct Diya styles (*Classic Clay*, *Ornate Festival*, *Modern Minimalist*, *Lotus Petal*), adjust diya counts (1 to 7), and select from 4 atmospheric background themes (*Ethereal Glow*, *Festive Red*, *Celestial Blue*, *Garden Green*).

- **🔗 Zero-Database URL Sharing**:
  - Entire greetings are compressed into URL query strings (`?g=...`) using LZ-String + URL-safe Base64 encoding.
  - Instant sharing via **WhatsApp**, **Facebook**, **X (Twitter)**, and the **Native Mobile Share Sheet** (`navigator.share`).
  - No database, no logins, and zero tracking — permanent and lightweight.

- **🎆 Interactive & Ambient Firecrackers**:
  - **Touch & Click Explosions**: Tap or click anywhere on the screen (Android, iOS, or PC) to spawn multi-colored sparklers with dynamic physics.
  - **Ambient Rockets & Finale Fireworks**: Atmospheric fireworks burst gracefully in the background.
  - **Interactive Love Note**: Floating blended transparent badge *"Show some love by tapping the screen"* with a one-time golden shimmer that reacts to taps.

- **🎵 Festive Diwali Music Player**:
  - Floating vinyl/diya pill with animated dancing equalizer bars.
  - Slide-out side drawer with playback controls: **Play**, **Pause**, **Seamless Loop**, **Previous**, **Next**, **Volume Slider**, and interactive track scrubber.
  - **5 Curated Festive Tracks**:
    1. *Divine Bansuri & Bells* (1:31)
    2. *Soulful Sitar Raga* (2:20)
    3. *Temple Dawn & Om Resonance* (2:08)
    4. *Festive Joy & Celebration* (2:39)
    5. *Deepavali Mahaparv Aarti* (4:44)
  - **Mobile Compliant**: Direct `touchend` user-activation compliance for seamless unmuted playback on Android and iOS.
  - **Web Audio Raga Synthesizer Fallback**: Built-in procedural Tanpura and Bansuri synthesizer that generates authentic Indian classical raga ambient music offline if audio files are unavailable.

- **📸 High-Resolution PNG Card Download**:
  - Client-side pure HTML5 Canvas export generating 1080×1350 (4:5 portrait) greeting cards ready for Instagram stories, WhatsApp statuses, and print.
  - Guaranteed typographic spacing, centered diya lighting, and decorative borders.

- **📱 Mobile-First Responsive Design**:
  - Built to fit within 1 screen frame at 100% zoom with zero awkward vertical scrollbars on initial load.
  - Deep OLED dark background (`#0A0A0F`) with golden amber glow and shimmering glassmorphism.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev)
- **Bundler & Dev Server**: [Vite 8](https://vite.dev)
- **Icons**: [Lucide React](https://lucide.dev)
- **Compression**: [LZ-String](https://github.com/pieroxy/lz-string)
- **Styling**: Modern Vanilla CSS (CSS Grid, Flexbox, Custom Properties, Glassmorphism)
- **Graphics & Audio**: HTML5 2D Canvas API + Web Audio API
- **Hosting**: [Firebase Hosting](https://firebase.google.com) (Google Edge CDN)

---

## 📁 Project Structure

```
Diwali/
├── public/
│   ├── audio/              # Preloaded MP3 audio tracks (1.mp3 - 5.mp3)
│   └── favicon.svg         # Golden diya SVG favicon
├── src/
│   ├── components/
│   │   ├── BokehBackground.jsx      # Ambient glowing festival particles
│   │   ├── DiyaSVG.jsx              # Vector diya models with flame animations
│   │   ├── FirecrackerEffects.jsx   # Touch-activated & ambient fireworks engine
│   │   ├── GreetingView.jsx         # Cinematic shared greeting view
│   │   ├── MusicPlayer.jsx          # Floating pill & slide-out side music drawer
│   │   ├── PreviewModal.jsx         # Zoomable, fixed-size card preview dialog
│   │   ├── RangoliSVG.jsx           # Sacred geometric festive floor patterns
│   │   └── ShareModal.jsx           # Share modal with WhatsApp, links & PNG export
│   ├── utils/
│   │   ├── audioEngine.js           # Audio controller & procedural raga synth
│   │   ├── canvasCard.js            # Pure Canvas 1080x1350 PNG export engine
│   │   └── codec.js                 # URL greeting compression / decompression
│   ├── App.jsx                      # Main controller (Creator & Greeting router)
│   ├── index.css                    # Ethereal Glow theme & responsive design system
│   └── main.jsx                     # Application entry point
├── firebase.json                    # Firebase SPA rewrite & header configuration
├── vite.config.js                   # Vite config with HTTP range audio streaming
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AbizarDholkawala/Happy-Diwali.git
   cd Happy-Diwali
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173` (or the port indicated in your terminal).

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🌐 Deployment (Firebase Hosting)

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Deploy**:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

<p align="center">
  Wishing you and your family a joyous, prosperous, and bright Deepavali! 🪔✨
</p>

import { useState, useCallback } from 'react';
import { Copy, Check, Download, X, Share2, ExternalLink, Sparkles } from 'lucide-react';
import { generateGreetingCardBlob } from '../utils/canvasCard';

export default function ShareModal({ url, data, onClose }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [shared, setShared] = useState(false);

  const recipientName = data?.recipientName || 'friend';
  const shareText = `🪔 Happy Diwali, ${recipientName}! Someone has lit a digital diya for you. Open to see your personalized greeting ✨`;

  // 1. Copy Link Handler
  const handleCopy = useCallback(async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.error('Copy failed:', e);
      // Direct select on fallback
      const input = document.getElementById('share-url-input');
      if (input) {
        input.focus();
        input.select();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }, [url]);

  // 2. Native Mobile Web Share API
  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Happy Diwali, ${recipientName}! 🪔`,
          text: shareText,
          url: url,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2500);
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  }, [recipientName, shareText, url, handleCopy]);

  // 3. Reliable Canvas Image Download
  const handleDownload = useCallback(async () => {
    setDownloading(true);
    try {
      const blob = await generateGreetingCardBlob(data);
      if (!blob) throw new Error('Blob generation failed');

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `Happy-Diwali-${recipientName.replace(/\s+/g, '-')}.png`;
      link.href = downloadUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 4000);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Unable to generate image. Please share the link directly!');
    } finally {
      setDownloading(false);
    }
  }, [data, recipientName]);

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + '\n\n' + url)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="share-overlay" onClick={onClose}>
      <div className="share-modal" onClick={e => e.stopPropagation()}>
        {/* Close Button */}
        <button className="share-close-btn" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="share-modal-header">
          <div className="share-modal-icon">🪔</div>
          <h3 className="share-modal-title">Your Greeting is Ready!</h3>
          <p className="share-modal-desc">
            Share the light of Diwali with <strong style={{ color: 'var(--amber-light)' }}>{recipientName}</strong>
          </p>
        </div>

        {/* Primary Action on Mobile: Native Share */}
        {hasNativeShare && (
          <div style={{ marginBottom: '1rem' }}>
            <button
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '0.95rem',
                boxShadow: '0 4px 20px rgba(245, 166, 35, 0.35)',
              }}
              onClick={handleNativeShare}
            >
              <Share2 size={18} /> {shared ? 'Shared! 🎉' : 'Share to WhatsApp & Friends'}
            </button>
          </div>
        )}

        {/* Shareable Link Box */}
        <div className="share-section">
          <label className="form-label" style={{ fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
            <span>Shareable Link</span>
            {copied && <span style={{ color: '#25D366', fontWeight: 600 }}>Copied to clipboard!</span>}
          </label>
          <div className="share-link-box">
            <input
              id="share-url-input"
              type="text"
              value={url}
              readOnly
              onClick={e => e.target.select()}
            />
            <button
              className={`btn btn-copy ${copied ? 'copied' : ''}`}
              onClick={handleCopy}
            >
              {copied ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
            </button>
          </div>
        </div>

        {/* Social Share Buttons */}
        <div className="share-section">
          <label className="form-label" style={{ fontSize: '0.8rem' }}>Direct Share</label>
          <div className="social-share-row">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="social-btn whatsapp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
            <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className="social-btn twitter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Twitter
            </a>
            <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="social-btn facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </a>
          </div>
        </div>

        {/* Download Card as Image (Works reliably!) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.75rem' }}>
          <button
            className={`btn btn-download-full ${downloading ? 'downloading' : ''}`}
            onClick={handleDownload}
            disabled={downloading}
          >
            <Download size={16} />
            {downloading ? 'Creating High-Res Greeting Image...' : 'Download as Image (PNG)'}
          </button>

          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            style={{ width: '100%', fontSize: '0.82rem', padding: '0.6rem' }}
          >
            <ExternalLink size={14} /> Open Greeting in New Tab
          </a>
        </div>
      </div>
    </div>
  );
}

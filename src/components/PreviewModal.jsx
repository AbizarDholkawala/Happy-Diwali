import { useState, useRef, useEffect, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Sparkles } from 'lucide-react';
import GreetingView from './GreetingView';

/**
 * PreviewModal
 * Opens in a fixed, complete single frame with zero vertical scrollbars.
 * Fully zoomable via controls, mouse wheel, or mobile pinch/drag.
 */
export default function PreviewModal({ data, onClose }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Calculate perfect initial fit on open
  useEffect(() => {
    const handleResize = () => {
      // Standard target card size is 380px wide by 660px tall
      const availH = window.innerHeight - 100; // Leave room for header & margins
      const availW = Math.min(window.innerWidth - 32, 440);
      const targetH = 680;
      const targetW = 380;

      const scaleH = availH / targetH;
      const scaleW = availW / targetW;
      const initialFit = Math.min(scaleH, scaleW, 1);

      setZoom(Math.max(0.65, Math.min(initialFit, 1)));
      setPan({ x: 0, y: 0 });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Zoom controls
  const handleZoomIn = () => setZoom(z => Math.min(2.2, +(z + 0.15).toFixed(2)));
  const handleZoomOut = () => setZoom(z => Math.max(0.5, +(z - 0.15).toFixed(2)));
  const handleResetZoom = () => {
    const availH = window.innerHeight - 100;
    const availW = Math.min(window.innerWidth - 32, 440);
    const initialFit = Math.min(availH / 680, availW / 380, 1);
    setZoom(Math.max(0.65, Math.min(initialFit, 1)));
    setPan({ x: 0, y: 0 });
  };

  // Wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom(z => Math.min(2.2, +(z + 0.1).toFixed(2)));
    } else {
      setZoom(z => Math.max(0.5, +(z - 0.1).toFixed(2)));
    }
  };

  // Drag to pan when zoomed
  const handlePointerDown = (e) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handlePointerUp = () => setIsDragging(false);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="share-overlay" onClick={onClose}>
      <div
        className="preview-dialog"
        onClick={e => e.stopPropagation()}
        onWheel={handleWheel}
      >
        {/* Toolbar Header */}
        <div className="preview-toolbar">
          <div className="preview-title-badge">
            <Sparkles size={14} color="var(--amber)" />
            <span>Greeting Preview</span>
          </div>

          {/* Interactive Zoom Controls */}
          <div className="preview-zoom-controls">
            <button
              className="zoom-btn"
              onClick={handleZoomOut}
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut size={15} />
            </button>

            <button
              className="zoom-level-pill"
              onClick={handleResetZoom}
              title="Reset Zoom / Fit to Screen"
            >
              {Math.round(zoom * 100)}%
            </button>

            <button
              className="zoom-btn"
              onClick={handleZoomIn}
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn size={15} />
            </button>

            <button
              className="zoom-btn reset"
              onClick={handleResetZoom}
              title="Fit to Screen"
              aria-label="Fit to Screen"
            >
              <RotateCcw size={14} />
            </button>
          </div>

          {/* Close */}
          <button
            className="btn-icon preview-close-btn"
            onClick={onClose}
            aria-label="Close Preview"
          >
            <X size={18} />
          </button>
        </div>

        {/* Viewport Frame (Guaranteed zero scrollbars, fixed size) */}
        <div
          ref={containerRef}
          className="preview-stage"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        >
          <div
            className="preview-card-scaler"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            }}
          >
            <div className="preview-card-shell">
              <GreetingView data={data} isPreview />
            </div>
          </div>
        </div>

        {/* Bottom hint */}
        <div className="preview-footer-hint">
          {zoom > 1 ? 'Drag to pan around card • Pinch / scroll to zoom' : 'Pinch or use + / - buttons to zoom in'}
        </div>
      </div>
    </div>
  );
}


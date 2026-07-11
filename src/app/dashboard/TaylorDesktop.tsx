'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface IconDef {
  id: string;
  windowTitle: string;
  // Position and size as a percentage of the canvas image, so hotspots stay
  // aligned with the printed artwork at any screen size (the image is shown
  // via object-contain inside an aspect-ratio-locked box, never cropped).
  xPct: number;
  yPct: number;
  wPct: number;
  hPct: number;
}

const ICONS: IconDef[] = [
  { id: 'shop', windowTitle: 'Shop', xPct: 10.1, yPct: 21.5, wPct: 15, hPct: 10 },
  { id: 'newsletter', windowTitle: 'Newsletter', xPct: 27.1, yPct: 21.5, wPct: 15, hPct: 10 },
  { id: 'comic', windowTitle: 'Comic', xPct: 10.1, yPct: 34.3, wPct: 15, hPct: 10 },
  { id: 'music', windowTitle: 'Music + Vibes', xPct: 27.1, yPct: 34.3, wPct: 15, hPct: 10 },
  { id: 'gallery', windowTitle: 'Gallery', xPct: 10.1, yPct: 46.2, wPct: 15, hPct: 10 },
  { id: 'extras', windowTitle: 'Extras', xPct: 27.1, yPct: 46.2, wPct: 15, hPct: 10 },
  { id: 'chapters', windowTitle: 'Comic Chapters', xPct: 10.1, yPct: 57.2, wPct: 15, hPct: 10 },
  { id: 'journal', windowTitle: "Taylor's Journal", xPct: 27.1, yPct: 57.2, wPct: 15, hPct: 10 },
  { id: 'scanner', windowTitle: 'Clue Scanner', xPct: 10.1, yPct: 68.2, wPct: 15, hPct: 10 },
  { id: 'suspects', windowTitle: 'Suspect Profiles', xPct: 27.1, yPct: 68.2, wPct: 15, hPct: 10 },
  { id: 'evidence', windowTitle: 'Evidence Locker', xPct: 10.1, yPct: 85.6, wPct: 15, hPct: 10 },
  { id: 'activecases', windowTitle: 'Active Cases', xPct: 84.8, yPct: 72.3, wPct: 14, hPct: 9 },
  { id: 'puzzlebank', windowTitle: 'Puzzle Bank', xPct: 84.8, yPct: 82.0, wPct: 14, hPct: 9 },
];

const WINDOW_TITLES: Record<string, string> = Object.fromEntries(ICONS.map((i) => [i.id, i.windowTitle]));

const WINDOW_LINES: Record<string, string[]> = {
  shop: [
    "Merch drops eventually. For now it's a box of stickers I haven't sorted and a promise to myself.",
  ],
  newsletter: [
    "Half-written for three weeks straight. The subject line still says 'Draft — fix later.'",
  ],
  comic: [
    "The actual pages live here. Don't ask why chapter nine took longer than the other eight combined.",
  ],
  music: [
    'Playlist syncs to whatever mood the Harvest Clock is in that day. Current phase: way too much 2000s pop-punk.',
  ],
  gallery: [
    "Photos I'm not really supposed to have anymore. Half of them technically shouldn't exist.",
  ],
  extras: [
    "Scraps that didn't make the final cut. Some of them probably should have.",
  ],
  chapters: [
    'Every chapter, filed by date — except the one I keep meaning to reorder and never do.',
  ],
  journal: [
    "Grabbed the orchard files before the wipe finished. Don't know if they're even supposed to open anymore.",
    "5:01 PM, the Harvest Clock pulsed again. My monitor glitched for exactly one second. Stopped reporting it months ago.",
    'Mochi barked at the Lead Admin\'s icon for a full minute today. Never been prouder of a dog.',
    "[PING] from NOVA.NET again: THE JUNCTION. 12:30 PM. BRING THE CLOCK. Still don't know how a message arrives from a time that hasn't happened yet.",
  ],
  scanner: [
    "Runs a pass over anything that looks 'off.' Flagged my own desk twice this week.",
    'Clue 3: an unreadable key. Clue 4: a strange moon sigil near the tracks. Neither one scans as normal town stuff.',
    "The scanner doesn't do metaphors. When it says 'pattern detected,' it means it.",
  ],
  suspects: [
    "The Lead Admin. Face is a loading icon. Has been for three years. Nobody else finds that strange.",
    'Whoever runs NOVA.NET. Knows my schedule better than I do.',
    'Not ruling anyone out yet. Including myself, some days.',
  ],
  evidence: [
    "orchard_blue_rose_ARCHIVE.raw — exported before the wipe finished. Locked it here so nobody 'optimizes' it away.",
    'grandpa_notes_TRANSCRIBED.txt — thought it was just a bedtime story. Filing it as evidence now.',
    "If anyone from IT is reading this: no, I don't know how these got here. Yes, I'm keeping them.",
  ],
  activecases: [
    'The Missing Mail — still open.',
    'Clue 3: found an unreadable key.',
    'Clue 4: strange moon sigil near the tracks.',
  ],
  puzzlebank: [
    "Every pattern I haven't cracked yet, filed here until it makes sense.",
    "Don't overthink it, but don't ignore it. The pattern is always there.",
  ],
};

interface OpenWindow {
  id: string;
  x: number;
  y: number;
}

const CANVAS_W = 922;
const CANVAS_H = 1092;

// Measures the container and computes the "cover" size for the canvas image
// (scaled up just enough to fill the container on both axes, like
// background-size: cover), so the image fills the screen edge-to-edge with
// no empty gutters. Hotspots are positioned as percentages of this same
// scaled box, so they stay pixel-aligned with the printed icons even though
// the box itself is now larger than the visible viewport and gets clipped
// by the parent's overflow-hidden.
function useCoverSize(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ width: CANVAS_W, height: CANVAS_H });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const compute = () => {
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      if (!cw || !ch) return;
      const scale = Math.max(cw / CANVAS_W, ch / CANVAS_H);
      setSize({ width: CANVAS_W * scale, height: CANVAS_H * scale });
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef]);

  return size;
}

function DraggableWindow({
  id,
  title,
  x,
  y,
  zIndex,
  onFocus,
  onClose,
  onMove,
  children,
}: {
  id: string;
  title: string;
  x: number;
  y: number;
  zIndex: number;
  onFocus: (id: string) => void;
  onClose: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  children: React.ReactNode;
}) {
  const dragState = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  const updatePosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!dragState.current) return;
      const dx = clientX - dragState.current.startX;
      const dy = clientY - dragState.current.startY;
      onMove(id, dragState.current.origX + dx, dragState.current.origY + dy);
    },
    [id, onMove]
  );

  const handleMouseMove = useCallback((e: MouseEvent) => updatePosition(e.clientX, e.clientY), [updatePosition]);
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      e.preventDefault();
      updatePosition(touch.clientX, touch.clientY);
    },
    [updatePosition]
  );

  const endDrag = useCallback(() => {
    dragState.current = null;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', endDrag);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', endDrag);
  }, [handleMouseMove, handleTouchMove]);

  const handleTitleMouseDown = (e: React.MouseEvent) => {
    onFocus(id);
    dragState.current = { startX: e.clientX, startY: e.clientY, origX: x, origY: y };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', endDrag);
  };

  const handleTitleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    onFocus(id);
    dragState.current = { startX: touch.clientX, startY: touch.clientY, origX: x, origY: y };
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', endDrag);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', endDrag);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', endDrag);
    };
  }, [handleMouseMove, handleTouchMove, endDrag]);

  return (
    <div
      className="absolute w-[280px] sm:w-[340px] rounded shadow-2xl border border-[#c9a876] bg-[#fffaf0] text-[#4a3620] select-none"
      style={{ left: x, top: y, zIndex }}
      onMouseDown={() => onFocus(id)}
    >
      <div
        className="flex items-center justify-between px-2 py-1.5 bg-gradient-to-r from-[#e8a84f] to-[#e88a6f] text-white text-sm font-bold rounded-t cursor-move touch-none"
        onMouseDown={handleTitleMouseDown}
        onTouchStart={handleTitleTouchStart}
      >
        <span className="truncate">{title}</span>
        <button
          onClick={() => onClose(id)}
          className="w-5 h-5 shrink-0 ml-2 bg-red-500 hover:bg-red-600 rounded-sm flex items-center justify-center text-xs font-bold border border-red-800 text-white cursor-pointer"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
      <div className="p-3 text-xs sm:text-sm leading-relaxed max-h-[50vh] overflow-y-auto space-y-2">
        {children}
      </div>
    </div>
  );
}

export default function TaylorDesktop({ onLogout }: { onLogout: () => void }) {
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [zOrder, setZOrder] = useState<string[]>([]);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const nextOffset = useRef(0);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasSize = useCoverSize(canvasContainerRef);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  const openWindow = useCallback((id: string) => {
    setOpenWindows((prev) => {
      if (prev.some((w) => w.id === id)) return prev;
      const offset = (nextOffset.current % 5) * 24;
      nextOffset.current += 1;
      return [...prev, { id, x: 200 + offset, y: 100 + offset }];
    });
    setZOrder((prev) => [...prev.filter((w) => w !== id), id]);
  }, []);

  const closeWindow = useCallback((id: string) => {
    setOpenWindows((prev) => prev.filter((w) => w.id !== id));
    setZOrder((prev) => prev.filter((w) => w !== id));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setZOrder((prev) => [...prev.filter((w) => w !== id), id]);
  }, []);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setOpenWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)));
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none font-sans bg-[#2a2a30] flex flex-col">
      {/* Case-file canvas. The real artwork fills the container edge-to-edge
          (like background-size: cover - no empty gutters, in portrait or
          landscape) via a JS-measured scale rather than a CSS crop, so the
          invisible hotspots below - positioned as percentages of that same
          scaled box - stay pixel-aligned with the printed icons no matter
          how much of the image ends up clipped by this container. */}
      <div ref={canvasContainerRef} className="flex-1 relative overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2"
          style={{ width: canvasSize.width, height: canvasSize.height, transform: 'translate(-50%, -50%)' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/taylordesktopcanvas.png"
            alt="Taylor's case-file desktop"
            className="w-full h-full block select-none pointer-events-none"
            draggable={false}
          />
          {ICONS.map((iconDef) => (
            <button
              key={iconDef.id}
              onClick={() => openWindow(iconDef.id)}
              className="absolute rounded hover:bg-white/15 active:bg-white/25 transition-colors cursor-pointer"
              style={{
                left: `${iconDef.xPct}%`,
                top: `${iconDef.yPct}%`,
                width: `${iconDef.wPct}%`,
                height: `${iconDef.hPct}%`,
                transform: 'translate(-50%, -50%)',
              }}
              aria-label={iconDef.windowTitle}
            />
          ))}
        </div>
      </div>

      {/* Open windows */}
      {openWindows.map((w) => {
        const title = WINDOW_TITLES[w.id];
        if (!title) return null;
        return (
          <DraggableWindow
            key={w.id}
            id={w.id}
            title={title}
            x={w.x}
            y={w.y}
            zIndex={100 + zOrder.indexOf(w.id)}
            onFocus={focusWindow}
            onClose={closeWindow}
            onMove={moveWindow}
          >
            {WINDOW_LINES[w.id]?.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </DraggableWindow>
        );
      })}

      {/* Taskbar */}
      <div className="shrink-0 h-11 bg-neutral-800/95 border-t-2 border-neutral-500 flex items-center px-2 gap-2 z-[200]">
        <div className="relative">
          <button
            onClick={() => setStartMenuOpen((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-gradient-to-b from-[#f4c04a] to-[#e8677a] hover:from-[#f7cd6a] hover:to-[#ea7f90] text-white font-bold text-sm shadow-md cursor-pointer"
          >
            <span>🌙</span> Start
          </button>
          {startMenuOpen && (
            <div className="absolute bottom-full mb-1 left-0 w-44 bg-neutral-100 text-black rounded shadow-xl border border-neutral-400 overflow-hidden">
              <button
                onClick={onLogout}
                className="w-full text-left px-3 py-2 text-sm hover:bg-[#e8677a] hover:text-white transition-colors cursor-pointer"
              >
                Disconnect Terminal
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 flex items-center gap-2 overflow-x-auto">
          {openWindows.map((w) => {
            const title = WINDOW_TITLES[w.id];
            if (!title) return null;
            const isFocused = zOrder[zOrder.length - 1] === w.id;
            return (
              <button
                key={w.id}
                onClick={() => focusWindow(w.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded text-xs text-white transition-colors cursor-pointer ${
                  isFocused ? 'bg-neutral-600' : 'bg-neutral-700 hover:bg-neutral-600'
                }`}
              >
                <span className="max-w-[120px] truncate">{title}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-white text-xs shrink-0">
          <span>📶</span>
          <span>🔊</span>
          <span>{currentTime}</span>
        </div>
      </div>
    </div>
  );
}

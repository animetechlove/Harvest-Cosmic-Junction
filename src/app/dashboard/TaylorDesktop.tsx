'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface IconDef {
  id: string;
  label: string;
  icon: string;
  windowTitle: string;
}

const ICONS: IconDef[] = [
  { id: 'clock', label: 'Harvest_Clock.exe', icon: '⏰', windowTitle: 'Harvest_Clock.exe' },
  { id: 'mochi', label: "Mochi's_Log.txt", icon: '🐩', windowTitle: "Mochi's_Log.txt" },
  { id: 'exported', label: 'Exported_Memory_Files', icon: '📂', windowTitle: 'Exported_Memory_Files' },
  { id: 'report', label: 'Efficiency_Report_DO_NOT_SUBMIT.xlsx', icon: '📊', windowTitle: 'Efficiency_Report_DO_NOT_SUBMIT.xlsx' },
  { id: 'pings', label: 'NovaNet_Pings.txt', icon: '📱', windowTitle: 'NovaNet_Pings.txt' },
  { id: 'sneakers', label: 'WingedTops_Diagnostics.log', icon: '👟', windowTitle: 'WingedTops_Diagnostics.log' },
  { id: 'admin', label: 'Lead_Admin_Watchlist.txt', icon: '⚠️', windowTitle: 'Lead_Admin_Watchlist.txt' },
  { id: 'selfies', label: 'Taylor_Selfies', icon: '📁', windowTitle: 'Taylor_Selfies' },
];

const DEFAULT_ICON_POSITIONS: Record<string, { x: number; y: number }> = {
  clock: { x: 24, y: 20 },
  mochi: { x: 154, y: 20 },
  exported: { x: 24, y: 112 },
  report: { x: 154, y: 112 },
  pings: { x: 24, y: 204 },
  sneakers: { x: 154, y: 204 },
  admin: { x: 24, y: 296 },
  selfies: { x: 154, y: 296 },
};

const WINDOW_LINES: Record<string, string[]> = {
  clock: [
    "Desk app synced to my actual Harvest Clock. Don't ask HR why it's louder than everyone else's monitor fan.",
    "5:01 PM, every single day, it pulses and my monitor glitches for exactly one second. I stopped reporting it months ago.",
    "Kept it running through the last three 'mandatory upgrades.' They think it's a peripheral. It's the only honest thing on this desk.",
  ],
  mochi: [
    'She barked at the Lead Admin\'s icon for a full minute straight today. I have never been prouder of a dog in my life.',
    'Sleeps in my bag during my whole shift. Somehow always wakes up exactly when I need backup.',
    "If Mochi doesn't like someone, I don't trust them. She's never once been wrong.",
  ],
  exported: [
    "orchard_blue_rose_ARCHIVE.raw — pulled this before the wipe finished. I genuinely don't know if it's supposed to still open.",
    'grandpa_notes_TRANSCRIBED.txt — he told me about that orchard years before any of this. I thought it was just a bedtime story.',
    "If anyone from IT is reading this: no, I don't know how these files got here. Yes, I'm keeping them.",
  ],
  pings: [
    "[PING] THE JUNCTION. 12:30 PM. BRING THE CLOCK. — still don't know how a message arrived from a time that hasn't happened yet.",
    "[PING] whoever's sending these knows my schedule better than my own calendar app does.",
    "Not deleting a single one, no matter how many times the system flags them as spam.",
  ],
  sneakers: [
    "Sneakers reading 'caffeinated copper' again. Not an official diagnostic term. I made it up. It's still accurate.",
    'Lag-Dash burned through half my battery in one hallway sprint today. Worth every percent.',
    'Nobody in this office has noticed my shoes sparkle mid-run yet. Small miracles.',
  ],
  admin: [
    "His face is a loading icon. It has been for three years. Nobody else finds that strange, which is honestly the strangest part.",
    "He told me 'history is a memory leak' to my face and expected me to just nod along.",
    "Keeping a list. Not totally sure what it's for yet. Feels important to have one anyway.",
  ],
  selfies: [
    'mirror_pic_47.png — the bucket hat lighting was IMMACULATE that day, no notes.',
    "grid_office_ootd.png — wore the good glitter blazer to a meeting that didn't deserve it.",
    "Not everything on this desktop has to be a conspiracy. Some of it's just me being cute.",
  ],
};

const REPORT_ENTRIES = [
  'The version they get says Efficiency Rating: 99.8%. This one says I stopped counting around Tuesday.',
  "Column C is just a running list of things the Admin called 'bloatware' this week. It's longer than it should be.",
  "Column D: things that were definitely not bloatware. Grandma's roses. A whole orchard. Apparently my own memory.",
  'Someday I am actually going to hit submit on this version, just to see what happens.',
];

interface OpenWindow {
  id: string;
  x: number;
  y: number;
}

const DRAG_THRESHOLD = 4;

function DraggableIcon({
  id,
  x,
  y,
  onMove,
  onOpen,
  children,
}: {
  id: string;
  x: number;
  y: number;
  onMove: (id: string, x: number, y: number) => void;
  onOpen: (id: string) => void;
  children: React.ReactNode;
}) {
  const dragState = useRef<{ startX: number; startY: number; origX: number; origY: number; moved: boolean } | null>(null);

  const updatePosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!dragState.current) return;
      const dx = clientX - dragState.current.startX;
      const dy = clientY - dragState.current.startY;
      if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
        dragState.current.moved = true;
      }
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
    const wasDrag = dragState.current?.moved;
    dragState.current = null;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', endDrag);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', endDrag);
    if (!wasDrag) onOpen(id);
  }, [handleMouseMove, handleTouchMove, onOpen, id]);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragState.current = { startX: e.clientX, startY: e.clientY, origX: x, origY: y, moved: false };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', endDrag);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    dragState.current = { startX: touch.clientX, startY: touch.clientY, origX: x, origY: y, moved: false };
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
      className="absolute w-[120px] touch-none"
      style={{ left: x, top: y }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {children}
    </div>
  );
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
  footer,
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
  footer?: React.ReactNode;
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
      className="absolute w-[300px] sm:w-[380px] rounded shadow-2xl border border-neutral-400 bg-white text-black select-none"
      style={{ left: x, top: y, zIndex }}
      onMouseDown={() => onFocus(id)}
    >
      <div
        className="flex items-center justify-between px-2 py-1.5 bg-gradient-to-r from-orange-600 via-orange-500 to-pink-500 text-white text-sm font-bold rounded-t cursor-move touch-none"
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
      <div className="p-3 text-xs sm:text-sm leading-relaxed max-h-[50vh] overflow-y-auto">
        {children}
      </div>
      {footer && <div className="flex justify-end gap-2 px-3 pb-3 pt-1">{footer}</div>}
    </div>
  );
}

export default function TaylorDesktop({ onLogout }: { onLogout: () => void }) {
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [zOrder, setZOrder] = useState<string[]>([]);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [iconPositions, setIconPositions] = useState(DEFAULT_ICON_POSITIONS);
  const nextOffset = useRef(0);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
      );
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
      return [...prev, { id, x: 160 + offset, y: 90 + offset }];
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

  const moveIcon = useCallback((id: string, x: number, y: number) => {
    setIconPositions((prev) => ({ ...prev, [id]: { x, y } }));
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none font-mono">
      {/* Network Grid wallpaper - CSS-built Y2K corporate office scene (no
          uploaded art yet for Taylor; swap in a real background image the
          same way Kristin's was added, by dropping a file in /public and
          pointing this div's backgroundImage at it). */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#ff7a3d] via-[#ff9a5c] to-[#ffc98a]" />
      <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)] bg-[length:48px_48px]" />
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#3a1f4d] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 flex items-end justify-center gap-1 px-4">
        {[40, 64, 52, 80, 36, 70, 48, 90, 44, 60].map((h, i) => (
          <div
            key={i}
            className="flex-1 max-w-16 bg-[#2a1640]/80 rounded-t-sm"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="absolute top-10 right-1/4 w-40 h-40 rounded-full bg-gradient-to-br from-yellow-200 to-orange-300 blur-2xl opacity-70" />

      {/* Holographic "Productivity Ping" notices, styled like the story's Bureau UI */}
      <div className="absolute top-6 right-4 sm:right-10 w-36 bg-black/60 border border-pink-300/50 text-pink-100 text-[10px] p-2 rounded shadow-lg backdrop-blur-sm">
        [EFFICIENCY RATING: 99.8%]
      </div>
      <div className="absolute bottom-24 right-4 sm:right-10 w-44 bg-black/60 border border-orange-300/50 text-orange-100 text-[10px] p-2 rounded shadow-lg backdrop-blur-sm">
        TASK 402: Compile Fragmented Sector Data.
      </div>

      {/* Desktop icons - draggable, click (without dragging) to open */}
      {ICONS.map((iconDef) => {
        const pos = iconPositions[iconDef.id] ?? DEFAULT_ICON_POSITIONS[iconDef.id];
        return (
          <DraggableIcon key={iconDef.id} id={iconDef.id} x={pos.x} y={pos.y} onMove={moveIcon} onOpen={openWindow}>
            <div className="w-full flex flex-col items-center text-center p-2 rounded hover:bg-white/10 select-none cursor-grab active:cursor-grabbing">
              <span className="text-3xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">{iconDef.icon}</span>
              <span className="w-full text-[10px] text-white mt-1 leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] break-words">
                {iconDef.label}
              </span>
            </div>
          </DraggableIcon>
        );
      })}

      {/* Open windows */}
      {openWindows.map((w) => {
        const icon = ICONS.find((i) => i.id === w.id);
        if (!icon) return null;
        const isReport = w.id === 'report';
        return (
          <DraggableWindow
            key={w.id}
            id={w.id}
            title={icon.windowTitle}
            x={w.x}
            y={w.y}
            zIndex={100 + zOrder.indexOf(w.id)}
            onFocus={focusWindow}
            onClose={closeWindow}
            onMove={moveWindow}
            footer={
              isReport ? (
                <>
                  <button
                    onClick={() => closeWindow(w.id)}
                    className="px-3 py-1 text-xs bg-neutral-200 hover:bg-neutral-300 border border-neutral-400 rounded-sm cursor-pointer"
                  >
                    OK
                  </button>
                  <button
                    onClick={() => closeWindow(w.id)}
                    className="px-3 py-1 text-xs bg-neutral-200 hover:bg-neutral-300 border border-neutral-400 rounded-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => closeWindow(w.id)}
                    className="px-3 py-1 text-xs bg-neutral-200 hover:bg-neutral-300 border border-neutral-400 rounded-sm cursor-pointer"
                  >
                    Close
                  </button>
                </>
              ) : undefined
            }
          >
            {isReport ? (
              <ul className="list-disc list-inside space-y-2">
                {REPORT_ENTRIES.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            ) : (
              <div className="space-y-2 font-sans">
                {WINDOW_LINES[w.id]?.map((line, i) => (
                  <p key={i} className={line === '' ? 'h-2' : ''}>{line}</p>
                ))}
              </div>
            )}
          </DraggableWindow>
        );
      })}

      {/* Taskbar */}
      <div className="absolute bottom-0 inset-x-0 h-11 bg-neutral-800/95 border-t-2 border-neutral-500 flex items-center px-2 gap-2 z-[200]">
        <div className="relative">
          <button
            onClick={() => setStartMenuOpen((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-gradient-to-b from-orange-500 to-pink-600 hover:from-orange-400 hover:to-pink-500 text-white font-bold text-sm shadow-md cursor-pointer"
          >
            <span>🍑</span> Start
          </button>
          {startMenuOpen && (
            <div className="absolute bottom-full mb-1 left-0 w-44 bg-neutral-100 text-black rounded shadow-xl border border-neutral-400 overflow-hidden">
              <button
                onClick={onLogout}
                className="w-full text-left px-3 py-2 text-sm hover:bg-orange-500 hover:text-white transition-colors cursor-pointer"
              >
                Disconnect Terminal
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 flex items-center gap-2 overflow-x-auto">
          {openWindows.map((w) => {
            const icon = ICONS.find((i) => i.id === w.id);
            if (!icon) return null;
            const isFocused = zOrder[zOrder.length - 1] === w.id;
            return (
              <button
                key={w.id}
                onClick={() => focusWindow(w.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded text-xs text-white transition-colors cursor-pointer ${
                  isFocused ? 'bg-neutral-600' : 'bg-neutral-700 hover:bg-neutral-600'
                }`}
              >
                <span>{icon.icon}</span>
                <span className="max-w-[100px] truncate">{icon.windowTitle}</span>
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

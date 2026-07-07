'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface IconDef {
  id: string;
  label: string;
  icon: string;
  windowTitle: string;
}

const ICONS: IconDef[] = [
  { id: 'charter', label: 'Town_Charter_Scan_1924.pdf', icon: '📜', windowTitle: 'Town_Charter_Scan_1924.pdf' },
  { id: 'railway', label: 'Original_Railway_Maps_Merged.png', icon: '🗺️', windowTitle: 'Original_Railway_Maps_Merged.png' },
  { id: 'surveys', label: 'Historic_Property_Surveys_Sorted_by_Date', icon: '📁', windowTitle: 'Historic_Property_Surveys_Sorted_by_Date' },
  { id: 'signrefurb', label: 'Historic_Sign_Refurb_Plant.xlsx', icon: '📊', windowTitle: 'Historic_Sign_Refurb_Plant.xlsx' },
  { id: 'archivedb', label: 'Junction_Archive_Database_Login.exe', icon: '💻', windowTitle: 'Junction_Archive_Database_Login.exe' },
  { id: 'journal', label: 'Voices_of_Junction_FINAL_Draft.wpd', icon: '📝', windowTitle: "Historian's Journal Entry" },
];

const WINDOW_LINES: Record<string, string[]> = {
  charter: [
    'Digitized scan of the original 1924 town charter.',
    'Article 7 references a "junction easement" granted to an unnamed party...',
    'The signature block is smudged beyond recognition.',
  ],
  railway: [
    'Merged railway survey maps, 1918-1952.',
    'The original spur line bends sharply near the junction for no engineering reason anyone can explain.',
    'Overlaying three decades of maps shows the bend has slowly been "straightening" itself.',
  ],
  surveys: [
    'Historic_Property_Surveys_Sorted_by_Date/',
    '  survey_1952.pdf',
    '  survey_1968.pdf',
    '  survey_1985.pdf',
    '  survey_2003.pdf',
    '',
    'All four surveys mark the same plot as "unbuildable" without explanation.',
  ],
  signrefurb: [
    'Refurbishment log for the old station sign.',
    'Row 14: Replacement lettering ordered - the original plaque underneath reads differently under UV light.',
    'Row 22: Cost overrun flagged, reason left blank.',
  ],
  archivedb: [
    'CONNECTING TO JUNCTION_ARCHIVE_DB...',
    'ACCESS LEVEL: HISTORIAN (READ-ONLY)',
    '',
    'WARNING: 3 records flagged "DO NOT DIGITIZE" by the previous archivist.',
  ],
};

const JOURNAL_ENTRIES = [
  'Entry 147: Found new evidence of the original railway bridge materials...',
  'Note: Need to cross-reference property surveys from 1952...',
  'Task: Digitizing the oral history recordings continues (85% complete)...',
  "Thought: Found a curious note about 'Harvest Cosmic Junction' folklore...",
];

interface OpenWindow {
  id: string;
  x: number;
  y: number;
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

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.current) return;
      const dx = e.clientX - dragState.current.startX;
      const dy = e.clientY - dragState.current.startY;
      onMove(id, dragState.current.origX + dx, dragState.current.origY + dy);
    },
    [id, onMove]
  );

  const handleMouseUp = useCallback(() => {
    dragState.current = null;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleTitleMouseDown = (e: React.MouseEvent) => {
    onFocus(id);
    dragState.current = { startX: e.clientX, startY: e.clientY, origX: x, origY: y };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      className="absolute w-[300px] sm:w-[380px] rounded shadow-2xl border border-neutral-400 bg-white text-black select-none"
      style={{ left: x, top: y, zIndex }}
      onMouseDown={() => onFocus(id)}
    >
      <div
        className="flex items-center justify-between px-2 py-1.5 bg-gradient-to-r from-blue-700 via-blue-500 to-blue-600 text-white text-sm font-bold rounded-t cursor-move"
        onMouseDown={handleTitleMouseDown}
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

export default function KristinDesktop({ onLogout }: { onLogout: () => void }) {
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);
  const [zOrder, setZOrder] = useState<string[]>([]);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
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

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none font-mono">
      {/* Illustrated sunset/train-station wallpaper (logo baked into the artwork) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/kristin-desktop-bg.png')" }}
      />

      {/* Sticky notes */}
      <div className="absolute top-6 right-4 sm:right-10 w-32 bg-yellow-100 text-yellow-900 text-[10px] p-2 rounded shadow-lg -rotate-3">
        New Comic Update every Friday!
      </div>
      <div className="absolute bottom-24 right-4 sm:right-10 w-40 bg-yellow-100 text-yellow-900 text-[10px] p-2 rounded shadow-lg rotate-2">
        Reminder: Junction Historical Society Meeting Tuesday! - K. Wright
      </div>

      {/* Desktop icons */}
      <div className="absolute top-4 left-4 grid grid-cols-2 gap-x-6 gap-y-4 w-[280px] sm:w-[340px]">
        {ICONS.map((iconDef) => (
          <button
            key={iconDef.id}
            onDoubleClick={() => openWindow(iconDef.id)}
            onClick={() => openWindow(iconDef.id)}
            className="w-full flex flex-col items-center text-center p-2 rounded hover:bg-white/10 focus:bg-white/20 transition-colors cursor-pointer"
          >
            <span className="text-3xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">{iconDef.icon}</span>
            <span className="w-full text-[10px] text-white mt-1 leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] break-words">
              {iconDef.label}
            </span>
          </button>
        ))}
      </div>

      {/* Open windows */}
      {openWindows.map((w) => {
        const icon = ICONS.find((i) => i.id === w.id);
        if (!icon) return null;
        const isJournal = w.id === 'journal';
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
              isJournal ? (
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
            {isJournal ? (
              <ul className="list-disc list-inside space-y-2">
                {JOURNAL_ENTRIES.map((line, i) => (
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-gradient-to-b from-green-500 to-green-700 hover:from-green-400 hover:to-green-600 text-white font-bold text-sm shadow-md cursor-pointer"
          >
            <span>🌙</span> Start
          </button>
          {startMenuOpen && (
            <div className="absolute bottom-full mb-1 left-0 w-44 bg-neutral-100 text-black rounded shadow-xl border border-neutral-400 overflow-hidden">
              <button
                onClick={onLogout}
                className="w-full text-left px-3 py-2 text-sm hover:bg-blue-500 hover:text-white transition-colors cursor-pointer"
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

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface IconDef {
  id: string;
  label: string;
  icon: string;
  windowTitle: string;
}

const ICONS: IconDef[] = [
  { id: 'charter', label: 'kw_TownCharter_1924_ANNOTATED.pdf', icon: '📜', windowTitle: 'kw_TownCharter_1924_ANNOTATED.pdf' },
  { id: 'railway', label: 'RailwayMaps_1918-1952_OVERLAY.png', icon: '🗺️', windowTitle: 'RailwayMaps_1918-1952_OVERLAY.png' },
  { id: 'surveys', label: 'PropertySurveys_CrossRef_DO_NOT_DELETE', icon: '📁', windowTitle: 'PropertySurveys_CrossRef_DO_NOT_DELETE' },
  { id: 'signrefurb', label: 'SignRefurb_Ledger_discrepancies.xlsx', icon: '📊', windowTitle: 'SignRefurb_Ledger_discrepancies.xlsx' },
  { id: 'archivedb', label: 'JunctionArchive_ACCESS.exe', icon: '💻', windowTitle: 'JunctionArchive_ACCESS.exe' },
  { id: 'journal', label: 'kw_fieldnotes_DRAFT7.wpd', icon: '📝', windowTitle: "K. Wright — Field Notes" },
];

const WINDOW_LINES: Record<string, string[]> = {
  charter: [
    'My scan of the 1924 charter, third pass. Marginal notes are mine.',
    'Article 7 — "junction easement granted to [ILLEGIBLE]." I have read this line more times than I should admit and it does not get more legible.',
    'The signature block is smudged in a way that looks deliberate, not aged. Compare against the sign refurb ledger — same ink behavior?',
  ],
  railway: [
    'Overlay of the 1918, 1934, and 1952 survey maps, aligned by the platform corner.',
    'The spur line bends near the junction with no grade reason to bend at all. I checked with an actual rail engineer. He had no explanation either.',
    'Tracing the bend across all three maps: it is measurably straighter each decade. Tracks do not do that on their own.',
  ],
  surveys: [
    'PropertySurveys_CrossRef_DO_NOT_DELETE/',
    '  survey_1952.pdf',
    '  survey_1968.pdf',
    '  survey_1985.pdf',
    '  survey_2003.pdf',
    '',
    'Four surveyors, four decades, zero explanation given — all four mark this same plot "unbuildable." I want to know who wrote that the first time and made everyone after just copy it down.',
  ],
  signrefurb: [
    'Refurbishment ledger for the old station sign, cross-checked against town spending records.',
    'Row 14: relettering ordered. Under UV the original plaque underneath reads differently. I did not imagine this — I checked it twice, at night, alone, which in hindsight was not my best decision.',
    'Row 22: cost overrun flagged, reason left blank. Same handwriting as the charter\'s smudged signature. I am almost certain of it.',
  ],
  archivedb: [
    'CONNECTING TO JUNCTION_ARCHIVE_DB...',
    'ACCESS LEVEL: HISTORIAN (READ-ONLY)',
    '',
    '3 records flagged "DO NOT DIGITIZE" by the previous archivist, no reason given.',
    'Naturally, those are the three I want most.',
  ],
};

const JOURNAL_ENTRIES = [
  'Entry 147: New evidence on the original railway bridge materials — the timber doesn\'t match anything regionally sourced in 1918. Ordering a second opinion.',
  'Note to self: cross-reference the 1952 survey against the charter\'s Article 7 language before I forget the wording again.',
  'Task: oral history digitization at 85%. The tapes get quieter whenever the junction comes up. Might be the recorder. Might not be.',
  "Thought: keep finding the phrase 'Harvest Cosmic Junction' in places it shouldn't be — margins, ledgers, one survey map's verso. Someone else was keeping notes before me.",
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
      {/* Illustrated sunset/train-station wallpaper (logo baked into the artwork),
          composed natively for landscape (~16:9) so it fills the screen
          edge-to-edge with no stretching and minimal cropping. */}
      <div
        className="absolute inset-0 bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: "url('/kristin-desktop-bg-landscape.png')" }}
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

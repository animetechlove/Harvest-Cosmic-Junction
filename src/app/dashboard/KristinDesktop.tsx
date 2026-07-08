'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface IconDef {
  id: string;
  label: string;
  icon: string;
  windowTitle: string;
  isFolder?: boolean;
}

const ICONS: IconDef[] = [
  { id: 'journal', label: 'Soul_Bible.jrnl', icon: '📖', windowTitle: "Kristen's Soul Bible" },
  { id: 'shadow', label: 'Shadow_Sightings.log', icon: '🐈‍⬛', windowTitle: 'Shadow_Sightings.log' },
  { id: 'archives', label: 'Harvest Junction Archives', icon: '📂', windowTitle: 'Harvest Junction Archives', isFolder: true },
  { id: 'orchard', label: 'Rose_and_Strawberry_Orchard.notes', icon: '🍓', windowTitle: 'Rose_and_Strawberry_Orchard.notes' },
  { id: 'lantern', label: 'Legacy_Lantern_Specs.pdf', icon: '🏮', windowTitle: 'Legacy_Lantern_Specs.pdf' },
  { id: 'derez', label: 'DeRez_Incident_Log.txt', icon: '⚠️', windowTitle: 'DeRez_Incident_Log.txt' },
  { id: 'novanet', label: 'NovaNet_Archive_ACCESS.exe', icon: '💻', windowTitle: 'NovaNet_Archive_ACCESS.exe' },
  { id: 'ceramics', label: 'Ceramics_Studio_Inventory.xlsx', icon: '🏺', windowTitle: 'Ceramics_Studio_Inventory.xlsx' },
];

const DEFAULT_ICON_POSITIONS: Record<string, { x: number; y: number }> = {
  journal: { x: 24, y: 20 },
  shadow: { x: 154, y: 20 },
  archives: { x: 24, y: 112 },
  orchard: { x: 154, y: 112 },
  lantern: { x: 24, y: 204 },
  derez: { x: 154, y: 204 },
  novanet: { x: 24, y: 296 },
  ceramics: { x: 154, y: 296 },
};

const WINDOW_LINES: Record<string, string[]> = {
  shadow: [
    "10:52 PM — Shadow's staring at the hedge again. Nothing there. There's never anything there when I look.",
    "He caught something in the strawberry patch tonight and wouldn't show me. Left a little smear of ash on the porch step instead.",
    'Cats are supposed to not care about much. Mine flinches at static like it said his name.',
  ],
  archives: [
    'Old town charter, scanned page by page. Article 7 still doesn\'t explain the "junction easement" — I\'ve read that line more times than I should admit.',
    'Central Library records, half of them technically shouldn\'t still exist. I\'m not going to be the one who asks why out loud.',
    "Keep finding references to something called a 'Master Index' in the margins. No idea what it indexes. Yet.",
  ],
  orchard: [
    'Grandma planted the blue roses the year she moved here. She told me once they only grow where something is remembered.',
    "The county wants to 'rezone' the east row. Nobody but me seems to notice that's also where the flickering started.",
    "The strawberry bushes came back this morning like nothing happened. I'm fairly sure I'm the only one who noticed they'd ever left.",
  ],
  lantern: [
    "The lantern's been in the family longer than anyone can actually date. It doesn't run on anything I can identify, and I've tried.",
    'It lights on its own near the tree line. Only ever at 8 PM, never earlier, never later.',
    "When it's lit, the paths through the orchard that don't usually make sense... do.",
  ],
  derez: [
    '[LOG] 8:04 PM — patch of grass by the fence went grey for six seconds. Grew back green like it was embarrassed.',
    "[LOG] Strawberry bush, row 3: gone, then not gone. Didn't tell anyone. They'd just send someone to 'check on me.'",
    "[LOG] The static has a smell. Burnt copper. I don't know how I know that, but I do, every time.",
  ],
  novanet: [
    'CONNECTING TO NOVA.NET ARCHIVE...',
    'ACCESS LEVEL: GUEST — the town won\'t give a historian more than that, apparently.',
    '',
    "One file keeps re-appearing no matter how many times it gets marked deleted: MASTER_INDEX.gold",
    "I don't know who else has seen this. I don't think I'm supposed to have.",
  ],
  ceramics: [
    'Kiln log — bisque firing Tuesday, glaze Thursday if the studio actually holds temperature this time.',
    'Finally got the cat-shaped charm right on the third try. Grandma always said the third try is the honest one.',
    "Note to self: clay from the east row of the orchard fires darker than it should. Haven't decided if I want to know why.",
  ],
};

const JOURNAL_ENTRIES = [
  "Grandma's blue rose flickered again tonight — just for a second, like it forgot what it was supposed to be. I kept my hand on the dirt until it stopped.",
  "Shadow won't sleep by the window anymore. He sits by the door instead, ears up, like something's coming and he'd rather see it first.",
  'I keep telling myself the strawberry rows are fine. Three of them went quiet last week. Not dead — just gone, then back, like a held breath.',
  "Started calling myself the Librarian of the Lost in my head. Don't know if that's brave or just what happens when nobody else is looking.",
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

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState.current) return;
      const dx = e.clientX - dragState.current.startX;
      const dy = e.clientY - dragState.current.startY;
      if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
        dragState.current.moved = true;
      }
      onMove(id, dragState.current.origX + dx, dragState.current.origY + dy);
    },
    [id, onMove]
  );

  const handleMouseUp = useCallback(() => {
    const wasDrag = dragState.current?.moved;
    dragState.current = null;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    if (!wasDrag) onOpen(id);
  }, [handleMouseMove, onOpen, id]);

  const handleMouseDown = (e: React.MouseEvent) => {
    dragState.current = { startX: e.clientX, startY: e.clientY, origX: x, origY: y, moved: false };
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
    <div className="absolute w-[120px]" style={{ left: x, top: y }} onMouseDown={handleMouseDown}>
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

      {/* Desktop icons — draggable, click (without dragging) to open */}
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

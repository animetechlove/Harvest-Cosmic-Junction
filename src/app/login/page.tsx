'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
...
export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="w-screen h-screen bg-[#0d0e12]" />}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // 1. Fallback profile routing theme dictionary
  const themes: Record<string, UserTheme> = {
    kristin: { name: 'Kristin', role: 'Town Historian', bgClass: 'bg-[#1a050a]', borderClass: 'border-red-900', textClass: 'text-red-200', accentText: 'text-red-400' },
    taylor: { name: 'Taylor', role: 'Mystery Solver', bgClass: 'bg-[#1c1205]', borderClass: 'border-orange-900', textClass: 'text-orange-200', accentText: 'text-orange-400' },
    nova: { name: 'Nova', role: 'Cosmic Weaver', bgClass: 'bg-[#05161a]', borderClass: 'border-cyan-900', textClass: 'text-cyan-200', accentText: 'text-cyan-400' },
    jace: { name: 'Jace', role: 'Mechanic', bgClass: 'bg-[#121415]', borderClass: 'border-zinc-700', textClass: 'text-zinc-300', accentText: 'text-emerald-400' },
    rowan: { name: 'Rowan', role: 'Botanist', bgClass: 'bg-[#061405]', borderClass: 'border-green-900', textClass: 'text-green-200', accentText: 'text-green-400' },
    orion: { name: 'Orion', role: 'Stargazer', bgClass: 'bg-[#0b051a]', borderClass: 'border-purple-900', textClass: 'text-purple-200', accentText: 'text-purple-400' },
  };

  const currentUserKey = searchParams.get('user') || 'kristin';
  const theme = themes[currentUserKey] || themes.kristin;

  // 2. Hydration guard & real-time retro digital clock string formatting
  useEffect(() => {
    setMounted(true);
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return <div className="w-screen h-screen bg-[#0d0e12]" />;
  }

  return (
    <main className={`w-screen h-screen ${theme.bgClass} ${theme.textClass} font-mono flex flex-col justify-between select-none overflow-hidden p-1`}>
      
      {/* Vintage Workspace Header Toolbar */}
      <div className={`w-full bg-black/40 border-b-2 ${theme.borderClass} px-4 py-2 flex items-center justify-between text-xs`}>
        <div className="flex items-center gap-4">
          <span className="font-bold tracking-widest uppercase">Inkstone OS v1.4</span>
          <span className="opacity-40">|</span>
          <span>Terminal ID: <strong className={theme.accentText}>{theme.name.toUpperCase()}</strong></span>
          <span className="hidden sm:inline opacity-60">({theme.role})</span>
        </div>
        <div className="font-bold tracking-widest">{currentTime}</div>
      </div>

      {/* Main OS Desktop Canvas Grid */}
      <div className="flex-1 p-6 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6 items-start content-start">
        
        {/* App Shortcut: Database File */}
        <button 
          onClick={() => alert(`Opening encrypted personal logs for ${theme.name}...`)}
          className={`flex flex-col items-center gap-2 p-2 rounded border border-transparent hover:bg-white/5 hover:${theme.borderClass} transition-all group w-24`}
        >
          <div className={`text-2xl group-hover:scale-110 transition-transform ${theme.accentText}`}>💾</div>
          <div className="text-[11px] text-center truncate w-full tracking-tight">soul_bible.dat</div>
        </button>

        {/* App Shortcut: Communication / Transmissions */}
        <button 
          onClick={() => alert("Accessing active telemetry radio frequencies...")}
          className={`flex flex-col items-center gap-2 p-2 rounded border border-transparent hover:bg-white/5 hover:${theme.borderClass} transition-all group w-24`}
        >
          <div className={`text-2xl group-hover:scale-110 transition-transform ${theme.accentText}`}>📡</div>
          <div className="text-[11px] text-center truncate w-full tracking-tight">frequency.sys</div>
        </button>

        {/* App Shortcut: Evidence Grid or Files */}
        <button 
          onClick={() => alert("Loading local map coordinates directory...")}
          className={`flex flex-col items-center gap-2 p-2 rounded border border-transparent hover:bg-white/5 hover:${theme.borderClass} transition-all group w-24`}
        >
          <div className={`text-2xl group-hover:scale-110 transition-transform ${theme.accentText}`}>🗺️</div>
          <div className="text-[11px] text-center truncate w-full tracking-tight">junction_map.lnk</div>
        </button>

      </div>

      {/* Retro Footnote Taskbar */}
      <div className={`w-full bg-black/60 border-t-2 ${theme.borderClass} px-4 py-1.5 flex items-center justify-between text-[10px] opacity-70`}>
        <div>Click shortcut files to interface with terminal blocks.</div>
        <button 
          onClick={() => router.push('/login')} 
          className={`hover:underline font-bold ${theme.accentText}`}
        >
          [LOGOUT]
        </button>
      </div>

    </main>
  );
}
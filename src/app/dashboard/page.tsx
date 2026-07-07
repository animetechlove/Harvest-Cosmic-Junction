'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DesktopWindow from '@/components/DesktopWindow';

interface Character {
  name: string;
  color: string;
  textColor: string;
  accentColor: string;
  systemName: string;
  logContent: {
    id: string;
    text: string;
  };
}

const CHARACTER_DATA: Record<string, Character> = {
  nova: {
    name: 'Nova',
    color: '#00ffff', // Cyan
    textColor: 'text-[#00ffff]',
    accentColor: 'border-[#00ffff]',
    systemName: 'NOVA_CORE_v4.2',
    logContent: {
      id: '0x9F',
      text: '"The signals from the cosmic junction are fluctuating again. I tried running a calibration pass, but something is bouncing back from the harvest perimeter... It feels less like raw background radiation and more like a deliberate cadence. I haven\'t told the others yet. If the alignment shifts before the cycle is complete, our window closes entirely."'
    }
  },
  kristin: {
    name: 'Kristin',
    color: '#800020', // Maroon
    textColor: 'text-[#800020]',
    accentColor: 'border-[#800020]',
    systemName: 'APOTHECARY_REGISTRY_SECURE',
    logContent: {
      id: '0x12',
      text: '"Batch #108 is stable, but the catalytic threshold is off by two percent. The botanical samples from the lower quadrant are resisting synthesis under standard pressure. I might need to adjust the extraction timing manually. If Nova\'s array calculations are accurate, the environmental density will spike by midnight anyway. We\'re running out of clean glassware."'
    }
  },
  taylor: {
    name: 'Taylor',
    color: '#FF8C00', // Orange
    textColor: 'text-[#FF8C00]',
    accentColor: 'border-[#FF8C00]',
    systemName: 'CASEFILE_TRACKER_v2.1',
    logContent: {
      id: '0x3D',
      text: '"Three witnesses, three different timelines. Either everyone in town is lying to me, or the cosmic junction is doing something to memory itself. I cross-referenced the harvest schedules against Nova\'s signal logs — the gaps line up exactly with the blackout windows. That\'s not a coincidence. I need eyes on the perimeter before the next cycle."'
    }
  },
  jace: {
    name: 'Jace',
    color: '#aac0af', // Moss
    textColor: 'text-[#aac0af]',
    accentColor: 'border-[#aac0af]',
    systemName: 'FIELD_RIG_DIAGNOSTIC',
    logContent: {
      id: '0x7A',
      text: '"Replaced the coupling on the harvest rig for the third time this month. Metal fatigue doesn\'t explain it — something is stressing these parts from the inside out. Rowan thinks it\'s the soil chemistry, but the wear pattern looks electromagnetic to me. Rigging a shielded sensor to see what it picks up."'
    }
  },
  rowan: {
    name: 'Rowan',
    color: '#32CD32', // Lime
    textColor: 'text-[#32CD32]',
    accentColor: 'border-[#32CD32]',
    systemName: 'BOTANICAL_SURVEY_LOG',
    logContent: {
      id: '0x21',
      text: '"The lower quadrant samples are growing in spiral patterns again, always oriented toward the junction. I\'ve never seen phototropism behave like this without a light source. Kristin\'s extraction batches from the same soil are destabilizing faster than usual too. Whatever is under that field, it\'s not staying contained."'
    }
  },
  orion: {
    name: 'Orion',
    color: '#9370DB', // Purple
    textColor: 'text-[#9370DB]',
    accentColor: 'border-[#9370DB]',
    systemName: 'OBSERVATORY_DATALINK',
    logContent: {
      id: '0x5E',
      text: '"Charted the sky against the harvest calendar going back forty years. Every major alignment matches a recorded disturbance at the junction, further back than anyone alive should remember. If Nova\'s calibration holds, the next convergence isn\'t decades away. It\'s weeks."'
    }
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [isFileOpen, setIsFileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // Protect the route & load session state
  useEffect(() => {
    const activeUser = localStorage.getItem('activeUser');
    if (!activeUser || !CHARACTER_DATA[activeUser]) {
      router.push('/');
    } else {
      setCharacter(CHARACTER_DATA[activeUser]);
    }

    // Vintage system clock simulator
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace('GMT', 'SYS_UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [router]);

  if (!character) return null;

  return (
    <div className="min-h-screen bg-black text-gray-400 p-4 font-mono select-none relative overflow-hidden">
      {/* Dynamic Scanline Grid Filter Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-40" />

      {/* Top Status Taskbar */}
      <div className={`w-full border-b-2 pb-2 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center text-xs md:text-sm ${character.accentColor}`}>
        <div className="flex items-center space-x-3">
          <span className={`font-bold animate-pulse ${character.textColor}`}>● ONLINE</span>
          <span>STATION: <strong className="text-white">{character.systemName}</strong></span>
        </div>
        <div className="text-gray-500 mt-1 md:mt-0">{currentTime}</div>
      </div>

      {/* Main Application Area */}
      <div className="max-w-4xl mx-auto mt-8">
        <h2 className="text-sm text-gray-500 mb-4 font-bold">// DESKTOP_ROOT / SHORTCUTS</h2>
        
        {/* Grid System for Interactive File Apps */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          
          {/* File App 1: soul_bible.dat */}
          <button 
            onClick={() => setIsFileOpen(true)}
            className="flex flex-col items-center p-4 border border-transparent hover:border-gray-800 hover:bg-neutral-950 transition-all rounded group text-center"
          >
            <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform duration-100">📁</div>
            <span className="text-xs text-white font-semibold">soul_bible.dat</span>
            <span className="text-[10px] text-gray-600 mt-0.5">Encrypted Log</span>
          </button>

          {/* Locked App Placeholder 2 */}
          <div className="flex flex-col items-center p-4 opacity-40 text-center cursor-not-allowed">
            <div className="text-4xl mb-2">🔒</div>
            <span className="text-xs text-gray-500">frequency.sys</span>
            <span className="text-[10px] text-gray-700 mt-0.5">Offline Link</span>
          </div>

        </div>
      </div>

      {/* Floating Interactive Window Container */}
      <DesktopWindow 
        title="soul_bible.dat" 
        isOpen={isFileOpen} 
        onClose={() => setIsFileOpen(false)}
        colorClass={character.color}
      >
        <div className="space-y-3">
          <p className="text-amber-500 font-bold tracking-wider animate-pulse">
            &gt;&gt; [DECRYPTED LOG ENTRY - LOG_ID: {character.logContent.id}]
          </p>
          <p className="leading-relaxed text-gray-200 border-l-2 pl-3 border-neutral-800 italic">
            {character.logContent.text}
          </p>
          <div className="pt-2 border-t border-neutral-900 flex justify-between text-[10px] text-gray-500">
            <span>INTEGRITY: SECURE</span>
            <span>ALIGNED_CORE: true</span>
          </div>
        </div>
      </DesktopWindow>

      {/* Desktop Footer Logout Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-xs text-gray-600 z-30">
        <span>© 2026 COGNITIVE_GATEWAY_NET</span>
        <button 
          onClick={() => {
            localStorage.clear();
            router.push('/');
          }}
          className="hover:text-red-500 font-bold transition-colors cursor-pointer"
        >
          [ DISCONNECT TERMINAL ]
        </button>
      </div>
    </div>
  );
}

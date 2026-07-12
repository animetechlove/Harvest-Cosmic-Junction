import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harvest Cosmic Junction",
  description: "Inkstone Co. Interactive Interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
          <body className="antialiased bg-black min-h-screen m-0 p-0 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}FILE_EOF
cat > src/app/page.tsx << 'FILE_EOF'
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RotatePrompt from '@/components/RotatePrompt';

interface CharacterProfile {
  id: string;
  name: string;
  role: string;
  borderColor: string;
  textColor: string;
  glowClass: string;
  bgColor: string;
  avatarTextColor: string;
  avatarSrc: string;
  passcode: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [isBooted, setIsBooted] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [shutdownProgress, setShutdownProgress] = useState(100);
  const [shutdownDone, setShutdownDone] = useState(false);

  // Character profiles customized using your Tailwind configuration variables
  const characters: CharacterProfile[] = [
    { id: 'kristin', name: 'Kristin', role: 'Town Historian', borderColor: 'border-kristin-maroon', textColor: 'text-kristin-maroon', glowClass: 'shadow-[0_0_15px_rgba(128,0,32,0.5)]', bgColor: 'bg-[#800020]', avatarTextColor: 'text-white', avatarSrc: '/avatars/kristin.png', passcode: 'history' },
    { id: 'taylor', name: 'Taylor', role: 'Mystery Solver', borderColor: 'border-taylor-orange', textColor: 'text-taylor-orange', glowClass: 'shadow-[0_0_15px_rgba(255,140,0,0.5)]', bgColor: 'bg-[#FF8C00]', avatarTextColor: 'text-white', avatarSrc: '/avatars/taylor.png', passcode: 'clue' },
    { id: 'nova', name: 'Nova', role: 'Cosmic Weaver', borderColor: 'border-nova-cyan', textColor: 'text-nova-cyan', glowClass: 'shadow-[0_0_15px_rgba(0,255,255,0.5)]', bgColor: 'bg-[#4b0082]', avatarTextColor: 'text-white', avatarSrc: '/avatars/nova.png', passcode: 'signal' },
    { id: 'jace', name: 'Jace', role: 'Mechanic / Engineer', borderColor: 'border-jace-steel', textColor: 'text-jace-moss', glowClass: 'shadow-[0_0_15px_rgba(170,192,175,0.4)]', bgColor: 'bg-[#aac0af]', avatarTextColor: 'text-[#2f3a30]', avatarSrc: '/avatars/jace.png', passcode: 'wrench' },
    { id: 'rowan', name: 'Rowan', role: 'Botanist', borderColor: 'border-rowan-forest', textColor: 'text-rowan-lime', glowClass: 'shadow-[0_0_15px_rgba(50,205,50,0.5)]', bgColor: 'bg-[#228B22]', avatarTextColor: 'text-white', avatarSrc: '/avatars/rowan.png', passcode: 'clover' },
    { id: 'orion', name: 'Orion', role: 'Stargazer', borderColor: 'border-orion-royal', textColor: 'text-orion-purple', glowClass: 'shadow-[0_0_15px_rgba(147,112,219,0.5)]', bgColor: 'bg-[#4169E1]', avatarTextColor: 'text-white', avatarSrc: '/avatars/orion.png', passcode: 'nebula' },
  ];

  const [selectedChar, setSelectedChar] = useState<CharacterProfile>(characters[0]);
  const [formVisible, setFormVisible] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState(false);

  // 1. Force the page to wait until it is safely mounted on your computer's browser
  useEffect(() => {
    setMounted(true);
  }, []);

  // 1b. Automatic BIOS Boot Simulator
  useEffect(() => {
    if (bootProgress < 100) {
      const timeout = setTimeout(() => {
        setBootProgress((prev) => Math.min(prev + 4, 100));
      }, 80); // Adjust speed of the vintage text roll here
      return () => clearTimeout(timeout);
    } else {
      // Small pause at 100% for dramatic cinematic effect
      const transitionTimeout = setTimeout(() => {
        setIsBooted(true);
      }, 600);
      return () => clearTimeout(transitionTimeout);
    }
  }, [bootProgress]);

  // 1c. Shutdown countdown, mirrors the boot sequence in reverse
  useEffect(() => {
    if (!isShuttingDown) return;
    if (shutdownProgress > 0) {
      const timeout = setTimeout(() => {
        setShutdownProgress((prev) => Math.max(prev - 4, 0));
      }, 80);
      return () => clearTimeout(timeout);
    } else {
      const transitionTimeout = setTimeout(() => {
        setShutdownDone(true);
      }, 600);
      return () => clearTimeout(transitionTimeout);
    }
  }, [isShuttingDown, shutdownProgress]);

  const handleShutdown = () => {
    setIsShuttingDown(true);
  };

  const handleReboot = () => {
    setIsShuttingDown(false);
    setShutdownProgress(100);
    setShutdownDone(false);
    setBootProgress(0);
    setIsBooted(false);
    setFormVisible(false);
    setError(false);
    setPasswordInput('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordInput.toLowerCase() === selectedChar.passcode || passwordInput.toLowerCase() === 'guest') {
      setError(false);
      localStorage.setItem('activeUser', selectedChar.id);
      router.push(`/dashboard?user=${selectedChar.id}`);
    } else {
      setError(true);
      setPasswordInput('');
    }
  };

  // 2. Return an empty layout wrapper on the server side so there is zero HTML friction
  if (!mounted) {
    return <div className="w-screen h-screen bg-[#0d0e12]" />;
  }

  // 2b. Shutdown sequence, triggered from "Turn off computer"
  if (isShuttingDown) {
    const totalPips = 24;
    const filledPips = Math.round((shutdownProgress / 100) * totalPips);
    const progressBar = '#'.repeat(filledPips) + '.'.repeat(totalPips - filledPips);

    return (
      <div
        className="min-h-screen w-screen bg-black text-green-400 font-mono select-none relative flex flex-col items-center justify-center p-6 overflow-hidden cursor-pointer"
        onClick={() => shutdownDone && handleReboot()}
      >
        <RotatePrompt />
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-50" />

        {!shutdownDone ? (
          <div className="flex flex-col items-center [text-shadow:0_0_10px_rgba(74,222,128,0.7)]">
            <h1 className="text-2xl md:text-3xl font-bold tracking-widest uppercase mb-6">Inkstone Co.</h1>
            <div className="w-full max-w-md sm:max-w-lg">
              <div className="flex justify-between gap-4 text-xs md:text-sm mb-1">
                <span>STATUS: SHUTTING DOWN...</span>
                <span>LOAD %: {shutdownProgress}</span>
              </div>
              <div className="text-sm md:text-base border border-green-700 px-2 py-1 tracking-tighter whitespace-pre">
                [{progressBar}]
              </div>
            </div>
            <div className="mt-4 text-[10px] md:text-xs text-center opacity-80 space-y-0.5">
              <p>Closing all open case files...</p>
              <p>Archiving session to Inkstone Collective servers...</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center [text-shadow:0_0_10px_rgba(74,222,128,0.7)]">
            <p className="text-lg md:text-xl mb-2 animate-pulse">It is now safe to turn off your Inkstone Co. terminal.</p>
            <p className="text-xs md:text-sm opacity-70">...see you at the junction.</p>
            <p className="mt-8 text-[10px] md:text-xs opacity-50">Click anywhere to reboot</p>
          </div>
        )}
      </div>
    );
  }

  // 3. Vintage Inkstone Co. BIOS loading screen, shown before the character login grid
  if (!isBooted) {
    const totalPips = 24;
    const filledPips = Math.round((bootProgress / 100) * totalPips);
    const progressBar = '#'.repeat(filledPips) + '.'.repeat(totalPips - filledPips);

    return (
      <div className="min-h-screen w-screen bg-black text-green-400 font-mono select-none relative flex flex-col items-center justify-center p-6 overflow-hidden">
        <RotatePrompt />
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-50" />

        <div className="flex flex-col items-center [text-shadow:0_0_10px_rgba(74,222,128,0.7)]">
          {/* Inkstone Co. crest: crossed pens, center crystal, ring of stars */}
          <svg width="120" height="120" viewBox="0 0 100 100" className="mb-4">
            <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1.2" fill="none" />
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * 2 * Math.PI;
              const x = 50 + 46 * Math.cos(angle);
              const y = 50 + 46 * Math.sin(angle);
              return <circle key={i} cx={x} cy={y} r="1.1" fill="currentColor" />;
            })}
            <line x1="26" y1="26" x2="74" y2="74" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <line x1="74" y1="26" x2="26" y2="74" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            <polygon points="50,34 59,50 50,66 41,50" fill="currentColor" />
          </svg>

          <h1 className="text-3xl md:text-4xl font-bold tracking-widest uppercase">Inkstone Co.</h1>
          <p className="text-xs md:text-sm tracking-widest uppercase mb-6 opacity-90">(Inkstone Collective)</p>

          <div className="w-full max-w-md">
            <div className="flex justify-between text-xs md:text-sm mb-1">
              <span>SYSTEM STATUS: BOOTING...</span>
              <span>LOAD %: {bootProgress}</span>
            </div>
            <div className="text-sm md:text-base border border-green-700 px-2 py-1 tracking-tighter whitespace-pre">
              [{progressBar}]
            </div>
          </div>

          <div className="mt-4 text-[10px] md:text-xs text-center opacity-80 space-y-0.5">
            <p>KERNEL: InkstoneOS v1.4.1 [nite_owl]</p>
            <p>SYSTEM: Inkstone Collective Ltd. All Rights Reserved</p>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 text-[10px] md:text-xs opacity-70">BIOS VERSION: 1999.IC.7</div>
        <div className="absolute bottom-4 right-4 text-[10px] md:text-xs opacity-70">F2: Setup / F12: Boot</div>
      </div>
    );
  }

  // 4. Windows XP "Welcome Screen" style login
  return (
    <div className="relative w-screen h-screen overflow-hidden select-none font-sans bg-gradient-to-br from-[#6a9adf] via-[#2f5fa8] to-[#0d2f66] flex flex-col">
      <RotatePrompt />
      {/* Soft radial highlight, like the XP Welcome screen glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.25),transparent_60%)] pointer-events-none" />

            <div className="relative z-10 flex-1 flex flex-col md:flex-row items-[safe_center] justify-[safe_center] gap-10 md:gap-0 px-6 md:px-0 overflow-y-auto py-8">
        {/* Left: logo + tagline */}
        <div className="flex-1 flex flex-col items-center md:items-end md:pr-14 text-center md:text-right">
          <div className="flex items-center gap-4 mb-4">
            <svg width="56" height="56" viewBox="0 0 100 100" className="shrink-0 drop-shadow-[0_2px_3px_rgba(0,0,0,0.4)]">
              <circle cx="50" cy="50" r="46" stroke="white" strokeWidth="2" fill="none" />
              <line x1="26" y1="26" x2="74" y2="74" stroke="white" strokeWidth="4" strokeLinecap="round" />
              <line x1="74" y1="26" x2="26" y2="74" stroke="white" strokeWidth="4" strokeLinecap="round" />
              <polygon points="50,34 59,50 50,66 41,50" fill="white" />
            </svg>
            <h1 className="text-white text-2xl sm:text-3xl font-bold leading-tight text-left drop-shadow-[0_2px_3px_rgba(0,0,0,0.45)]">
              Harvest Cosmic<br />Junction
            </h1>
          </div>
          <p className="text-white text-sm sm:text-base">To begin, click your user name</p>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px self-stretch my-4 bg-white/25" />

        {/* Right: user account list */}
        <div className="flex-1 flex flex-col md:pl-14 gap-1 w-full max-w-xs sm:max-w-sm">
          {characters.map((char) => {
            const isActive = selectedChar.id === char.id && formVisible;
            return (
              <div key={char.id} className="w-full">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedChar(char);
                    setFormVisible(true);
                    setError(false);
                    setPasswordInput('');
                  }}
                  className={`w-full flex items-center gap-4 p-3 rounded-lg transition-all duration-150 text-left cursor-pointer ${
                    isActive ? 'bg-white/25 shadow-inner' : 'hover:bg-white/10'
                  }`}
                >
                  <div className={`w-12 h-12 shrink-0 rounded-md overflow-hidden ${char.bgColor} shadow-[0_2px_4px_rgba(0,0,0,0.4)] border border-white/30`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={char.avatarSrc}
                      alt={char.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <span className={`w-full h-full ${char.avatarTextColor} font-bold text-lg items-center justify-center hidden`}>
                      {char.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-semibold text-base drop-shadow-sm">{char.name}</div>
                    <div className="text-white/70 text-xs">{char.role}</div>
                  </div>
                </button>

                {isActive && (
                  <form onSubmit={handleLoginSubmit} className="mt-2 ml-2 mb-1 mr-2 flex items-center gap-2">
                    <input
                      type="password"
                      autoFocus
                      placeholder="Password"
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        if (error) setError(false);
                      }}
                      className={`flex-1 min-w-0 bg-white/90 rounded-full px-4 py-1.5 text-sm text-black focus:outline-none focus:ring-2 ${
                        error ? 'ring-2 ring-red-500' : 'focus:ring-blue-400'
                      }`}
                    />
                    <button
                      type="submit"
                      aria-label="Log in"
                      className="w-8 h-8 shrink-0 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center text-white shadow-md transition-colors cursor-pointer"
                    >
                      &#9656;
                    </button>
                  </form>
                )}
                {isActive && error && (
                  <p className="ml-2 text-red-200 text-[11px] mb-1">Invalid password. Try again.</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer bar, styled like the XP welcome screen bottom strip */}
      <div className="relative z-10 border-t border-white/25 bg-black/10 px-6 sm:px-12 py-3 flex items-center justify-between text-white text-xs sm:text-sm shrink-0">
        <button
          type="button"
          onClick={handleShutdown}
          className="flex items-center gap-2 opacity-90 hover:opacity-100 cursor-pointer rounded px-1 py-0.5 hover:bg-white/10 transition-colors"
        >
          <span className="w-6 h-6 rounded-full bg-gradient-to-b from-orange-400 to-red-600 flex items-center justify-center text-[10px] shadow-[0_0_4px_rgba(0,0,0,0.5)]">⏻</span>
          <span>Turn off computer</span>
        </button>
        <div className="text-right text-white/80 leading-tight hidden sm:block">
          <div>After you log in, you can add or change accounts.</div>
          <div>Just go to Control Panel and click User Accounts.</div>
        </div>
      </div>
    </div>
  );
}

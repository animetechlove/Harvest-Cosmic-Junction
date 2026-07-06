'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CharacterProfile {
  id: string;
  name: string;
  role: string;
  borderColor: string;
  textColor: string;
  glowClass: string;
  passcode: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Character profiles customized using your Tailwind configuration variables
  const characters: CharacterProfile[] = [
    { id: 'kristin', name: 'Kristin', role: 'Town Historian', borderColor: 'border-kristin-maroon', textColor: 'text-kristin-maroon', glowClass: 'shadow-[0_0_15px_rgba(128,0,32,0.5)]', passcode: 'history' },
    { id: 'taylor', name: 'Taylor', role: 'Mystery Solver', borderColor: 'border-taylor-orange', textColor: 'text-taylor-orange', glowClass: 'shadow-[0_0_15px_rgba(255,140,0,0.5)]', passcode: 'clue' },
    { id: 'nova', name: 'Nova', role: 'Cosmic Weaver', borderColor: 'border-nova-cyan', textColor: 'text-nova-cyan', glowClass: 'shadow-[0_0_15px_rgba(0,255,255,0.5)]', passcode: 'signal' },
    { id: 'jace', name: 'Jace', role: 'Mechanic / Engineer', borderColor: 'border-jace-steel', textColor: 'text-jace-moss', glowClass: 'shadow-[0_0_15px_rgba(170,192,175,0.4)]', passcode: 'wrench' },
    { id: 'rowan', name: 'Rowan', role: 'Botanist', borderColor: 'border-rowan-forest', textColor: 'text-rowan-lime', glowClass: 'shadow-[0_0_15px_rgba(50,205,50,0.5)]', passcode: 'clover' },
    { id: 'orion', name: 'Orion', role: 'Stargazer', borderColor: 'border-orion-royal', textColor: 'text-orion-purple', glowClass: 'shadow-[0_0_15px_rgba(147,112,219,0.5)]', passcode: 'nebula' },
  ];

  const [selectedChar, setSelectedChar] = useState<CharacterProfile>(characters[0]);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState(false);

  // 1. Force the page to wait until it is safely mounted on your computer's browser
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordInput.toLowerCase() === selectedChar.passcode || passwordInput.toLowerCase() === 'guest') {
      setError(false);
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

  return (
    <main className="w-screen h-screen bg-[#0d0e12] text-neutral-300 font-mono p-6 flex flex-col items-center justify-center select-none overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#141722] border-2 border-neutral-700 rounded shadow-[0_0_20px_rgba(0,0,0,0.8)] p-8 flex flex-col md:flex-row gap-8">
        
        {/* Grid Area */}
        <div className="flex-1">
          <h2 className="text-sm text-neutral-400 uppercase tracking-widest mb-4 border-b border-neutral-700 pb-2">
            Select Terminal User Profile
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {characters.map((char) => {
              const isSelected = selectedChar.id === char.id;
              return (
                <button
                  key={char.id}
                  onClick={() => {
                    setSelectedChar(char);
                    setError(false);
                    setPasswordInput('');
                  }}
                  className={`p-3 border text-left rounded transition-all duration-200 ${
                    isSelected 
                      ? `${char.borderColor} ${char.textColor} ${char.glowClass} bg-black/40` 
                      : 'border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300'
                  }`}
                >
                  <div className="font-bold text-base">{char.name}</div>
                  <div className="text-[10px] opacity-70 tracking-tight mt-0.5">{char.role}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Access Form Area */}
        <div className="w-full md:w-80 flex flex-col justify-center border-t md:border-t-0 md:border-l border-neutral-700 pt-6 md:pt-0 md:pl-8">
          <div className="text-center md:text-left mb-6">
            <div className="text-xs text-neutral-500 uppercase tracking-wider">Secure Access Port</div>
            <h3 className="text-xl font-bold text-white mt-1">Welcome, {selectedChar.name}</h3>
          </div>

          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">User ID Token</label>
              <input 
                type="text" 
                disabled 
                value={`${selectedChar.id.toUpperCase()}_SYS_A`} 
                className="w-full bg-black/50 border border-neutral-800 rounded p-2 text-xs text-neutral-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1">System Passcode</label>
              <input 
                type="password"
                placeholder="••••••••"
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (error) setError(false);
                }}
                className={`w-full bg-black border rounded p-2 text-sm text-center font-sans tracking-widest focus:outline-none ${
                  error ? 'border-red-500 text-red-500' : 'border-neutral-700 text-white'
                }`}
              />
              {error && (
                <span className="text-[10px] text-red-400 mt-1 block text-center">
                  ⚠️ ACCESS DENIED: Invalid Passcode
                </span>
              )}
            </div>

            <button 
              type="submit"
              className="w-full mt-2 bg-neutral-200 text-black font-bold p-2 text-sm rounded hover:bg-white transition-all"
            >
              LOG IN
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}
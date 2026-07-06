'use client';

interface DesktopWindowProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  colorClass: string;
  children: React.ReactNode;
}

export default function DesktopWindow({ title, isOpen, onClose, colorClass, children }: DesktopWindowProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div
        className="w-full max-w-lg bg-[#0a0a0a] border rounded shadow-[0_0_25px_rgba(0,0,0,0.9)] font-mono"
        style={{ borderColor: colorClass }}
      >
        <div
          className="flex items-center justify-between px-3 py-2 border-b text-xs text-white"
          style={{ borderColor: colorClass }}
        >
          <span className="font-bold tracking-wider">{title}</span>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 font-bold transition-colors cursor-pointer"
          >
            [ X ]
          </button>
        </div>
        <div className="p-4 text-sm max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export default function RotatePrompt() {
  return (
    <div className="fixed top-2 inset-x-0 z-[9999] hidden portrait:flex justify-center pointer-events-none font-mono">
      <div className="flex items-center gap-2 bg-black/80 text-white text-xs rounded-full px-3 py-1.5 shadow-lg pointer-events-auto">
        <span className="text-base rotate-hint-icon">📱</span>
        <span>Rotate for the best experience</span>
      </div>
    </div>
  );
}

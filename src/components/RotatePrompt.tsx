export default function RotatePrompt() {
  return (
    <div className="fixed inset-0 z-[9999] hidden portrait:flex flex-col items-center justify-center bg-black text-white text-center p-8 gap-4 font-mono">
      <div className="text-6xl rotate-hint-icon">📱</div>
      <p className="text-lg max-w-xs">
        Please rotate your device to landscape for the best experience.
      </p>
    </div>
  );
}

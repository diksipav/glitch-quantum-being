
import { useTextCycle } from "@/hooks/useTextCycle";

const statusTexts = [
  "RITUAL_SEQUENCE_READY",
  "SYSTEM_SCAN_COMPLETE",
  "QUANTUM_CONNECTION_ESTABLISHED",
  "ANOMALY_DETECTED",
  "PRESENCE_CONFIRMED",
];

export function MobileHeader() {
  const statusText = useTextCycle(statusTexts);

  return (
    <header className="md:hidden flex flex-col items-center justify-center py-4 px-4 fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="font-display text-xl uppercase glitch" data-text="BUGGED_BEING">
        BUGGED_BEING
      </div>
      <div className="font-mono text-xs text-primary uppercase flex items-center mt-2">
        {statusText}
        <span className="w-2 h-2 bg-primary inline-block ml-2 animate-blink"></span>
      </div>
    </header>
  );
}


import { useEffect, useState } from "react";

interface WaveAnimationProps {
  className?: string;
}

export const WaveAnimation = ({ className = "" }: WaveAnimationProps) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 0.1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const generateWavePath = (frequency: number, amplitude: number, phase: number) => {
    const points = [];
    for (let x = 0; x <= 100; x += 2) {
      const y = 50 + amplitude * Math.sin((x * frequency + time + phase) * 0.1);
      points.push(`${x},${y}`);
    }
    return `M${points.join(' L')}`;
  };

  return (
    <div className={`w-full h-full ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        
        {/* Multiple wave layers for depth */}
        <path
          d={generateWavePath(1, 15, 0)}
          stroke="url(#waveGradient)"
          strokeWidth="1"
          fill="none"
          opacity="0.8"
        />
        <path
          d={generateWavePath(1.5, 10, Math.PI / 2)}
          stroke="hsl(var(--primary))"
          strokeWidth="0.8"
          fill="none"
          opacity="0.6"
        />
        <path
          d={generateWavePath(2, 8, Math.PI)}
          stroke="hsl(var(--primary))"
          strokeWidth="0.6"
          fill="none"
          opacity="0.4"
        />
        <path
          d={generateWavePath(2.5, 5, Math.PI * 1.5)}
          stroke="hsl(var(--primary))"
          strokeWidth="0.4"
          fill="none"
          opacity="0.3"
        />
      </svg>
    </div>
  );
};

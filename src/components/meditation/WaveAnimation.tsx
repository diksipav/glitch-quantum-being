
import { useEffect, useRef } from 'react';

export const WaveAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.008;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Multiple flowing wave layers with different frequencies and colors
      const waves = [
        { amplitude: 80, frequency: 0.003, speed: 0.4, color: 'rgba(255, 20, 147, 0.15)', yOffset: 0.3 },
        { amplitude: 60, frequency: 0.004, speed: 0.6, color: 'rgba(138, 43, 226, 0.12)', yOffset: 0.4 },
        { amplitude: 100, frequency: 0.002, speed: 0.3, color: 'rgba(255, 105, 180, 0.08)', yOffset: 0.5 },
        { amplitude: 45, frequency: 0.005, speed: 0.8, color: 'rgba(218, 112, 214, 0.1)', yOffset: 0.6 },
        { amplitude: 70, frequency: 0.0025, speed: 0.5, color: 'rgba(147, 0, 211, 0.06)', yOffset: 0.7 }
      ];

      waves.forEach((wave, index) => {
        ctx.beginPath();
        
        // Create gradient for each wave
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        const hue = (time * 20 + index * 60) % 360;
        gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.1)`);
        gradient.addColorStop(0.5, `hsla(${hue + 30}, 80%, 70%, 0.15)`);
        gradient.addColorStop(1, `hsla(${hue + 60}, 70%, 60%, 0.1)`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        
        for (let x = 0; x <= canvas.width; x += 3) {
          const y = canvas.height * wave.yOffset + 
            Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude +
            Math.sin(x * wave.frequency * 2.5 + time * wave.speed * 1.3) * (wave.amplitude * 0.3) +
            Math.cos(x * wave.frequency * 0.8 + time * wave.speed * 0.7) * (wave.amplitude * 0.2);
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      // Floating energy particles
      for (let i = 0; i < 25; i++) {
        const x = (Math.sin(time * 0.2 + i * 0.5) * canvas.width * 0.3) + canvas.width / 2;
        const y = (Math.cos(time * 0.15 + i * 0.7) * canvas.height * 0.2) + canvas.height / 2;
        const size = Math.sin(time * 0.5 + i) * 3 + 4;
        const alpha = (Math.sin(time * 0.3 + i * 0.4) + 1) * 0.1;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        
        const particleHue = (time * 30 + i * 25) % 360;
        ctx.fillStyle = `hsla(${particleHue}, 70%, 70%, ${alpha})`;
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsla(${particleHue}, 70%, 70%, ${alpha * 0.5})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Central mandala-like pattern
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      ctx.beginPath();
      ctx.strokeStyle = `hsla(${(time * 40) % 360}, 60%, 80%, 0.2)`;
      ctx.lineWidth = 2;
      
      for (let angle = 0; angle < Math.PI * 12; angle += 0.05) {
        const radius = 50 + Math.sin(angle * 3 + time * 2) * 30 + Math.cos(time * 1.5) * 20;
        const x = centerX + Math.cos(angle + time * 0.5) * radius;
        const y = centerY + Math.sin(angle + time * 0.5) * radius;
        
        if (angle === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Breathing circle in center
      const breathRadius = 40 + Math.sin(time * 1.2) * 15;
      ctx.beginPath();
      ctx.arc(centerX, centerY, breathRadius, 0, Math.PI * 2);
      
      const breathGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, breathRadius);
      breathGradient.addColorStop(0, `hsla(${(time * 50) % 360}, 70%, 80%, 0.1)`);
      breathGradient.addColorStop(1, `hsla(${(time * 50 + 180) % 360}, 70%, 80%, 0.05)`);
      
      ctx.fillStyle = breathGradient;
      ctx.fill();

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
    />
  );
};

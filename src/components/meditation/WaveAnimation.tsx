
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
      time += 0.01;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      );
      gradient.addColorStop(0, 'rgba(139, 69, 19, 0.1)');
      gradient.addColorStop(0.5, 'rgba(75, 0, 130, 0.15)');
      gradient.addColorStop(1, 'rgba(25, 25, 112, 0.2)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw multiple wave layers
      const waves = [
        { amplitude: 30, frequency: 0.01, speed: 0.5, color: 'rgba(255, 20, 147, 0.3)' },
        { amplitude: 40, frequency: 0.008, speed: 0.3, color: 'rgba(138, 43, 226, 0.25)' },
        { amplitude: 25, frequency: 0.012, speed: 0.7, color: 'rgba(255, 105, 180, 0.2)' },
        { amplitude: 35, frequency: 0.015, speed: 0.4, color: 'rgba(218, 112, 214, 0.15)' }
      ];

      waves.forEach((wave, index) => {
        ctx.beginPath();
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 2;
        
        for (let x = 0; x <= canvas.width; x += 2) {
          const y = canvas.height / 2 + 
            Math.sin(x * wave.frequency + time * wave.speed) * wave.amplitude +
            Math.sin(x * wave.frequency * 2 + time * wave.speed * 1.5) * wave.amplitude * 0.5;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      // Draw floating particles
      for (let i = 0; i < 20; i++) {
        const x = (Math.sin(time * 0.3 + i) * 200) + canvas.width / 2;
        const y = (Math.cos(time * 0.2 + i * 0.5) * 150) + canvas.height / 2;
        const size = Math.sin(time + i) * 2 + 3;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 20, 147, ${0.1 + Math.sin(time + i) * 0.1})`;
        ctx.fill();
      }

      // Draw spiral
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 105, 180, 0.4)';
      ctx.lineWidth = 1;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      for (let angle = 0; angle < Math.PI * 8; angle += 0.1) {
        const radius = angle * 2 + Math.sin(time * 2) * 10;
        const x = centerX + Math.cos(angle + time) * radius;
        const y = centerY + Math.sin(angle + time) * radius;
        
        if (angle === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

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
      style={{ background: 'linear-gradient(45deg, #0a0a0a, #1a0a1a)' }}
    />
  );
};

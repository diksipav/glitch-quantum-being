
import { useEffect, useRef } from 'react';

export const WalkingAnimation = () => {
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
    const particles: Array<{
      x: number;
      y: number;
      char: string;
      life: number;
      maxLife: number;
      vx: number;
      vy: number;
    }> = [];

    const asciiChars = ['█', '▓', '▒', '░', '▀', '▄', '▌', '▐', '■', '□', '●', '○', '◆', '◇', '▲', '△'];
    
    const animate = () => {
      time += 0.033; // 30fps
      
      // Clear canvas with black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Walking cycle parameters
      const walkSpeed = 2;
      const stepPhase = Math.sin(time * walkSpeed) * 0.5 + 0.5;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Create walking silhouette with ASCII characters
      const figurePoints = [
        // Head
        { x: centerX, y: centerY - 60, chars: ['●', '○', '◉'] },
        // Torso
        { x: centerX, y: centerY - 40, chars: ['█', '▓', '▒'] },
        { x: centerX, y: centerY - 20, chars: ['█', '▓', '▒'] },
        { x: centerX, y: centerY, chars: ['█', '▓', '▒'] },
        // Arms
        { x: centerX - 15 + Math.sin(time * walkSpeed * 2) * 8, y: centerY - 30, chars: ['▌', '▐', '█'] },
        { x: centerX + 15 - Math.sin(time * walkSpeed * 2) * 8, y: centerY - 30, chars: ['▌', '▐', '█'] },
        // Legs
        { x: centerX - 8 + Math.sin(time * walkSpeed) * 12, y: centerY + 20, chars: ['█', '▓', '▒'] },
        { x: centerX + 8 - Math.sin(time * walkSpeed) * 12, y: centerY + 20, chars: ['█', '▓', '▒'] },
        { x: centerX - 8 + Math.sin(time * walkSpeed) * 15, y: centerY + 40, chars: ['█', '▓', '▒'] },
        { x: centerX + 8 - Math.sin(time * walkSpeed) * 15, y: centerY + 40, chars: ['█', '▓', '▒'] },
      ];

      // Draw main figure and create particles
      figurePoints.forEach(point => {
        const char = point.chars[Math.floor(Math.random() * point.chars.length)];
        
        // Main character with glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#9B30FF';
        ctx.fillStyle = '#9B30FF';
        ctx.font = '24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(char, point.x, point.y);

        // Glitch effect
        if (Math.random() < 0.3) {
          ctx.shadowBlur = 5;
          ctx.fillStyle = '#C71585';
          const glitchOffset = (Math.random() - 0.5) * 6;
          ctx.fillText(char, point.x + glitchOffset, point.y);
        }

        // Create trailing particles
        if (Math.random() < 0.8) {
          particles.push({
            x: point.x + (Math.random() - 0.5) * 10,
            y: point.y + (Math.random() - 0.5) * 10,
            char: char,
            life: 150,
            maxLife: 150,
            vx: (Math.random() - 0.5) * 2 - 2.5,
            vy: (Math.random() - 0.5) * 1,
          });
        }
      });

      // Update and draw particles
      ctx.shadowBlur = 0;
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.life--;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.02; // gravity

        if (particle.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = particle.life / particle.maxLife;
        const size = 12 + (1 - alpha) * 8;
        
        ctx.fillStyle = `rgba(155, 48, 255, ${alpha * 0.6})`;
        ctx.font = `${size}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(particle.char, particle.x, particle.y);

        // Additional particle glow
        if (alpha > 0.5) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#9B30FF';
          ctx.fillStyle = `rgba(199, 21, 133, ${alpha * 0.3})`;
          ctx.fillText(particle.char, particle.x, particle.y);
          ctx.shadowBlur = 0;
        }
      }

      // Glitch wave effect
      if (Math.random() < 0.1) {
        ctx.fillStyle = `rgba(155, 48, 255, 0.1)`;
        const waveY = centerY + Math.sin(time * 5) * 20;
        ctx.fillRect(0, waveY, canvas.width, 4);
      }

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
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};

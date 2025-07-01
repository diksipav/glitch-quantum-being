
import { useEffect, useRef } from 'react';

export const SereneParticleAnimation = () => {
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
      phase: number;
      size: number;
    }> = [];

    const asciiChars = ['·', '•', '○', '◦', '∘', '⋅', '∙', '◯', '◉', '◎', '⊙', '⊚', '◐', '◑', '◒', '◓'];
    const colors = ['#7D3C98', '#9B59B6', '#D2B4DE'];

    // Initialize particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        char: asciiChars[Math.floor(Math.random() * asciiChars.length)],
        life: Math.random() * 240 + 240, // 8 seconds at 30fps
        maxLife: 240,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        phase: Math.random() * Math.PI * 2,
        size: Math.random() * 20 + 10,
      });
    }
    
    const animate = () => {
      time += 0.033; // 30fps
      
      // Create animated background gradient
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      );
      
      const bgPhase = Math.sin(time * 0.5) * 0.1 + 0.9;
      gradient.addColorStop(0, `rgba(45, 23, 66, ${bgPhase})`);
      gradient.addColorStop(0.5, `rgba(30, 15, 44, ${bgPhase * 0.8})`);
      gradient.addColorStop(1, `rgba(15, 8, 22, ${bgPhase * 0.6})`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.life--;
        
        // Organic wave motion
        const waveX = Math.sin(time * 0.5 + particle.phase) * 30;
        const waveY = Math.cos(time * 0.3 + particle.phase) * 20;
        
        particle.x += particle.vx + waveX * 0.01;
        particle.y += particle.vy + waveY * 0.01;

        // Wrap around screen edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        if (particle.life <= 0) {
          // Respawn particle
          particle.x = Math.random() * canvas.width;
          particle.y = Math.random() * canvas.height;
          particle.life = particle.maxLife;
          particle.char = asciiChars[Math.floor(Math.random() * asciiChars.length)];
          particle.phase = Math.random() * Math.PI * 2;
        }

        const alpha = Math.sin((particle.life / particle.maxLife) * Math.PI) * 0.8;
        const colorIndex = Math.floor((particle.phase + time * 0.2) % colors.length);
        const color = colors[colorIndex];
        
        // Soft bloom effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = color;
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.font = `${particle.size}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(particle.char, particle.x, particle.y);

        // Additional glow layer
        ctx.shadowBlur = 40;
        ctx.globalAlpha = alpha * 0.3;
        ctx.fillText(particle.char, particle.x, particle.y);
      }

      // Reset shadow and alpha
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // Harmony rays - occasional bursts
      if (Math.random() < 0.02) {
        const centerX = canvas.width / 2 + (Math.random() - 0.5) * 200;
        const centerY = canvas.height / 2 + (Math.random() - 0.5) * 200;
        
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
          const rayLength = Math.random() * 100 + 50;
          const endX = centerX + Math.cos(angle) * rayLength;
          const endY = centerY + Math.sin(angle) * rayLength;
          
          ctx.strokeStyle = `rgba(155, 89, 182, ${Math.random() * 0.3 + 0.1})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }
      }

      // Mandala patterns
      const mandalaTime = time * 0.5;
      const mandalaX = canvas.width / 2;
      const mandalaY = canvas.height / 2;
      
      for (let ring = 1; ring <= 3; ring++) {
        const radius = ring * 80 + Math.sin(mandalaTime + ring) * 20;
        const points = ring * 6;
        
        for (let i = 0; i < points; i++) {
          const angle = (i / points) * Math.PI * 2 + mandalaTime * 0.2;
          const x = mandalaX + Math.cos(angle) * radius;
          const y = mandalaY + Math.sin(angle) * radius;
          
          const alpha = (Math.sin(mandalaTime + i * 0.5) + 1) * 0.15;
          ctx.fillStyle = `rgba(210, 180, 222, ${alpha})`;
          ctx.font = '16px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('◦', x, y);
        }
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
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

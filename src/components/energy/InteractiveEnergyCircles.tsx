
import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface EnergyLevels {
  mental: number;
  physical: number;
  emotional: number;
  intentional: number;
}

interface InteractiveEnergyCirclesProps {
  energyLevels: EnergyLevels;
  onEnergyChange: (levels: EnergyLevels) => void;
}

export const InteractiveEnergyCircles = ({ energyLevels, onEnergyChange }: InteractiveEnergyCirclesProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState<string | null>(null);
  const [particles, setParticles] = useState<Array<{ id: string; x: number; y: number; opacity: number }>>([]);

  const circles = [
    { name: 'mental', radius: 60, color: '#60A5FA', strokeWidth: 3 },
    { name: 'physical', radius: 100, color: '#4ADE80', strokeWidth: 3 },
    { name: 'emotional', radius: 140, color: '#A78BFA', strokeWidth: 3 },
    { name: 'intentional', radius: 180, color: '#FACC15', strokeWidth: 3 },
  ];

  const centerX = 200;
  const centerY = 200;

  const getPointOnCircle = (radius: number, percentage: number) => {
    const angle = (percentage / 100) * 2 * Math.PI - Math.PI / 2;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  };

  const getPercentageFromPoint = (x: number, y: number, radius: number) => {
    const angle = Math.atan2(y - centerY, x - centerX);
    let percentage = ((angle + Math.PI / 2) / (2 * Math.PI)) * 100;
    if (percentage < 0) percentage += 100;
    return Math.round(percentage);
  };

  const handleStart = (circleName: string, event: any) => {
    event.preventDefault();
    setIsDragging(circleName);
    
    // Create particle effect
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: `${circleName}-${Date.now()}-${i}`,
      x: centerX + (Math.random() - 0.5) * 100,
      y: centerY + (Math.random() - 0.5) * 100,
      opacity: 1,
    }));
    setParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !p.id.startsWith(`${circleName}-${Date.now()}`)));
    }, 1000);
  };

  const handleMove = (event: MouseEvent | TouchEvent) => {
    if (!isDragging || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const circle = circles.find(c => c.name === isDragging);
    if (!circle) return;

    const percentage = getPercentageFromPoint(x, y, circle.radius);
    
    onEnergyChange({
      ...energyLevels,
      [isDragging]: percentage,
    });
  };

  const handleEnd = () => {
    setIsDragging(null);
  };

  const handleCircleClick = (circleName: string, event: React.MouseEvent) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const circle = circles.find(c => c.name === circleName);
    if (!circle) return;

    const percentage = getPercentageFromPoint(x, y, circle.radius);
    
    onEnergyChange({
      ...energyLevels,
      [circleName]: percentage,
    });
  };

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => handleMove(e);
      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        handleMove(e);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isDragging, energyLevels]);

  return (
    <motion.div 
      className="relative"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    >
      <svg
        ref={svgRef}
        width="400"
        height="400"
        viewBox="0 0 400 400"
        className="select-none max-w-full h-auto"
        style={{ touchAction: 'none' }}
      >
        {/* Background circles */}
        {circles.map((circle) => (
          <circle
            key={`bg-${circle.name}`}
            cx={centerX}
            cy={centerY}
            r={circle.radius}
            fill="none"
            stroke={circle.color}
            strokeWidth={1}
            opacity={0.3}
            className="cursor-pointer"
            onClick={(e) => handleCircleClick(circle.name, e)}
          />
        ))}

        {/* Progress arcs */}
        {circles.map((circle) => {
          const percentage = energyLevels[circle.name as keyof EnergyLevels];
          const circumference = 2 * Math.PI * circle.radius;
          const strokeDasharray = circumference;
          const strokeDashoffset = circumference - (percentage / 100) * circumference;

          return (
            <circle
              key={`progress-${circle.name}`}
              cx={centerX}
              cy={centerY}
              r={circle.radius}
              fill="none"
              stroke={circle.color}
              strokeWidth={circle.strokeWidth}
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              transform={`rotate(-90 ${centerX} ${centerY})`}
              className="transition-all duration-300"
            />
          );
        })}

        {/* Draggable dots */}
        {circles.map((circle) => {
          const percentage = energyLevels[circle.name as keyof EnergyLevels];
          const point = getPointOnCircle(circle.radius, percentage);

          return (
            <circle
              key={`dot-${circle.name}`}
              cx={point.x}
              cy={point.y}
              r={12}
              fill={circle.color}
              stroke="#000"
              strokeWidth={2}
              className="cursor-pointer hover:scale-110 transition-transform"
              onMouseDown={(e) => handleStart(circle.name, e)}
              onTouchStart={(e) => handleStart(circle.name, e)}
              style={{ touchAction: 'none' }}
            />
          );
        })}

        {/* Particle effects */}
        {particles.map((particle) => (
          <motion.circle
            key={particle.id}
            cx={particle.x}
            cy={particle.y}
            r={2}
            fill="#ffffff"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 0, y: particle.y - 50 }}
            transition={{ duration: 1 }}
          />
        ))}

        {/* Center dot */}
        <circle
          cx={centerX}
          cy={centerY}
          r={4}
          fill="#ffffff"
          opacity={0.8}
        />
      </svg>
    </motion.div>
  );
};

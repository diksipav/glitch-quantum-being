
import { motion } from "framer-motion";

const planets = [
  { radius: 25, size: 4, duration: 12 },
  { radius: 35, size: 2, duration: 15 },
  { radius: 45, size: 6, duration: 18 },
  { radius: 55, size: 3, duration: 22 },
  { radius: 60, size: 4, duration: 25 },
  { radius: 70, size: 8, duration: 30 },
  { radius: 80, size: 2, duration: 35 },
  { radius: 85, size: 4, duration: 40 },
  { radius: 95, size: 6, duration: 45 },
];

export function RitualCircle() {
  return (
    <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto my-4 flex items-center justify-center">
      <motion.div
        className="absolute w-full h-full border-2 border-dashed border-primary rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_hsl(var(--primary))]"></div>
      
      {planets.map((planet, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ width: 2 * planet.radius, height: 2 * planet.radius }}
          animate={{ rotate: 360 }}
          transition={{ duration: planet.duration, repeat: Infinity, ease: 'linear' }}
        >
          <div 
            className="absolute top-1/2 bg-primary rounded-full"
            style={{ width: planet.size, height: planet.size, left: 0, transform: 'translate(-50%, -50%)' }}
          />
        </motion.div>
      ))}
    </div>
  );
}

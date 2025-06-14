
import { motion } from "framer-motion";

export function RitualCircle() {
  const dots = [
    { top: "20%", left: "50%" },
    { top: "35%", left: "25%" },
    { top: "65%", left: "80%" },
    { top: "80%", left: "40%" },
    { top: "50%", left: "50%" },
  ];

  return (
    <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto my-4">
      <div className="absolute inset-0 border-2 border-dashed border-primary rounded-full animate-rotate"></div>
      {dots.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-primary rounded-full"
          initial={{ top: dot.top, left: dot.left }}
          animate={{
            x: [0, Math.random() * 10 - 5, 0],
            y: [0, Math.random() * 10 - 5, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
          style={{
            transform: "translate(-50%, -50%)"
          }}
        ></motion.div>
      ))}
    </div>
  );
}

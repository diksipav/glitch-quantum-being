
import { motion } from "framer-motion";
import { TerminalCard } from "@/components/ui/TerminalCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const MotionCard = motion(TerminalCard);

const meditationSessions = [
  {
    title: "Quantum Breath",
    description: "Synchronize your breath with the waveform of a virtual particle.",
    duration: "10 MIN"
  },
  {
    title: "Observing the Observer",
    description: "Become aware of the awareness that is watching your thoughts.",
    duration: "15 MIN"
  },
  {
    title: "Entangled Mind",
    description: "A guided meditation on the interconnectedness of all consciousness.",
    duration: "20 MIN"
  },
  {
    title: "Glitch in the Stillness",
    description: "Find the beauty in imperfections during a silent meditation.",
    duration: "12 MIN"
  }
];

const Meditation = () => (
  <motion.div
    className="text-center pt-8 md:pt-16"
    initial="hidden"
    animate="visible"
    variants={containerVariants}
  >
    <motion.h1 variants={itemVariants} className="font-display text-2xl md:text-4xl uppercase glitch" data-text="Absurd Meditation">
      Absurd Meditation
    </motion.h1>
    <motion.p variants={itemVariants} className="text-muted-foreground mt-2 text-sm">
      INITIATE_MEDITATION_SEQUENCE
    </motion.p>
    <motion.div
      variants={containerVariants}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 max-w-2xl mx-auto text-left"
    >
      {meditationSessions.map((session, index) => (
        <MotionCard key={index} variants={itemVariants} className="cursor-pointer hover:border-primary/80 transition-colors">
          <div className="flex justify-between items-center">
            <h3 className="font-bold uppercase tracking-widest text-primary">{session.title}</h3>
            <span className="text-xs text-muted-foreground">{session.duration}</span>
          </div>
          <p className="mt-2 text-foreground/90">{session.description}</p>
        </MotionCard>
      ))}
    </motion.div>
  </motion.div>
);

export default Meditation;

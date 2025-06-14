
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

const challenges = [
  {
    title: "Reality Glitch Hunt",
    description: "Find and document 3 'glitches' in your daily reality (e.g., synchronicity, déjà vu).",
    status: "IN_PROGRESS"
  },
  {
    title: "Sensory Deprivation",
    description: "Spend 5 minutes in a completely dark and silent room. Observe the internal noise.",
    status: "NOT_STARTED"
  },
  {
    title: "Object Monologue",
    description: "Choose a random object and speak from its perspective for 2 minutes.",
    status: "NOT_STARTED"
  }
];

const Challenge = () => (
  <motion.div
    className="text-center pt-8 md:pt-16"
    initial="hidden"
    animate="visible"
    variants={containerVariants}
  >
    <motion.h1 variants={itemVariants} className="font-display text-2xl md:text-4xl uppercase glitch" data-text="Challenges">
      Challenges
    </motion.h1>
    <motion.p variants={itemVariants} className="text-muted-foreground mt-2 text-sm">
      TEST_YOUR_PERCEPTION
    </motion.p>
    <motion.div
      variants={containerVariants}
      className="grid grid-cols-1 gap-4 mt-12 max-w-2xl mx-auto text-left"
    >
      {challenges.map((challenge, index) => (
        <MotionCard key={index} variants={itemVariants} className="cursor-pointer hover:border-primary/80 transition-colors">
          <div className="flex justify-between items-center">
            <h3 className="font-bold uppercase tracking-widest text-primary">{challenge.title}</h3>
            <span className={`text-xs font-mono ${challenge.status === 'IN_PROGRESS' ? 'text-primary animate-pulse' : 'text-muted-foreground'}`}>{challenge.status}</span>
          </div>
          <p className="mt-2 text-foreground/90">{challenge.description}</p>
        </MotionCard>
      ))}
    </motion.div>
  </motion.div>
);
export default Challenge;

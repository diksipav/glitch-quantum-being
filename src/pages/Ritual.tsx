
import { motion } from "framer-motion";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { Button } from "@/components/ui/button";

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

const dailyRituals = [
    { task: "Morning data-stream (Journaling)", completed: true },
    { task: "Quantum Leap (1 min of intense focus)", completed: true },
    { task: "Cognitive Reboot (Meditation)", completed: true },
    { task: "Physical state sync (Stretching)", completed: false },
    { task: "Evening protocol (Reflection)", completed: false },
]

const Ritual = () => (
  <motion.div
    className="text-center pt-8 md:pt-16"
    initial="hidden"
    animate="visible"
    variants={containerVariants}
  >
    <motion.h1 variants={itemVariants} className="font-display text-2xl md:text-4xl uppercase glitch" data-text="Daily Ritual">
      Daily Ritual
    </motion.h1>
    <motion.p variants={itemVariants} className="text-muted-foreground mt-2 text-sm">
      SEQUENCE_3_OF_5_COMPLETED
    </motion.p>
    <MotionCard variants={itemVariants} className="max-w-2xl mx-auto mt-12 text-left">
      <h3 className="font-bold uppercase tracking-widest text-muted-foreground mb-4">TODAY'S_SEQUENCE</h3>
      <div className="space-y-3">
        {dailyRituals.map((ritual, i) => (
            <div key={i} className="flex items-center">
                <div className={`w-5 h-5 border-2 ${ritual.completed ? 'bg-primary border-primary' : 'border-primary/50'} mr-4 flex items-center justify-center`}>
                    {ritual.completed && <div className="w-2 h-2 bg-background"/>}
                </div>
                <span className={`${ritual.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{ritual.task}</span>
            </div>
        ))}
      </div>
    </MotionCard>
    <motion.div variants={itemVariants} className="mt-8">
        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase font-bold tracking-wider px-8 py-6">
          Mark Next as Complete
        </Button>
      </motion.div>
  </motion.div>
);
export default Ritual;

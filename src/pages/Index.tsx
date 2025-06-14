import { Button } from "@/components/ui/button";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { RitualCircle } from "@/components/home/RitualCircle";
import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";

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

export default function Index() {
  const { dailyRitualCompleted, dailyRitualTotal, energyLevel } = useAppStore();

  return (
    <motion.div 
      className="text-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <RitualCircle />
      
      <motion.h1 className="font-display text-2xl uppercase tracking-widest" variants={itemVariants}>
        Welcome, Traveler
      </motion.h1>
      <motion.p className="text-muted-foreground mt-2 text-sm" variants={itemVariants}>
        SYSTEM STATUS: OPERATIONAL
      </motion.p>
      <motion.p className="text-foreground/80 mt-4 max-w-md mx-auto" variants={itemVariants}>
        Your presence has been detected in this quantum terminal. Proceed with curiosity.
      </motion.p>
      
      <motion.div variants={itemVariants} className="mt-6">
        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase font-bold tracking-wider px-8 py-6">
          Initiate Onboarding
        </Button>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 max-w-2xl mx-auto"
        variants={containerVariants}
      >
        <MotionCard variants={itemVariants} className="text-left">
          <h3 className="font-bold uppercase tracking-widest text-muted-foreground">Daily Ritual</h3>
          <p className="text-2xl font-bold mt-2 text-primary">{dailyRitualCompleted}/{dailyRitualTotal} <span className="text-sm font-normal text-foreground">Completed</span></p>
        </MotionCard>
        <MotionCard variants={itemVariants} className="text-left">
          <h3 className="font-bold uppercase tracking-widest text-muted-foreground">Energy Level</h3>
          <p className="text-2xl font-bold mt-2 text-primary">{energyLevel}%</p>
        </MotionCard>
      </motion.div>

      <motion.div className="mt-10 max-w-2xl mx-auto text-left" variants={containerVariants}>
        <h2 className="font-display text-xl uppercase tracking-widest mb-4">Recent Activity</h2>
        <MotionCard variants={itemVariants} className="mb-4">
          <div className="flex justify-between items-center text-xs text-muted-foreground uppercase">
            <span>Absurd Meditation #47</span>
            <span>2h ago</span>
          </div>
          <p className="mt-2 text-foreground/90">"Imagine you're a sentient dust particle in a cosmic library"</p>
        </MotionCard>
        <MotionCard variants={itemVariants}>
          <div className="flex justify-between items-center text-xs text-muted-foreground uppercase">
            <span>Presence Challenge</span>
            <span>5h ago</span>
          </div>
          <p className="mt-2 text-foreground/90">"Notice 3 unexpected textures in your environment"</p>
        </MotionCard>
      </motion.div>
    </motion.div>
  );
}

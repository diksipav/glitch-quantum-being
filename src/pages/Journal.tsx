
import { motion } from "framer-motion";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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

const Journal = () => (
  <motion.div
    className="pt-8 md:pt-16 max-w-2xl mx-auto"
    initial="hidden"
    animate="visible"
    variants={containerVariants}
  >
    <motion.h1 variants={itemVariants} className="text-center font-display text-2xl md:text-4xl uppercase glitch" data-text="Journal">
      Journal
    </motion.h1>
    <motion.p variants={itemVariants} className="text-center text-muted-foreground mt-2 text-sm">
      LOG_YOUR_ANOMALIES
    </motion.p>
    
    <MotionCard variants={itemVariants} className="mt-12 text-left">
      <h3 className="font-bold uppercase tracking-widest text-muted-foreground mb-4">New Entry</h3>
      <Textarea placeholder="Observed a glitch in the simulation today..." className="bg-terminal border-primary/20 focus-visible:ring-primary h-40"/>
      <div className="flex justify-end mt-4">
        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase font-bold tracking-wider">
          Commit to Log
        </Button>
      </div>
    </MotionCard>

    <motion.div className="mt-12 text-left" variants={containerVariants}>
      <h2 className="font-display text-xl uppercase tracking-widest mb-4">Recent Logs</h2>
      <MotionCard variants={itemVariants} className="mb-4">
        <div className="flex justify-between items-center text-xs text-muted-foreground uppercase">
          <span>Log Entry #472</span>
          <span>1 day ago</span>
        </div>
        <p className="mt-2 text-foreground/90">"The same black cat crossed my path twice. The simulation is getting lazy with its assets..."</p>
      </MotionCard>
      <MotionCard variants={itemVariants}>
        <div className="flex justify-between items-center text-xs text-muted-foreground uppercase">
          <span>Log Entry #471</span>
          <span>3 days ago</span>
        </div>
        <p className="mt-2 text-foreground/90">"Dreamt in perfect binary code. Woke up feeling... compiled."</p>
      </MotionCard>
    </motion.div>
  </motion.div>
);
export default Journal;

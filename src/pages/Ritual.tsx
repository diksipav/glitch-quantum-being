
import { motion } from "framer-motion";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { Button } from "@/components/ui/button";
import { RitualCircle } from "@/components/home/RitualCircle";
import { Sparkles, Wind, Activity, Check, Play } from "lucide-react";

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

const movements = [
    { icon: Sparkles, text: "Grounding Posture" },
    { icon: Wind, text: "Breath Synchronization" },
    { icon: Activity, text: "Spinal Waves" },
]

const achievements = [true, true, true, false, false, false, false, false, false];

const Ritual = () => (
  <motion.div
    className="text-center"
    initial="hidden"
    animate="visible"
    variants={containerVariants}
  >
    <motion.h1 variants={itemVariants} className="font-display text-2xl md:text-4xl uppercase glitch" data-text="Ritual Movements">
      Ritual Movements
    </motion.h1>
    
    <motion.div variants={itemVariants}>
      <RitualCircle />
    </motion.div>

    <motion.p variants={itemVariants} className="text-muted-foreground mt-2 text-sm uppercase tracking-widest">
      "Movement is prayer the body remembers"
    </motion.p>
    
    <motion.div variants={itemVariants} className="mt-6">
        <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase font-bold tracking-wider px-8 py-3">
          <Play className="w-4 h-4 mr-2" />
          Begin Daily Sequence (12min)
        </Button>
    </motion.div>

    <motion.div 
      variants={containerVariants}
      className="grid grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto"
    >
        {movements.map((move, i) => (
            <MotionCard key={i} variants={itemVariants} className="flex flex-col items-center justify-center p-4 aspect-square">
                <move.icon className="w-8 h-8 text-primary" />
                <span className="text-xs uppercase text-center mt-3 tracking-wider">{move.text}</span>
            </MotionCard>
        ))}
    </motion.div>
    
    <MotionCard variants={itemVariants} className="max-w-2xl mx-auto mt-8 text-left p-4">
      <h3 className="font-bold uppercase tracking-widest text-muted-foreground mb-4 text-sm">Progress</h3>
      <div className="flex justify-between items-center font-mono">
        <div>
            <p className="text-xs text-muted-foreground">CURRENT STREAK</p>
            <p className="text-primary text-xl font-bold">7 DAYS</p>
        </div>
        <div className="text-right">
            <p className="text-xs text-muted-foreground">LONGEST STREAK</p>
            <p className="text-primary text-xl font-bold">21 DAYS</p>
        </div>
      </div>
    </MotionCard>

    <MotionCard variants={itemVariants} className="max-w-2xl mx-auto mt-8 text-left p-4">
       <div className="flex justify-between items-center mb-4">
         <h3 className="font-bold uppercase tracking-widest text-muted-foreground text-sm">Achievements</h3>
         <p className="font-mono text-sm text-primary">3/9 UNLOCKED</p>
       </div>
      <div className="grid grid-cols-3 gap-4">
        {achievements.map((unlocked, i) => (
            <div key={i} className={`aspect-square border-2 flex items-center justify-center ${unlocked ? 'border-primary bg-primary/10' : 'border-border'}`}>
                {unlocked && <Check className="w-8 h-8 text-primary" />}
            </div>
        ))}
      </div>
    </MotionCard>
  </motion.div>
);
export default Ritual;

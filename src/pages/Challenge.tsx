
import { motion } from "framer-motion";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { Button } from "@/components/ui/button";
import { Check, Search } from "lucide-react";

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
    title: "Active Challenge",
    description: "For the next hour, notice whenever you touch something. Observe the temperature, texture, and pressure without judgment.",
    status: "ACTIVE",
    started: "22 MIN AGO",
    completion: 63
  },
  {
    title: "Sensory Awareness",
    description: "Identify 5 distinct smells in your environment and imagine their molecular structures.",
    status: "NOT_STARTED",
    difficulty: "MEDIUM",
    completed: "4/7 DAYS",
  },
  {
    title: "Temporal Anchor",
    description: "Set random alarms throughout the day. When they sound, fully note your surroundings and mental state.",
    status: "NOT_STARTED",
    difficulty: "HARD",
    completed: "1/7 DAYS",
  },
  {
    title: "Peripheral Expansion",
    description: "For 15 minutes, focus on expanding your peripheral awareness while keeping your gaze fixed.",
    status: "COMPLETE",
    difficulty: "EASY",
    completed: "7/7 DAYS",
  }
];

const Challenge = () => (
  <motion.div
    className="text-center"
    initial="hidden"
    animate="visible"
    variants={containerVariants}
  >
    <motion.h1 variants={itemVariants} className="font-display text-2xl md:text-4xl uppercase glitch" data-text="Presence Challenges">
      Presence Challenges
    </motion.h1>
    <motion.p variants={itemVariants} className="text-muted-foreground mt-2 text-sm">
      PRESENCE_DETECTED
    </motion.p>
    <motion.div
      variants={containerVariants}
      className="grid grid-cols-1 gap-4 mt-8 max-w-2xl mx-auto text-left"
    >
      {challenges.map((challenge, index) => (
        <MotionCard key={index} variants={itemVariants} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold uppercase tracking-widest text-primary">{challenge.title}</h3>
              <p className="mt-2 text-foreground/90 text-sm">{challenge.description}</p>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              {challenge.status === 'ACTIVE' && <Button variant="outline" size="sm" className="text-xs h-7">RESET</Button>}
              {challenge.status === 'NOT_STARTED' && <Button variant="outline" size="sm" className="text-xs h-7">{challenge.difficulty}</Button>}
              {challenge.status === 'COMPLETE' && <div className="text-xs text-green-400 flex items-center"><Check className="w-4 h-4 mr-1"/> COMPLETE</div>}
            </div>
          </div>
          <div className="mt-4 flex justify-between items-end text-xs font-mono uppercase">
            <div>
              {challenge.status === 'ACTIVE' && <div>STARTED: {challenge.started}</div>}
              {(challenge.status === 'NOT_STARTED' || challenge.status === 'COMPLETE') && <div>COMPLETED: {challenge.completed}</div>}
            </div>
            <div>
              {challenge.status === 'ACTIVE' && <div className="text-right">COMPLETION: {challenge.completion}%</div>}
              {challenge.status === 'NOT_STARTED' && <Button variant="ghost" className="text-primary h-auto p-0 hover:bg-transparent">ACCEPT</Button>}
            </div>
          </div>
          {challenge.status === 'ACTIVE' && (
            <div className="w-full bg-primary/20 rounded-full h-1 mt-2">
              <div className="bg-primary h-1 rounded-full" style={{ width: `${challenge.completion}%` }}></div>
            </div>
          )}
        </MotionCard>
      ))}
    </motion.div>
    <motion.div variants={itemVariants} className="mt-8">
      <Button variant="outline" className="text-primary border-primary/50 w-full max-w-2xl mx-auto">
        <Search className="w-4 h-4 mr-2"/>
        EXPLORE MORE CHALLENGES
      </Button>
    </motion.div>
  </motion.div>
);
export default Challenge;

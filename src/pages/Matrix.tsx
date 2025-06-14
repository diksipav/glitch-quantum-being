
import { motion } from "framer-motion";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { Progress } from "@/components/ui/progress";

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

const skills = [
  { name: "Focus", level: 80 },
  { name: "Clarity", level: 65 },
  { name: "Presence", level: 90 },
  { name: "Resilience", level: 75 },
  { name: "Self-awareness", level: 50 },
]

const Matrix = () => (
  <motion.div
    className="pt-8 md:pt-16 max-w-2xl mx-auto"
    initial="hidden"
    animate="visible"
    variants={containerVariants}
  >
    <motion.h1 variants={itemVariants} className="text-center font-display text-2xl md:text-4xl uppercase glitch" data-text="Cognitive Matrix">
      Cognitive Matrix
    </motion.h1>
    <motion.p variants={itemVariants} className="text-center text-muted-foreground mt-2 text-sm">
      YOUR_MENTAL_BLUEPRINT
    </motion.p>
    
    <MotionCard variants={itemVariants} className="mt-12 text-left">
        <div className="space-y-6">
            {skills.map((skill) => (
                <div key={skill.name}>
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-mono uppercase text-sm text-foreground">{skill.name}</h4>
                        <span className="font-mono text-sm text-primary">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2 [&>div]:bg-primary" />
                </div>
            ))}
        </div>
    </MotionCard>
  </motion.div>
);
export default Matrix;

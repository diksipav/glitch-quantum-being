import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { Button } from "@/components/ui/button";
import { RitualCircle } from "@/components/home/RitualCircle";
import { Check, Play, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { RitualSelection } from "@/components/ritual/RitualSelection";

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

const achievements = [true, true, false];

const Ritual = () => {
  const [pageState, setPageState] = useState<'idle' | 'loading' | 'selecting' | 'running' | 'completed'>('idle');
  const [duration, setDuration] = useState(0); // in seconds
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [selectedRitual, setSelectedRitual] = useState("");

  useEffect(() => {
    if (pageState !== 'running') return;

    if (timeLeft <= 0) {
      setPageState('completed');
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [pageState, timeLeft]);

  useEffect(() => {
    if (pageState === 'loading') {
        const timer = setTimeout(() => setPageState('selecting'), 2000);
        return () => clearTimeout(timer);
    }
  }, [pageState]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };
  
  const handleStartRitual = (ritual: string, durationInMinutes: number) => {
    const newDuration = durationInMinutes * 60;
    setSelectedRitual(ritual);
    setDuration(newDuration);
    setTimeLeft(newDuration);
    setPageState('running');
  };

  const handleReset = () => {
    setPageState('idle');
    setSelectedRitual("");
    setDuration(0);
    setTimeLeft(0);
  }

  const unlockedAchievements = achievements.filter(Boolean).length;

  return (
    <motion.div
      className="text-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 variants={itemVariants} className="font-display text-2xl md:text-4xl uppercase glitch" data-text="Ritual Movements">
        Ritual Movements
      </motion.h1>
      
      <div className="min-h-[350px] flex flex-col justify-center items-center my-8">
        {pageState === 'idle' && (
            <motion.div variants={itemVariants} className="w-full flex flex-col items-center">
                <RitualCircle />
                <p className="text-muted-foreground mt-2 text-sm uppercase tracking-widest">
                    "Movement is prayer the body remembers"
                </p>
                <div className="mt-6">
                    <Button
                        onClick={() => setPageState('loading')}
                        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase font-bold tracking-wider px-8 py-3 w-72 transition-all h-auto"
                    >
                        <Play className="w-4 h-4 mr-2" />Begin Daily Sequence
                    </Button>
                </div>
            </motion.div>
        )}
        {pageState === 'loading' && (
            <motion.div variants={itemVariants} className="flex flex-col items-center justify-center">
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <p className="mt-4 text-muted-foreground uppercase tracking-widest">Preparing ritual...</p>
            </motion.div>
        )}
        {pageState === 'selecting' && (
            <motion.div variants={itemVariants} className="w-full">
                <RitualSelection onStart={handleStartRitual} />
            </motion.div>
        )}
        {(pageState === 'running' || pageState === 'completed') && (
            <motion.div variants={itemVariants} className="w-full flex flex-col items-center">
                 <motion.div
                    animate={{
                        filter: pageState === 'running' ? 'drop-shadow(0 0 0.75rem hsl(var(--primary) / 0.6)) sepia(1) saturate(4) hue-rotate(320deg)' : 'none',
                        scale: pageState === 'running' ? [1, 1.01, 1] : 1,
                    }}
                    transition={{
                        scale: pageState === 'running' ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0.5 },
                        filter: { duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }
                    }}
                >
                    <RitualCircle />
                </motion.div>
                 <p className="text-muted-foreground mt-2 text-sm uppercase tracking-widest">
                    {pageState === 'running' ? `"${selectedRitual}"` : "Ritual Complete"}
                </p>
                <div className="mt-6">
                    <Button
                        variant={pageState === 'completed' ? "default" : "outline"}
                        onClick={pageState === 'completed' ? handleReset : undefined}
                        className={cn(
                            "border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase font-bold tracking-wider px-8 py-3 w-72 transition-all h-auto",
                            pageState === 'running' && "opacity-50 cursor-not-allowed",
                            pageState === 'completed' && "bg-green-500 border-green-500 hover:bg-green-600 text-white animate-pulse"
                        )}
                        disabled={pageState === 'running'}
                    >
                        {pageState === 'completed' ? "Success :) Start New?" : <span className="text-lg font-mono">{formatTime(timeLeft)}</span>}
                    </Button>
                </div>
            </motion.div>
        )}
      </div>

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
           <p className="font-mono text-sm text-primary">{unlockedAchievements}/{achievements.length} UNLOCKED</p>
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
};
export default Ritual;

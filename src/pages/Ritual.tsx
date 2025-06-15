import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { Button } from "@/components/ui/button";
import { RitualCircle } from "@/components/home/RitualCircle";
import { Sparkles, Wind, Activity, Check, Play } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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

const Ritual = () => {
  const [duration, setDuration] = useState(12 * 60);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inputMinutes, setInputMinutes] = useState(12);
  const [inputSeconds, setInputSeconds] = useState(0);

  useEffect(() => {
    if (!isTimerRunning) return;

    if (timeLeft <= 0) {
      setIsTimerRunning(false);
      setIsCompleted(true);
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleStart = () => {
    const newDuration = inputMinutes * 60 + inputSeconds;
    if (newDuration === 0) return;
    setDuration(newDuration);
    setTimeLeft(newDuration);
    setIsTimerRunning(true);
    setIsCompleted(false);
    setIsDialogOpen(false);
  };
  
  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = parseInt(e.target.value, 10) || 0;
      value = Math.max(0, Math.min(59, value));
      setInputMinutes(value);
  }
  const handleSecondChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = parseInt(e.target.value, 10) || 0;
      value = Math.max(0, Math.min(59, value));
      setInputSeconds(value);
  }

  const handleReset = () => {
    setIsCompleted(false);
    setInputMinutes(12);
    setInputSeconds(0);
    const defaultDuration = 12 * 60;
    setDuration(defaultDuration);
    setTimeLeft(defaultDuration);
    setIsDialogOpen(true);
  }

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
      
      <motion.div 
        variants={itemVariants}
        animate={{
          filter: isTimerRunning ? 'drop-shadow(0 0 0.5rem hsl(var(--primary) / 0.5)) sepia(1) saturate(4) hue-rotate(320deg)' : 'none',
          scale: isTimerRunning ? [1, 1.01, 1] : 1,
        }}
        transition={{
          scale: isTimerRunning ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0.5 },
          filter: { duration: 1 }
        }}
      >
        <RitualCircle />
      </motion.div>

      <motion.p variants={itemVariants} className="text-muted-foreground mt-2 text-sm uppercase tracking-widest">
        "Movement is prayer the body remembers"
      </motion.p>
      
      <motion.div variants={itemVariants} className="mt-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                  variant={isCompleted ? "default" : "outline"}
                  onClick={isCompleted ? handleReset : undefined}
                  className={cn(
                      "border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase font-bold tracking-wider px-8 py-3 w-72 transition-all h-auto",
                      isTimerRunning && "opacity-50 cursor-not-allowed",
                      isCompleted && "bg-green-500 border-green-500 hover:bg-green-600 text-white animate-pulse"
                  )}
                  disabled={isTimerRunning}
              >
                {isCompleted ? "Success :) Start New?" : isTimerRunning ? <span className="text-lg font-mono">{formatTime(timeLeft)}</span> : <><Play className="w-4 h-4 mr-2" />Begin Daily Sequence</>}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xs">
              <DialogHeader>
                <DialogTitle className="text-center">Set Sequence Duration</DialogTitle>
              </DialogHeader>
              <div className="flex items-center justify-center gap-2 py-4">
                <div>
                  <Input type="number" value={String(inputMinutes).padStart(2,'0')} onChange={handleMinuteChange} className="w-24 text-center text-5xl h-24 font-mono bg-transparent border-0 shadow-none focus-visible:ring-0 p-0" />
                  <p className="text-xs text-center text-muted-foreground uppercase tracking-widest">Minutes</p>
                </div>
                <span className="text-5xl font-mono text-muted-foreground pb-6">:</span>
                <div>
                  <Input type="number" value={String(inputSeconds).padStart(2,'0')} onChange={handleSecondChange} className="w-24 text-center text-5xl h-24 font-mono bg-transparent border-0 shadow-none focus-visible:ring-0 p-0" />
                  <p className="text-xs text-center text-muted-foreground uppercase tracking-widest">Seconds</p>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleStart} className="w-full">
                  <Play className="w-4 h-4 mr-2"/>
                  Start Ritual
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
};
export default Ritual;

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Plus } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer } from 'recharts';

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

const pastSessions = [
  {
    id: "#112",
    title: "Cosmic Whisper",
    description: "Pretend every sound you hear is a secret message from the universe trying to communicate in code.",
    practiced: "3d ago",
    focus: "+12%"
  },
  {
    id: "#87",
    title: "Quantum Perspective",
    description: "Imagine you're simultaneously in all possible versions of your current location across the multiverse.",
    practiced: "1w ago",
    focus: "+23%"
  },
  {
    id: "#203",
    title: "Temporal Dislocation",
    description: "Picture that you're actually remembering this moment from 10 years in the future.",
    practiced: "2d ago",
    focus: "+17%"
  }
];

const chartBaseData = [
  { value: 10 }, { value: 8 }, { value: 12 }, { value: 9 }, { value: 11 }, { value: 13 }, { value: 10 }, { value: 12 },
];

const Meditation = () => {
  const [duration, setDuration] = useState(13);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [animatedChartData, setAnimatedChartData] = useState(chartBaseData);

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

  useEffect(() => {
    let frameId;
    const animate = (time) => {
      const newChartData = chartBaseData.map((d, i) => ({
        ...d,
        value: d.value + 2 * Math.sin(time / 500 + i / 2),
      }));
      setAnimatedChartData(newChartData);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const handleDurationChange = (d: number) => {
    setDuration(d);
    setIsTimerRunning(false);
    setIsCompleted(false);
    setTimeLeft(d * 60);
  };

  const handleBeginClick = () => {
    if (isTimerRunning) return;
    setIsCompleted(false);
    setTimeLeft(duration * 60);
    setIsTimerRunning(true);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 variants={itemVariants} className="text-center font-display text-2xl md:text-4xl uppercase glitch" data-text="Absurd Meditations">
        Absurd Meditations
      </motion.h1>
      
      <MotionCard variants={itemVariants} className="mt-8 p-4 text-left">
        <div className="flex justify-between items-center">
          <h3 className="font-bold uppercase tracking-widest text-muted-foreground text-sm">Today's Focus</h3>
          <div className="flex items-center space-x-1">
            {[6, 13, 33].map(d => (
              <Button key={d} onClick={() => handleDurationChange(d)} variant={duration === d ? 'secondary' : 'ghost'} size="sm" className="text-xs h-7 px-2">
                {d}:00
              </Button>
            ))}
          </div>
        </div>
        <p className="mt-4 text-foreground/90">"Visualize your thoughts as confused tourists in a city where all street signs are written in an alien language. Watch them wander."</p>
        <div className="mt-4 flex justify-between items-center">
          <Button
            onClick={handleBeginClick}
            variant={isCompleted ? 'default' : 'outline'}
            disabled={isTimerRunning}
            className={cn(
              "w-36 border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase font-bold tracking-wider transition-all",
              isTimerRunning && "opacity-50 cursor-not-allowed",
              isCompleted && "bg-green-500 border-green-500 hover:bg-green-600 text-white animate-pulse"
            )}
          >
            {isCompleted ? "Success :)" : isTimerRunning ? formatTime(timeLeft) : `Begin (${duration} min)`}
          </Button>
          <div className="text-right">
            <h4 className="text-xs uppercase text-muted-foreground">Ambient Frequency</h4>
            <div className="w-32 h-8 mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={animatedChartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </MotionCard>
      
      <motion.div className="mt-8 text-left" variants={containerVariants}>
        {pastSessions.map((session) => (
          <MotionCard key={session.id} variants={itemVariants} className="mb-4 p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold uppercase tracking-widest text-primary">{session.id} - {session.title}</h3>
                <p className="mt-2 text-foreground/90 text-sm">{session.description}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-3 flex justify-between items-center text-xs font-mono uppercase text-muted-foreground">
              <span>Last Practiced: {session.practiced}</span>
              <span className="text-green-400">Focus: {session.focus}</span>
            </div>
          </MotionCard>
        ))}
      </motion.div>
      
      <motion.div variants={itemVariants} className="mt-8">
        <Button variant="outline" className="text-primary border-primary/50 w-full">
          <Plus className="w-4 h-4 mr-2"/>
          Generate Random Meditation
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default Meditation;

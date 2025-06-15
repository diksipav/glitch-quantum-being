
import { Button } from "@/components/ui/button";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { RitualCircle } from "@/components/home/RitualCircle";
import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

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
  const [onboardingStatus, setOnboardingStatus] = useState<"idle" | "processing" | "synchronizing" | "complete" | "optimized">("idle");
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const handleOnboarding = () => {
    if (onboardingStatus !== 'idle') return;

    setOnboardingStatus("processing");
    setTimeout(() => {
      setOnboardingStatus("synchronizing");
      setTimeout(() => {
        setOnboardingStatus("complete");
        // After showing completion, redirect to the auth page
        setTimeout(() => {
          navigate('/auth');
        }, 1000);
      }, 2000);
    }, 1000);
  };

  const getButtonContent = () => {
    switch (onboardingStatus) {
      case "processing":
        return "PROCESSING...";
      case "synchronizing":
        return (
          <>
            <Loader2 className="animate-spin" />
            SYNCHRONIZING BIOFEEDBACK
          </>
        );
      case "complete":
        return (
          <>
            <Check />
            ONBOARDING COMPLETE
          </>
        );
      case "optimized":
        return "SYSTEM OPTIMIZED";
      case "idle":
      default:
        return "Initiate Onboarding";
    }
  };
  
  const getButtonClass = () => {
     switch (onboardingStatus) {
       case 'idle':
         return "border-primary text-primary hover:bg-primary hover:text-primary-foreground";
       case 'processing':
       case 'synchronizing':
       case 'complete':
         return "bg-accent text-accent-foreground cursor-not-allowed";
       case 'optimized':
         return "bg-green-500 hover:bg-green-400 text-primary-foreground cursor-not-allowed";
       default:
         return "";
     }
  }

  return (
    <motion.div 
      className="text-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="-mt-12 md:-mt-8 pt-0.5">
        <RitualCircle />
      </div>
      
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
        <Button 
          variant="outline" 
          className={cn("uppercase font-bold tracking-wider px-8 py-6", getButtonClass())}
          onClick={handleOnboarding}
          disabled={onboardingStatus !== 'idle'}
        >
          {getButtonContent()}
        </Button>
      </motion.div>

      <motion.div 
        className="grid grid-cols-2 gap-4 mt-10 max-w-2xl mx-auto"
        variants={containerVariants}
      >
        <MotionCard variants={itemVariants} className="text-left p-4">
          <h3 className="font-bold uppercase tracking-wider text-muted-foreground text-xs">Daily Ritual</h3>
          {authLoading ? <Loader2 className="w-5 h-5 animate-spin mt-1" /> : user ? (
            <p className="text-lg font-bold mt-1 text-foreground">Completed: <span className="text-primary">{dailyRitualCompleted}/{dailyRitualTotal}</span></p>
          ) : (
            <p className="text-sm font-bold mt-2 text-destructive uppercase animate-pulse">Error: Auth Required</p>
          )}
        </MotionCard>
        <MotionCard variants={itemVariants} className="text-left p-4">
          <h3 className="font-bold uppercase tracking-wider text-muted-foreground text-xs">Energy Level</h3>
          {authLoading ? <Loader2 className="w-5 h-5 animate-spin mt-1" /> : user ? (
            <p className="text-lg font-bold mt-1 text-primary">{energyLevel}%</p>
          ) : (
            <p className="text-sm font-bold mt-2 text-destructive uppercase animate-pulse">Error: Auth Required</p>
          )}
        </MotionCard>
      </motion.div>

      {!authLoading && user && (
        <motion.div className="mt-10 max-w-2xl mx-auto text-left" variants={containerVariants}>
          <h2 className="font-display text-xl uppercase tracking-widest mb-4">Recent Activity</h2>
          <MotionCard variants={itemVariants} className="mb-4 p-4">
            <div className="flex justify-between items-center text-xs text-muted-foreground uppercase">
              <span>Absurd Meditation #47</span>
              <span>2h ago</span>
            </div>
            <p className="mt-2 text-foreground/90 text-sm">"Imagine you're a sentient dust particle in a cosmic library"</p>
          </MotionCard>
          <MotionCard variants={itemVariants} className="p-4">
            <div className="flex justify-between items-center text-xs text-muted-foreground uppercase">
              <span>Presence Challenge</span>
              <span>5h ago</span>
            </div>
            <p className="mt-2 text-foreground/90 text-sm">"Notice 3 unexpected textures in your environment"</p>
          </MotionCard>
        </motion.div>
      )}
    </motion.div>
  );
}

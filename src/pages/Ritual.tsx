import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { Button, buttonVariants } from "@/components/ui/button";
import { RitualCircle } from "@/components/home/RitualCircle";
import { Check, Play, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { RitualSelection } from "@/components/ritual/RitualSelection";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

const achievementsData = [
  { text: "Connecting with yourself and with your breath", unlocked: true, loading: false },
  { text: "Connecting with your feet", unlocked: true, loading: false },
  { text: "Loading achievement", unlocked: false, loading: true },
];

const Ritual = () => {
  const [pageState, setPageState] = useState<'idle' | 'loading' | 'selecting' | 'running' | 'completed'>('idle');
  const [duration, setDuration] = useState(0); // in seconds
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [selectedRitual, setSelectedRitual] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('current_streak, longest_streak')
        .eq('id', user.id)
        .single();
      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      };
      return data;
    },
    enabled: !!user,
  });

  const updateRitualLogMutation = useMutation({
    mutationFn: async ({ ritual, durationInSeconds }: { ritual: string; durationInSeconds: number }) => {
        if (!user) throw new Error("User not found");
        const { error, data } = await supabase.rpc('update_streak_and_log_ritual', {
            p_user_id: user.id,
            p_ritual_name: ritual,
            p_duration_seconds: durationInSeconds
        });
        if (error) throw error;
        return data;
    },
    onSuccess: () => {
        toast.success("Ritual logged. Streak updated!");
        queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
        queryClient.invalidateQueries({ queryKey: ['ritualLogs', user?.id] });
        queryClient.invalidateQueries({ queryKey: ['ritualLogsToday', user?.id] });
    },
    onError: (error: Error) => {
        toast.error(`Failed to log ritual: ${error.message}`);
    }
  });

  useEffect(() => {
    if (pageState !== 'running' || !selectedRitual || duration <= 0) return;

    if (timeLeft <= 0) {
      setPageState('completed');
      updateRitualLogMutation.mutate({ ritual: selectedRitual, durationInSeconds: duration });
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timerId);
  }, [pageState, timeLeft, duration, selectedRitual, updateRitualLogMutation]);

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
  
  const handleStartRitual = (ritual: string, durationInSeconds: number) => {
    const newDuration = durationInSeconds;
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

  const handleCancelSelection = () => setPageState('idle');

  const unlockedAchievements = achievementsData.filter(a => a.unlocked).length;

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
                        className="border-primary text-white hover:bg-primary hover:text-primary-foreground uppercase font-bold tracking-wider px-8 py-3 w-72 transition-all h-auto animate-blink"
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
                <RitualSelection onStart={handleStartRitual} onCancel={handleCancelSelection} />
            </motion.div>
        )}
        {pageState === 'running' && (
            <motion.div variants={itemVariants} className="w-full flex flex-col items-center">
                 <motion.div
                    animate={{
                        filter: 'drop-shadow(0 0 0.75rem hsl(var(--primary) / 0.6)) sepia(1) saturate(4) hue-rotate(320deg)',
                        scale: [1, 1.01, 1],
                    }}
                    transition={{
                        scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                        filter: { duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }
                    }}
                >
                    <RitualCircle />
                </motion.div>
                 <p className="text-muted-foreground mt-2 text-sm uppercase tracking-widest">
                    {`"${selectedRitual}"`}
                </p>
                <div className="mt-6 flex flex-col items-center gap-2">
                    <Button
                        variant="outline"
                        className="border-primary text-primary uppercase font-bold tracking-wider px-8 py-3 w-72 transition-all h-auto opacity-50 cursor-not-allowed"
                        disabled
                    >
                        <span className="text-lg font-mono">{formatTime(timeLeft)}</span>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" className="text-muted-foreground uppercase text-xs tracking-wider hover:text-destructive hover:bg-transparent">Cancel Ritual</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will end your current ritual session. Your progress for this session will not be saved.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Continue Ritual</AlertDialogCancel>
                                <AlertDialogAction onClick={handleReset} className={buttonVariants({ variant: "destructive" })}>Cancel Ritual</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </motion.div>
        )}
        {pageState === 'completed' && (
            <motion.div variants={itemVariants} className="w-full flex flex-col items-center">
                 <motion.div
                    animate={{
                        filter: 'none',
                        scale: 1,
                    }}
                    transition={{ duration: 0.5 }}
                >
                    <RitualCircle />
                </motion.div>
                 <p className="text-muted-foreground mt-2 text-sm uppercase tracking-widest">
                    Ritual Complete
                </p>
                <div className="mt-6">
                    <Button
                        onClick={handleReset}
                        disabled={updateRitualLogMutation.isPending}
                        className={cn(
                            "uppercase font-bold tracking-wider px-8 py-3 w-72 transition-all h-auto",
                            "bg-green-500 border-green-500 hover:bg-green-600 text-white",
                            !updateRitualLogMutation.isPending && "animate-pulse"
                        )}
                    >
                      {updateRitualLogMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {updateRitualLogMutation.isPending ? 'Logging...' : 'Success :) Start New?'}
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
              {isLoadingProfile ? <Loader2 className="w-5 h-5 animate-spin mt-1" /> : <p className="text-primary text-xl font-bold">{profile?.current_streak ?? 0} DAYS</p>}
          </div>
          <div className="text-right">
              <p className="text-xs text-muted-foreground">LONGEST STREAK</p>
              {isLoadingProfile ? <Loader2 className="w-5 h-5 animate-spin mt-1" /> : <p className="text-primary text-xl font-bold">{profile?.longest_streak ?? 0} DAYS</p>}
          </div>
        </div>
      </MotionCard>

      <MotionCard variants={itemVariants} className="max-w-2xl mx-auto mt-8 text-left p-4">
         <div className="flex justify-between items-center mb-4">
           <h3 className="font-bold uppercase tracking-widest text-muted-foreground text-sm">Achievements</h3>
           <p className="font-mono text-sm text-primary">{unlockedAchievements}/{achievementsData.length} UNLOCKED</p>
         </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievementsData.map((achievement, i) => (
              <div key={i} className={cn('aspect-square border-2 flex flex-col items-center justify-center p-4 text-center rounded-md', achievement.unlocked ? 'border-primary bg-primary/10' : 'border-border')}>
                  {achievement.unlocked && <Check className="w-8 h-8 text-primary mb-2" />}
                  {achievement.loading && <Loader2 className="w-8 h-8 text-primary/50 mb-2 animate-spin" />}
                  <p className={cn("text-xs uppercase tracking-wider", achievement.unlocked ? 'text-primary' : 'text-muted-foreground', achievement.loading && 'animate-blink')}>
                    {achievement.text}
                  </p>
              </div>
          ))}
        </div>
      </MotionCard>
    </motion.div>
  );
};
export default Ritual;

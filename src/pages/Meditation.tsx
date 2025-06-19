import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Plus, Play, Trash2, ArrowRight, Clock } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Database } from "@/integrations/supabase/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type MeditationLog = Database['public']['Tables']['meditation_logs']['Row'];

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

const chartBaseData = Array.from({ length: 30 }, (_, i) => ({ 
  value: 10 + Math.sin(i * 0.3) * 8 + Math.cos(i * 0.2) * 5 
}));

const Meditation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [duration, setDuration] = useState(13);
  const [customDuration, setCustomDuration] = useState(13);
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
  const [generatedMeditation, setGeneratedMeditation] = useState<{ title: string; description: string } | null>(null);
  const [animatedChartData, setAnimatedChartData] = useState(chartBaseData);

  const { data: recentMeditations = [], isLoading } = useQuery({
    queryKey: ['recent_meditations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('meditation_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(3);

      if (error) {
        toast.error("Failed to fetch recent meditations from the cosmic archive.");
        throw error;
      }
      return data as MeditationLog[];
    },
    enabled: !!user,
  });

  const generateMeditationMutation = useMutation({
    mutationFn: async () => {
      const existingTitles = recentMeditations.map(m => m.title);
      const { data, error } = await supabase.functions.invoke('generate-meditation', {
        body: { existingTitles }
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      setGeneratedMeditation(data);
      toast.success("New absurd meditation generated from the cosmic void.");
    },
    onError: (error) => {
      toast.error(`Meditation generation failed: ${error.message}`);
    },
  });

  const deleteMeditationMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('meditation_logs')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recent_meditations', user?.id] });
      toast.warning("Meditation erased from reality. The cosmic void expands.", {
        description: "Timeline disruption detected. Proceed with caution."
      });
    },
    onError: (error) => {
      toast.error(`Failed to erase meditation: ${error.message}`);
    },
  });

  useEffect(() => {
    let frameId: number;
    const animate = (time: number) => {
      const newChartData = chartBaseData.map((d, i) => {
        const wave1 = Math.sin(time / 1000 + i * 0.3) * 8;
        const wave2 = Math.cos(time / 1500 + i * 0.2) * 5;
        const wave3 = Math.sin(time / 800 + i * 0.5) * 3;
        return {
          ...d,
          value: d.value + wave1 + wave2 + wave3,
        };
      });
      setAnimatedChartData(newChartData);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const handleDurationChange = (d: number) => {
    setDuration(d);
  };

  const handleCustomDuration = () => {
    setDuration(customDuration);
    setIsCustomDialogOpen(false);
    toast.success(`Custom meditation time set: ${customDuration} minutes`);
  };

  const handleBeginClick = () => {
    const meditation = generatedMeditation || {
      title: "Quantum Perspective",
      description: "Visualize your thoughts as confused tourists in a city where all street signs are written in an alien language. Watch them wander."
    };
    
    navigate(`/meditation-session/${duration}/${encodeURIComponent(meditation.title)}/${encodeURIComponent(meditation.description)}`);
  };

  const handleAcceptGenerated = () => {
    if (generatedMeditation) {
      toast.success("Meditation accepted. Reality bends to your will.");
    }
  };

  const handleRejectGenerated = () => {
    setGeneratedMeditation(null);
    generateMeditationMutation.mutate();
  };

  const handleRepeatMeditation = (meditation: MeditationLog) => {
    navigate(`/meditation-session/${meditation.duration_minutes}/${encodeURIComponent(meditation.title)}/${encodeURIComponent(meditation.description)}`);
  };

  const currentMeditation = generatedMeditation || {
    title: "Quantum Perspective",
    description: "Visualize your thoughts as confused tourists in a city where all street signs are written in an alien language. Watch them wander."
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
      
      {user && (
        <MotionCard variants={itemVariants} className="mt-8 p-4 text-left">
          <div className="flex justify-between items-center">
            <h3 className="font-bold uppercase tracking-widest text-muted-foreground text-sm">Today's Focus</h3>
            <div className="flex items-center space-x-1">
              {[6, 13, 33].map(d => (
                <Button key={d} onClick={() => handleDurationChange(d)} variant={duration === d ? 'secondary' : 'ghost'} size="sm" className="text-xs h-7 px-2">
                  {d}:00
                </Button>
              ))}
              <Dialog open={isCustomDialogOpen} onOpenChange={setIsCustomDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                    <Clock className="w-3 h-3 mr-1" />
                    Custom
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Custom Meditation Duration</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        max="120"
                        value={customDuration}
                        onChange={(e) => setCustomDuration(parseInt(e.target.value) || 1)}
                        className="mt-1"
                      />
                    </div>
                    <Button onClick={handleCustomDuration} className="w-full">
                      Set Duration
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <h4 className="mt-4 font-bold uppercase tracking-widest text-primary">{currentMeditation.title}</h4>
          <p className="mt-2 text-foreground/90 text-sm">{currentMeditation.description}</p>
          
          {generatedMeditation && (
            <div className="mt-3 flex gap-2">
              <Button onClick={handleAcceptGenerated} variant="outline" size="sm" className="text-green-400 border-green-400/50">
                Accept
              </Button>
              <Button onClick={handleRejectGenerated} variant="outline" size="sm" className="text-destructive border-destructive/50">
                Generate New
              </Button>
            </div>
          )}
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                onClick={handleBeginClick}
                variant="outline"
                className="w-36 border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase font-bold tracking-wider transition-all"
              >
                Begin ({duration} min)
              </Button>
            </div>
            <div className="text-right">
              <h4 className="text-xs uppercase text-muted-foreground">Ambient Frequency</h4>
              <div className="w-32 h-8 mt-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={animatedChartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="flowingGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="hsl(280, 70%, 60%)" stopOpacity={0.8}/>
                        <stop offset="50%" stopColor="hsl(320, 70%, 70%)" stopOpacity={0.6}/>
                        <stop offset="100%" stopColor="hsl(260, 70%, 60%)" stopOpacity={0.8}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      dataKey="value" 
                      stroke="hsl(300, 70%, 70%)" 
                      strokeWidth={2} 
                      fill="url(#flowingGradient)"
                      strokeLinecap="round"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </MotionCard>
      )}
      
      <motion.div className="mt-8 text-left" variants={containerVariants}>
        {!user && (
          <motion.p variants={itemVariants} className="text-center text-muted-foreground mb-4">
            Log in to start a new meditation. Here are some of our past sessions.
          </motion.p>
        )}
        
        {user && recentMeditations.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold uppercase tracking-widest text-muted-foreground text-sm">Recent Activity</h3>
              <Button onClick={() => navigate('/meditation-logs')} variant="ghost" size="sm">
                <ArrowRight className="w-4 h-4 mr-1" />
                View All Logs
              </Button>
            </div>
            {recentMeditations.map((meditation) => (
              <MotionCard key={meditation.id} variants={itemVariants} className="mb-4 p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold uppercase tracking-widest text-primary">{meditation.title}</h3>
                    <p className="mt-2 text-foreground/90 text-sm">{meditation.description}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button 
                      onClick={() => handleRepeatMeditation(meditation)}
                      variant="outline" 
                      size="sm"
                      className="text-primary border-primary/50"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button 
                      onClick={() => deleteMeditationMutation.mutate(meditation.id)}
                      variant="outline" 
                      size="sm"
                      className="text-destructive border-destructive/50 hover:bg-destructive/10"
                      disabled={deleteMeditationMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3 text-xs font-mono uppercase text-muted-foreground">
                  <span>Duration: {meditation.duration_minutes} min • Completed: {new Date(meditation.completed_at).toLocaleDateString()}</span>
                </div>
              </MotionCard>
            ))}
          </>
        )}
      </motion.div>
      
      {user && (
        <motion.div variants={itemVariants} className="mt-8">
          <Button 
            onClick={() => generateMeditationMutation.mutate()}
            disabled={generateMeditationMutation.isPending}
            variant="outline" 
            className="text-primary border-primary/50 w-full"
          >
            <Plus className="w-4 h-4 mr-2"/>
            {generateMeditationMutation.isPending ? "Channeling cosmic wisdom..." : "Generate Random Meditation"}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Meditation;

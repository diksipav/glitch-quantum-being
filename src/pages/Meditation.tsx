
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Plus, Trash2, Play, History } from "lucide-react";
import { WaveAnimation } from "@/components/meditation/WaveAnimation";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Database } from "@/integrations/supabase/types";

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

const Meditation = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [duration, setDuration] = useState(13);
  const [currentMeditation, setCurrentMeditation] = useState({
    title: "Thought Tourists",
    description: "Visualize your thoughts as confused tourists in a city where all street signs are written in an alien language. Watch them wander."
  });
  const [showMeditationOptions, setShowMeditationOptions] = useState(false);

  // Fetch recent meditation logs
  const { data: recentMeditations = [] } = useQuery({
    queryKey: ['recent_meditations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('meditation_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(2);

      if (error) return [];
      return data as MeditationLog[];
    },
    enabled: !!user,
  });

  // Fetch past meditations for selection
  const { data: pastMeditations = [] } = useQuery({
    queryKey: ['past_meditations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('meditation_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) return [];
      return data as MeditationLog[];
    },
    enabled: !!user,
  });

  const generateMeditationMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('generate-meditation');
      if (error) throw error;
      return data.error ? data.fallback : data;
    },
    onSuccess: (data) => {
      setCurrentMeditation(data);
      setShowMeditationOptions(true);
      toast.success("New cosmic meditation generated");
    },
    onError: () => {
      toast.error("Failed to generate meditation");
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
      toast.warning("Meditation erased from cosmic records");
      queryClient.invalidateQueries({ queryKey: ['past_meditations', user?.id] });
    },
  });

  const handleDurationChange = (d: number) => {
    setDuration(d);
  };

  const handleBeginClick = () => {
    navigate('/meditation-session', {
      state: {
        title: currentMeditation.title,
        description: currentMeditation.description,
        duration: duration
      }
    });
  };

  const handleAcceptMeditation = () => {
    setShowMeditationOptions(false);
    toast.success("Meditation accepted into your reality");
  };

  const handleRejectMeditation = () => {
    generateMeditationMutation.mutate();
  };

  const handleSelectPastMeditation = (meditation: MeditationLog) => {
    setCurrentMeditation({
      title: meditation.title,
      description: meditation.description
    });
    setShowMeditationOptions(false);
    toast.info("Past meditation loaded into present moment");
  };

  const handleDeleteMeditation = (id: string, title: string) => {
    toast.custom((t) => (
      <div className="bg-terminal border border-destructive/50 p-4 rounded-lg shadow-lg">
        <h4 className="font-bold text-destructive uppercase">⚠️ COSMIC VOID DESTRUCTION</h4>
        <p className="text-sm mt-2">
          Erasing "{title}" will create ripples in the meditation matrix. This cannot be undone.
        </p>
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              deleteMeditationMutation.mutate(id);
              toast.dismiss(t);
            }}
          >
            DESTROY
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.dismiss(t)}
          >
            Preserve
          </Button>
        </div>
      </div>
    ), { duration: Infinity });
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
            <h3 className="font-bold uppercase tracking-widest text-muted-foreground text-sm">
              {showMeditationOptions ? "Generated Meditation" : "Today's Focus"}
            </h3>
            <div className="flex items-center space-x-1">
              {[6, 13, 33].map(d => (
                <Button key={d} onClick={() => handleDurationChange(d)} variant={duration === d ? 'secondary' : 'ghost'} size="sm" className="text-xs h-7 px-2">
                  {d}:00
                </Button>
              ))}
            </div>
          </div>
          
          <p className="mt-4 text-foreground/90">"{currentMeditation.description}"</p>
          
          {showMeditationOptions && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex gap-2"
            >
              <Button
                onClick={handleAcceptMeditation}
                variant="outline"
                size="sm"
                className="text-green-400 border-green-400/50"
              >
                Accept
              </Button>
              <Button
                onClick={handleRejectMeditation}
                variant="outline"
                size="sm"
                className="text-destructive border-destructive/50"
                disabled={generateMeditationMutation.isPending}
              >
                {generateMeditationMutation.isPending ? "Generating..." : "Reject & Generate New"}
              </Button>
            </motion.div>
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
                <WaveAnimation />
              </div>
            </div>
          </div>
        </MotionCard>
      )}

      {/* Recent Activity */}
      {user && recentMeditations.length > 0 && (
        <motion.div className="mt-8" variants={itemVariants}>
          <h3 className="font-bold uppercase tracking-widest text-muted-foreground text-sm mb-4">Recent Activity</h3>
          <div className="space-y-2">
            {recentMeditations.map((meditation) => (
              <TerminalCard key={meditation.id} className="p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-primary text-sm">{meditation.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {meditation.duration_minutes} min • {new Date(meditation.completed_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSelectPastMeditation(meditation)}
                    className="text-green-400 hover:text-green-300"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </TerminalCard>
            ))}
          </div>
        </motion.div>
      )}

      {/* Past Meditation Logs */}
      {user && pastMeditations.length > 0 && (
        <motion.div className="mt-8" variants={itemVariants}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold uppercase tracking-widest text-muted-foreground text-sm">Past Meditation Logs</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/meditation-logs')}
              className="text-primary hover:text-primary/80"
            >
              <History className="w-4 h-4 mr-1" />
              View All
            </Button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {pastMeditations.slice(0, 5).map((meditation) => (
              <TerminalCard key={meditation.id} className="p-3">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h4 className="font-bold text-primary text-sm">{meditation.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {meditation.description}
                    </p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSelectPastMeditation(meditation)}
                      className="text-green-400 hover:text-green-300"
                    >
                      <Play className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMeditation(meditation.id, meditation.title)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </TerminalCard>
            ))}
          </div>
        </motion.div>
      )}
      
      <motion.div className="mt-8 text-left" variants={containerVariants}>
        {!user && (
          <motion.p variants={itemVariants} className="text-center text-muted-foreground mb-4">
            Log in to start generating meditations and track your practice.
          </motion.p>
        )}
      </motion.div>
      
      {user && (
        <motion.div variants={itemVariants} className="mt-8">
          <Button 
            variant="outline" 
            className="text-primary border-primary/50 w-full"
            onClick={() => generateMeditationMutation.mutate()}
            disabled={generateMeditationMutation.isPending}
          >
            <Plus className="w-4 h-4 mr-2"/>
            {generateMeditationMutation.isPending ? "Generating..." : "Generate Random Meditation"}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Meditation;

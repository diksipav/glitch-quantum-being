
import { motion } from "framer-motion";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { Button } from "@/components/ui/button";
import { Trash2, Play, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Database } from "@/integrations/supabase/types";

type MeditationLog = Database['public']['Tables']['meditation_logs']['Row'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const MotionCard = motion(TerminalCard);

const MeditationLogs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: meditationLogs = [], isLoading } = useQuery({
    queryKey: ['meditation_logs', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('meditation_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) {
        toast.error("Failed to fetch meditation logs");
        return [];
      }
      return data as MeditationLog[];
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('meditation_logs')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.warning("Meditation erased from the cosmic records. Reality trembles.");
      queryClient.invalidateQueries({ queryKey: ['meditation_logs', user?.id] });
    },
    onError: () => {
      toast.error("Failed to erase meditation from existence");
    },
  });

  const handleRepeat = (meditation: MeditationLog) => {
    navigate('/meditation-session', {
      state: {
        title: meditation.title,
        description: meditation.description,
        duration: meditation.duration_minutes
      }
    });
  };

  const handleDelete = (id: string, title: string) => {
    toast.custom((t) => (
      <div className="bg-terminal border border-destructive/50 p-4 rounded-lg shadow-lg">
        <h4 className="font-bold text-destructive uppercase">⚠️ COSMIC VOID DESTRUCTION</h4>
        <p className="text-sm mt-2">
          You are about to erase "{title}" from the fabric of reality. 
          This action will cause ripples across the quantum field and cannot be undone.
        </p>
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              deleteMutation.mutate(id);
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
            Preserve Reality
          </Button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <div className="animate-pulse">Loading meditation archives...</div>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-2xl mx-auto p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/meditation')}
          className="text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Meditations
        </Button>
      </div>

      <motion.h1 variants={itemVariants} className="text-center font-display text-2xl md:text-4xl uppercase glitch mb-8" data-text="Past Meditation Logs">
        Past Meditation Logs
      </motion.h1>

      <div className="space-y-4">
        {meditationLogs.length === 0 ? (
          <MotionCard variants={itemVariants} className="p-6 text-center text-muted-foreground">
            No meditation logs found. Your cosmic journey awaits.
          </MotionCard>
        ) : (
          meditationLogs.map((meditation) => (
            <MotionCard key={meditation.id} variants={itemVariants} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold uppercase tracking-widest text-primary">
                    {meditation.title}
                  </h3>
                  <p className="mt-2 text-foreground/90 text-sm">
                    {meditation.description}
                  </p>
                  <div className="mt-3 flex justify-between items-center text-xs font-mono uppercase text-muted-foreground">
                    <span>Duration: {meditation.duration_minutes} min</span>
                    <span>Completed: {new Date(meditation.completed_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRepeat(meditation)}
                    className="text-green-400 hover:text-green-300"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(meditation.id, meditation.title)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </MotionCard>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default MeditationLogs;

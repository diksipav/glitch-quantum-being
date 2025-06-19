
import { motion } from "framer-motion";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Trash2, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
  const navigate = useNavigate();
  const { user } = useAuth();
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
        toast.error("Failed to fetch meditation logs from the cosmic archive.");
        throw error;
      }
      return data as MeditationLog[];
    },
    enabled: !!user,
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
      queryClient.invalidateQueries({ queryKey: ['meditation_logs', user?.id] });
      toast.warning("Meditation erased from reality. The cosmic void expands.", {
        description: "Timeline disruption detected. Proceed with caution."
      });
    },
    onError: (error) => {
      toast.error(`Failed to erase meditation: ${error.message}`);
    },
  });

  const handleRepeat = (log: MeditationLog) => {
    navigate(`/meditation-session/${log.duration_minutes}/${encodeURIComponent(log.title)}/${encodeURIComponent(log.description)}`);
  };

  const handleDelete = (id: string) => {
    deleteMeditationMutation.mutate(id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="mb-8">
        <Button onClick={() => navigate('/meditation')} variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Meditations
        </Button>
        <h1 className="font-display text-2xl md:text-4xl uppercase glitch text-center" data-text="Past Meditation Logs">
          Past Meditation Logs
        </h1>
        <p className="text-center text-muted-foreground mt-2 text-sm">
          CONSCIOUSNESS_ARCHIVE_ACCESSED
        </p>
      </motion.div>

      <div className="space-y-4">
        {isLoading && (
          <TerminalCard className="p-4 text-center">
            <p className="text-muted-foreground">Accessing cosmic meditation archive...</p>
          </TerminalCard>
        )}

        {!isLoading && meditationLogs.length === 0 && (
          <TerminalCard className="p-4 text-center">
            <p className="text-muted-foreground">No meditation logs found. The archive is empty.</p>
          </TerminalCard>
        )}

        {meditationLogs.map((log) => (
          <MotionCard key={log.id} variants={itemVariants} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold uppercase tracking-widest text-primary">{log.title}</h3>
                <p className="mt-2 text-foreground/90 text-sm">{log.description}</p>
                <div className="mt-3 flex gap-4 text-xs font-mono uppercase text-muted-foreground">
                  <span>Duration: {log.duration_minutes} min</span>
                  <span>Completed: {formatDate(log.completed_at)}</span>
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Button 
                  onClick={() => handleRepeat(log)}
                  variant="outline" 
                  size="sm"
                  className="text-primary border-primary/50"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Repeat
                </Button>
                <Button 
                  onClick={() => handleDelete(log.id)}
                  variant="outline" 
                  size="sm"
                  className="text-destructive border-destructive/50 hover:bg-destructive/10"
                  disabled={deleteMeditationMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </MotionCard>
        ))}
      </div>
    </motion.div>
  );
};

export default MeditationLogs;

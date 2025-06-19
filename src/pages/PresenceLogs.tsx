
import { motion } from "framer-motion";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Database } from "@/integrations/supabase/types";

type PresenceLog = Database['public']['Tables']['presence_logs']['Row'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const MotionCard = motion(TerminalCard);

const PresenceLogs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: presenceLogs = [], isLoading } = useQuery({
    queryKey: ['presence_logs', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('presence_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) {
        toast.error("Failed to fetch presence logs");
        return [];
      }
      return data as PresenceLog[];
    },
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('presence_logs')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.warning("Presence log erased from the quantum field. The void expands.");
      queryClient.invalidateQueries({ queryKey: ['presence_logs', user?.id] });
    },
    onError: () => {
      toast.error("Failed to erase presence from existence");
    },
  });

  const handleDelete = (id: string, title: string) => {
    toast.custom((t) => (
      <div className="bg-terminal border border-destructive/50 p-4 rounded-lg shadow-lg">
        <h4 className="font-bold text-destructive uppercase">⚠️ COSMIC VOID DESTRUCTION</h4>
        <p className="text-sm mt-2">
          You are about to erase "{title}" from the presence matrix. 
          This action will destabilize the quantum consciousness field and cannot be undone.
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
            OBLITERATE
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.dismiss(t)}
          >
            Maintain Presence
          </Button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        <div className="animate-pulse">Scanning presence archives...</div>
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
          onClick={() => navigate('/presence')}
          className="text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Presence
        </Button>
      </div>

      <motion.h1 variants={itemVariants} className="text-center font-display text-2xl md:text-4xl uppercase glitch mb-8" data-text="Past Presence Logs">
        Past Presence Logs
      </motion.h1>

      <div className="space-y-4">
        {presenceLogs.length === 0 ? (
          <MotionCard variants={itemVariants} className="p-6 text-center text-muted-foreground">
            No presence logs detected. Your awareness journey begins now.
          </MotionCard>
        ) : (
          presenceLogs.map((log) => (
            <MotionCard key={log.id} variants={itemVariants} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold uppercase tracking-widest text-primary">
                    {log.title}
                  </h3>
                  <p className="mt-2 text-foreground/90 text-sm">
                    {log.description}
                  </p>
                  <div className="mt-3 text-xs font-mono uppercase text-muted-foreground">
                    <span>Completed: {new Date(log.completed_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(log.id, log.title)}
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

export default PresenceLogs;

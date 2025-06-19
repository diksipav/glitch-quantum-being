
import { motion } from "framer-motion";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
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
  const navigate = useNavigate();
  const { user } = useAuth();

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
        toast.error("Failed to fetch presence logs from the stream.");
        throw error;
      }
      return data as PresenceLog[];
    },
    enabled: !!user,
  });

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
        <Button onClick={() => navigate('/presence')} variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Presence
        </Button>
        <h1 className="font-display text-2xl md:text-4xl uppercase glitch text-center" data-text="Past Presence Logs">
          Past Presence Logs
        </h1>
        <p className="text-center text-muted-foreground mt-2 text-sm">
          PRESENCE_ARCHIVE_ACCESSED
        </p>
      </motion.div>

      <div className="space-y-4">
        {isLoading && (
          <TerminalCard className="p-4 text-center">
            <p className="text-muted-foreground">Accessing presence stream archive...</p>
          </TerminalCard>
        )}

        {!isLoading && presenceLogs.length === 0 && (
          <TerminalCard className="p-4 text-center">
            <p className="text-muted-foreground">No presence logs found. The stream is quiet.</p>
          </TerminalCard>
        )}

        {presenceLogs.map((log) => (
          <MotionCard key={log.id} variants={itemVariants} className="p-4">
            <div>
              <h3 className="font-bold uppercase tracking-widest text-primary">{log.title}</h3>
              <p className="mt-2 text-foreground/90 text-sm">{log.description}</p>
              <div className="mt-3 text-xs font-mono uppercase text-muted-foreground">
                <span>Completed: {formatDate(log.completed_at)}</span>
              </div>
            </div>
          </MotionCard>
        ))}
      </div>
    </motion.div>
  );
};

export default PresenceLogs;

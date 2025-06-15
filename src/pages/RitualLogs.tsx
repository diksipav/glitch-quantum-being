
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, BookOpen } from 'lucide-react';
import { TerminalCard } from '@/components/ui/TerminalCard';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const fetchRitualLogs = async (userId: string) => {
  const { data, error } = await supabase
    .from('ritual_logs')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export default function RitualLogs() {
  const { user } = useAuth();
  const { data: logs, isLoading, error } = useQuery({
    queryKey: ['ritualLogs', user?.id],
    queryFn: () => fetchRitualLogs(user!.id),
    enabled: !!user,
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-display text-2xl uppercase tracking-widest glitch mb-4" data-text="Ritual Logs">
        Ritual Logs
      </h1>
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
        </div>
      )}
      {error && (
        <TerminalCard className="p-4 text-destructive">
          <p>Error loading ritual logs: {error.message}</p>
        </TerminalCard>
      )}
      {!isLoading && !error && logs && (
        <>
          {logs.length === 0 ? (
            <TerminalCard className="p-8 text-center">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No ritual logs found. Complete a ritual to see it here.</p>
              <Button asChild variant="link" className="mt-4">
                  <Link to="/ritual">Go to Rituals</Link>
              </Button>
            </TerminalCard>
          ) : (
            <div className="space-y-4">
              {logs.map(log => (
                <TerminalCard key={log.id} className="p-4">
                  <div className="flex justify-between items-center text-xs text-muted-foreground uppercase">
                    <span>{log.ritual_name}</span>
                    <span>{format(new Date(log.completed_at), 'MMM dd, yyyy - HH:mm')}</span>
                  </div>
                  <p className="mt-2 text-foreground/90 text-sm">
                    Duration: {Math.floor(log.duration_seconds / 60)}m {log.duration_seconds % 60}s
                  </p>
                </TerminalCard>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

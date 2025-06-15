
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, BookOpen } from 'lucide-react';
import { TerminalCard } from '@/components/ui/TerminalCard';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const fetchJournalEntries = async (userId: string) => {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export default function JournalHistory() {
  const { user } = useAuth();
  const { data: entries, isLoading, error } = useQuery({
    queryKey: ['journalEntries', user?.id],
    queryFn: () => fetchJournalEntries(user!.id),
    enabled: !!user,
  });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-display text-2xl uppercase tracking-widest glitch mb-4" data-text="Journal History">
        Journal History
      </h1>
      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-16 h-16 text-primary animate-spin" />
        </div>
      )}
      {error && (
        <TerminalCard className="p-4 text-destructive">
          <p>Error loading journal entries: {error.message}</p>
        </TerminalCard>
      )}
      {!isLoading && !error && entries && (
        <>
          {entries.length === 0 ? (
            <TerminalCard className="p-8 text-center">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No journal entries found. Write an entry to see it here.</p>
              <Button asChild variant="link" className="mt-4">
                  <Link to="/journal">Go to Journal</Link>
              </Button>
            </TerminalCard>
          ) : (
            <div className="space-y-4">
              {entries.map(entry => (
                <TerminalCard key={entry.id} className="p-4">
                  <div className="flex justify-between items-center text-xs text-muted-foreground uppercase">
                    <span>{format(new Date(entry.created_at), 'MMM dd, yyyy - HH:mm')}</span>
                  </div>
                  {entry.prompt && <p className="mt-2 text-primary/80 text-sm italic">"{entry.prompt}"</p>}
                  <p className="mt-2 text-foreground/90 whitespace-pre-wrap">{entry.content}</p>
                </TerminalCard>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}


import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, BookOpen, Trash2 } from 'lucide-react';
import { TerminalCard } from '@/components/ui/TerminalCard';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';


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
  const queryClient = useQueryClient();
  const [entryToDelete, setEntryToDelete] = useState<Tables<'journal_entries'> | null>(null);

  const { data: entries, isLoading, error } = useQuery({
    queryKey: ['journalEntries', user?.id],
    queryFn: () => fetchJournalEntries(user!.id),
    enabled: !!user,
  });

  const { mutate: deleteEntry, isPending: isDeleting } = useMutation({
    mutationFn: async (entryId: string) => {
      if (!user) throw new Error("You must be logged in.");
      const { error } = await supabase.from('journal_entries').delete().eq('id', entryId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Journal entry vaporized into cosmic dust.");
      queryClient.invalidateQueries({ queryKey: ["journalEntries", user?.id] });
      setEntryToDelete(null);
    },
    onError: (error: any) => {
      toast.error(`Error: ${error.message}`);
      setEntryToDelete(null);
    }
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
                  <div className="flex justify-between items-start gap-2">
                    <div className='flex-grow'>
                      <div className="text-xs text-muted-foreground uppercase">
                        <span>{format(new Date(entry.created_at), 'MMM dd, yyyy - HH:mm')}</span>
                      </div>
                      {entry.prompt && <p className="mt-2 text-primary/80 text-sm italic">"{entry.prompt}"</p>}
                      <p className={cn("mt-2 text-foreground/90 whitespace-pre-wrap transition-all", { "text-destructive line-through": entryToDelete?.id === entry.id })}>{entry.content}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 text-destructive/80 hover:text-destructive" onClick={() => setEntryToDelete(entry)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TerminalCard>
              ))}
            </div>
          )}
        </>
      )}
       <AlertDialog open={!!entryToDelete} onOpenChange={(isOpen) => !isOpen && setEntryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this memory?</AlertDialogTitle>
            <AlertDialogDescription>
              This entry will be permanently erased from the cosmic record. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => entryToDelete && deleteEntry(entryToDelete.id)}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

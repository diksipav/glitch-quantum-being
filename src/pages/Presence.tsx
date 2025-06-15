
import { motion } from "framer-motion";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { Button } from "@/components/ui/button";
import { Check, Search, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";
import { useMemo } from "react";

type Challenge = Database['public']['Tables']['challenges']['Row'];
type UserChallenge = Database['public']['Tables']['user_challenges']['Row'];
type UserChallengeWithChallenge = UserChallenge & { challenges: Challenge | null };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const MotionCard = motion(TerminalCard);

const Presence = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: userChallenges, isLoading: isLoadingChallenges } = useQuery({
    queryKey: ['user_challenges', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('user_challenges')
        .select('*, challenges(*)')
        .eq('user_id', user.id)
        .not('status', 'eq', 'rejected')
        .order('created_at', { referencedTable: 'challenges', ascending: true });

      if (error) {
        toast.error("Could not fetch presence data. The fabric of reality is thin here.");
        console.error(error);
        return [];
      }
      return data as UserChallengeWithChallenge[];
    },
    enabled: !!user,
  });

  const updateUserChallengeMutation = useMutation({
    mutationFn: async ({ id, status, started_at }: { id: string; status: string; started_at?: string | null }) => {
      const updateObject: Partial<UserChallenge> = { status, updated_at: new Date().toISOString() };
      if (started_at !== undefined) updateObject.started_at = started_at;
      
      const { error } = await supabase.from('user_challenges').update(updateObject).eq('id', id);
      if (error) throw error;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user_challenges', user?.id] });
      if (variables.status === 'active') toast.success("New presence challenge initiated. Observe.");
      if (variables.status === 'rejected') toast.warning("Presence challenge rejected. It fades from your reality.");
      if (variables.status === 'not_started') toast.info("Presence challenge aborted.");
      if (variables.status === 'completed') toast.success("Presence challenge complete. Data integrated.");
    },
    onError: (error) => toast.error(`Action failed: ${error.message}`),
  });

  const activeChallenge = useMemo(() => userChallenges?.find(c => c.status === 'active'), [userChallenges]);

  const handleAccept = (userChallengeId: string) => {
    if (activeChallenge) {
      toast.info("A presence challenge is already active. Abort it first.");
      return;
    }
    updateUserChallengeMutation.mutate({ id: userChallengeId, status: 'active', started_at: new Date().toISOString() });
  };

  const handleReject = (userChallengeId: string) => updateUserChallengeMutation.mutate({ id: userChallengeId, status: 'rejected' });
  const handleAbort = (userChallengeId: string) => updateUserChallengeMutation.mutate({ id: userChallengeId, status: 'not_started', started_at: null });
  const handleComplete = (userChallengeId: string) => updateUserChallengeMutation.mutate({ id: userChallengeId, status: 'completed' });

  const exploreMutation = useMutation({
    mutationFn: async () => {
        if (!user) throw new Error("User not authenticated.");
        const existingTitles = userChallenges?.map(uc => uc.challenges?.title).filter(Boolean) as string[] ?? [];
        
        const { data: newChallengeJSON, error: generationError } = await supabase.functions.invoke('generate-challenge', {
            body: { existingTitles }
        });
        if (generationError) throw new Error(`Challenge generation failed: ${generationError.message}`);

        const { data: insertedChallenge, error: insertChallengeError } = await supabase.from('challenges').insert(newChallengeJSON).select().single();
        if (insertChallengeError) {
          if (insertChallengeError.code === '23505') { // unique_violation
            toast.warning("Generated a duplicate challenge. Retrying...");
            exploreMutation.mutate(); // Retry
            return null;
          }
          throw new Error(`Could not save new challenge: ${insertChallengeError.message}`);
        }

        const { error: insertUserChallengeError } = await supabase.from('user_challenges').insert({ user_id: user.id, challenge_id: insertedChallenge.id, status: 'not_started' });
        if (insertUserChallengeError) throw new Error(`Could not assign new challenge: ${insertUserChallengeError.message}`);

        return insertedChallenge;
    },
    onSuccess: (data) => {
        if(data === null) return;
        toast.success("A new presence vector has been plotted.");
        queryClient.invalidateQueries({ queryKey: ['user_challenges', user?.id] });
    },
    onError: (error: Error) => toast.error(error.message),
});


  const renderChallengeCard = (challenge: UserChallengeWithChallenge) => {
    if (!challenge.challenges) return null;
    const { title, description, difficulty } = challenge.challenges;

    return (
      <MotionCard key={challenge.id} variants={itemVariants} className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold uppercase tracking-widest text-primary">{title}</h3>
            <p className="mt-2 text-foreground/90 text-sm">{description}</p>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            {challenge.status === 'not_started' && <Button variant="outline" size="sm" className="text-xs h-7 pointer-events-none">{difficulty}</Button>}
            {challenge.status === 'completed' && <div className="text-xs text-green-400 flex items-center"><Check className="w-4 h-4 mr-1"/> COMPLETE</div>}
            {challenge.status === 'active' && <Button onClick={() => handleAbort(challenge.id)} variant="outline" size="sm" className="text-xs h-7 text-destructive border-destructive/50 hover:bg-destructive/10 hover:text-destructive">ABORT</Button>}
          </div>
        </div>
        <div className="mt-4 flex justify-between items-end text-xs font-mono uppercase">
           <div>
            {challenge.status === 'active' && <div className="text-green-400 animate-pulse">STATUS: ACTIVE</div>}
           </div>
          <div className="flex gap-4">
            {challenge.status === 'not_started' && (
              <>
                <Button onClick={() => handleReject(challenge.id)} variant="ghost" className="text-destructive h-auto p-0 hover:bg-transparent hover:text-destructive/80">REJECT</Button>
                <Button onClick={() => handleAccept(challenge.id)} disabled={!!activeChallenge || updateUserChallengeMutation.isPending} variant="ghost" className="text-primary h-auto p-0 hover:bg-transparent hover:text-primary/80 disabled:opacity-50">ACCEPT</Button>
              </>
            )}
             {challenge.status === 'active' && <Button onClick={() => handleComplete(challenge.id)} variant="ghost" className="text-green-400 h-auto p-0 hover:bg-transparent hover:text-green-300">MARK COMPLETE</Button>}
          </div>
        </div>
      </MotionCard>
    );
  };
  
  const availableChallenges = userChallenges?.filter(c => c.status === 'not_started') || [];
  const completedChallenges = userChallenges?.filter(c => c.status === 'completed') || [];
  
  return (
    <motion.div className="text-center" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.h1 variants={itemVariants} className="font-display text-2xl md:text-4xl uppercase glitch" data-text="PRESENCE">
        PRESENCE
      </motion.h1>
      <motion.p variants={itemVariants} className="text-muted-foreground mt-2 text-sm">
        AWARENESS_PROTOCOL_ACTIVE
      </motion.p>
      
      <div className="grid grid-cols-1 gap-4 mt-8 max-w-2xl mx-auto text-left">
        {isLoadingChallenges && (
            <div className="flex justify-center items-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="ml-4 font-mono">SYNCING WITH THE STREAM...</p>
            </div>
        )}

        {activeChallenge && (
            <>
                <h2 className="font-mono text-green-400 text-sm uppercase mt-8 border-t border-primary/20 pt-4">Active Presence</h2>
                {renderChallengeCard(activeChallenge)}
            </>
        )}

        {availableChallenges.length > 0 && (
            <>
                 <h2 className="font-mono text-primary text-sm uppercase mt-8 border-t border-primary/20 pt-4">Available Presence Vectors</h2>
                {availableChallenges.map(renderChallengeCard)}
            </>
        )}
        
        {!isLoadingChallenges && !activeChallenge && availableChallenges.length === 0 && (
            <TerminalCard className="p-4 text-center text-muted-foreground">
                The stream is calm. No presence challenges detected. Explore to generate new ones.
            </TerminalCard>
        )}

        {completedChallenges.length > 0 && (
            <>
                <h2 className="font-mono text-muted-foreground text-sm uppercase mt-8 border-t border-primary/20 pt-4">Integration Log / Completed</h2>
                {completedChallenges.map(renderChallengeCard)}
            </>
        )}
      </div>

      <motion.div variants={itemVariants} className="mt-8">
        <Button onClick={() => exploreMutation.mutate()} disabled={exploreMutation.isPending} variant="outline" className="text-primary border-primary/50 w-full max-w-2xl mx-auto">
          {exploreMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Search className="w-4 h-4 mr-2"/>}
          EXPLORE MORE PRESENCE
        </Button>
      </motion.div>
    </motion.div>
  );
};
export default Presence;

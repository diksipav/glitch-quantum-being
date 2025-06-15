
import { useState } from "react";
import { motion } from "framer-motion";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, Eye, Loader2, Send } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Tables } from "@/integrations/supabase/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const MotionCard = motion(TerminalCard);

const fetchJournalEntries = async (userId: string) => {
  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const Journal = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [prompt] = useState(
    "Describe your current mental state as if it were a landscape on an alien planet."
  );

  const {
    data: entries,
    isLoading: isLoadingEntries,
  } = useQuery({
    queryKey: ["journalEntries", user?.id],
    queryFn: () => fetchJournalEntries(user!.id),
    enabled: !!user,
  });

  const { mutate: saveEntry, isPending: isSaving } = useMutation({
    mutationFn: async ({ content, prompt }: { content: string; prompt: string }) => {
      if (!user) throw new Error("You must be logged in to save an entry.");
      const { error } = await supabase.from("journal_entries").insert({
        user_id: user.id,
        content,
        prompt,
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Journal entry saved!");
      queryClient.invalidateQueries({ queryKey: ["journalEntries", user?.id] });
      setContent("");
    },
    onError: (error) => {
      toast.error(`Failed to save entry: ${error.message}`);
    },
  });

  const handleSave = () => {
    if (!content.trim()) {
      toast.info("Cannot save an empty entry.");
      return;
    }
    saveEntry({ content, prompt });
  };

  return (
    <motion.div
      className="max-w-2xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1
        variants={itemVariants}
        className="text-center font-display text-2xl md:text-4xl uppercase glitch"
        data-text="Creative Journal"
      >
        Creative Journal
      </motion.h1>

      <MotionCard variants={itemVariants} className="mt-8 p-4 text-left">
        <div className="flex justify-between items-center">
          <h3 className="font-bold uppercase tracking-widest text-muted-foreground text-sm">
            Today's Prompt
          </h3>
          <Button variant="ghost" size="sm" className="text-xs h-7">
            CHANGE <ChevronDown className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <p className="mt-2 text-foreground/90">"{prompt}"</p>
        <Textarea
          placeholder={user ? "BEGIN TRANSMISSION..." : "Log in to save your entry."}
          className="bg-terminal border-primary/20 focus-visible:ring-primary h-32 mt-4"
          disabled={!user || isSaving}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {user && (
          <div className="flex justify-center mt-4">
            <Button
              variant="ghost"
              className="uppercase text-primary tracking-widest"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Save Entry
            </Button>
          </div>
        )}
      </MotionCard>

      <MotionCard variants={itemVariants} className="mt-8 p-4 text-left">
        <div className="flex justify-between items-center">
          <h3 className="font-bold uppercase tracking-widest text-muted-foreground text-sm">
            Cosmic Tutor
          </h3>
          <div className="flex items-center text-xs text-green-400">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            ONLINE
          </div>
        </div>
        <p className="mt-3 text-sm text-foreground/80">
          <span className="text-primary">COSMIC_TUTOR:</span> Greetings,
          star-born scribe. I perceive you're grappling with today's prompt. Would
          you like to explore this mental landscape together?
        </p>
        <Button
          variant="ghost"
          className="w-full mt-4 text-primary text-xs justify-start p-2"
          asChild
        >
          <Link to="/cosmic-tutor">COMMUNE WITH THE COSMOS...</Link>
        </Button>
      </MotionCard>

      {user && (
        <motion.div className="mt-8 text-left" variants={containerVariants}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-xl uppercase tracking-widest">
              Past Entries
            </h2>
            <Button variant="link" asChild>
                <Link to="/journal-history">View All</Link>
            </Button>
          </div>
          {isLoadingEntries && (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          )}
          {!isLoadingEntries && entries && entries.length > 0 &&
            entries.map((entry: Tables<"journal_entries">) => (
              <MotionCard key={entry.id} variants={itemVariants} className="mb-4 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase">
                      {format(new Date(entry.created_at), "MMM dd, yyyy - HH:mm")}
                    </div>
                    {entry.prompt && <p className="mt-2 text-primary/80 text-sm italic">"{entry.prompt}"</p>}
                    <p className="mt-2 text-foreground/90 text-sm whitespace-pre-wrap">
                      {entry.content.length > 100 ? `${entry.content.substring(0, 100)}...` : entry.content}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" asChild>
                    <Link to="/journal-history"><Eye className="h-4 w-4" /></Link>
                  </Button>
                </div>
              </MotionCard>
            ))}
            {!isLoadingEntries && entries?.length === 0 && (
                <MotionCard variants={itemVariants} className="p-4 text-center text-muted-foreground">
                    No recent entries. Write one above to get started.
                </MotionCard>
            )}
        </motion.div>
      )}
    </motion.div>
  );
};
export default Journal;

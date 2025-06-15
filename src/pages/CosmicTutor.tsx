
import { useState, useRef, useEffect } from "react";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, User, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CosmicTutor = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("cosmic-tutor", {
        body: { messages: [...messages, userMessage] },
      });

      if (error) {
        throw error; // Throw the whole error object to be caught below
      }
      
      const assistantMessage: Message = { role: 'assistant', content: data.reply };
      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error: any) {
      // The supabase-js client wraps Edge Function errors.
      // The original error message from the function is often in `error.context`.
      const detailedMessage = error.context?.error || error.message;
      toast.error(`Error from the cosmos: ${detailedMessage}`);
      setMessages(prev => prev.slice(0, -1)); // Remove user message if API call fails
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-150px)] flex flex-col">
       <h1 className="font-display text-2xl uppercase tracking-widest glitch mb-4 text-center" data-text="Cosmic Tutor">
        Cosmic Tutor
      </h1>
      <TerminalCard className="flex-grow flex flex-col p-0">
        <div ref={scrollAreaRef} className="flex-grow overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
                {messages.map((message, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}
                    >
                        {message.role === 'assistant' && <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />}
                        <div className={`rounded-lg px-4 py-2 max-w-lg text-sm ${message.role === 'user' ? 'bg-primary/20' : 'bg-background'}`}>
                            <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                        {message.role === 'user' && <User className="w-6 h-6 text-primary flex-shrink-0 mt-1" />}
                    </motion.div>
                ))}
                 {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3"
                    >
                        <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1 animate-pulse" />
                        <div className="rounded-lg px-4 py-2 max-w-lg text-sm bg-background">
                            <Loader2 className="w-5 h-5 animate-spin" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
        <div className="p-4 border-t border-primary/20">
            <form onSubmit={handleSendMessage} className="flex gap-2">
            <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Commune with the cosmos..."
                className="bg-terminal border-primary/20 focus-visible:ring-primary flex-grow resize-none"
                rows={1}
                disabled={isLoading}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                    }
                }}
            />
            <Button type="submit" variant="ghost" size="icon" disabled={isLoading || !input.trim()}>
                <Send />
            </Button>
            </form>
        </div>
      </TerminalCard>
    </div>
  );
};

export default CosmicTutor;

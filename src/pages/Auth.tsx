import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { toast } from "sonner";
import { Chrome, Loader2, Apple } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type AuthMode = "signin" | "signup";

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    if (provider === 'apple') {
        toast.info("Apple login requires additional configuration with an Apple Developer account.");
        return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const { email, password } = values;

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Login successful. Welcome back, Traveler.");
        navigate("/");
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.info("Check your email for the confirmation link to complete your registration.");
      }
    }
    setLoading(false);
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center pt-8 md:pt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="font-display text-2xl uppercase tracking-widest glitch" data-text="AUTHENTICATION">
        AUTHENTICATION
      </h1>
      <p className="font-mono text-xs text-primary uppercase flex items-center mt-2">
        SYSTEM STATUS: WAITING FOR CREDENTIALS
        <span className="w-2 h-2 bg-primary inline-block ml-2 animate-blink"></span>
      </p>

      <TerminalCard className="w-full max-w-sm mt-8 p-6">
        <h2 className="text-center font-bold text-lg uppercase">
          {mode === 'signin' ? "Traveler Login" : "Join the Matrix"}
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono uppercase text-xs text-muted-foreground">User Email</FormLabel>
                  <FormControl>
                    <Input placeholder="traveler@domain.com" {...field} className="bg-terminal border-primary/20 focus-visible:ring-primary" disabled={loading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono uppercase text-xs text-muted-foreground">Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="******" {...field} className="bg-terminal border-primary/20 focus-visible:ring-primary" disabled={loading}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full uppercase font-bold tracking-wider" disabled={loading}>
              {loading && <Loader2 className="animate-spin mr-2" />}
              {loading ? "Processing..." : (mode === 'signin' ? 'Log In' : 'Sign Up')}
            </Button>
          </form>
        </Form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-muted-foreground/30" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-terminal px-2 text-muted-foreground font-mono">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => handleOAuthLogin('google')} disabled={loading}>
                <Chrome className="mr-2 h-4 w-4" /> Google
            </Button>
            <Button variant="outline" onClick={() => handleOAuthLogin('apple')} disabled={loading}>
                <Apple className="mr-2 h-4 w-4" /> Apple
            </Button>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {mode === 'signin' ? "Don't have an account?" : "Already a Traveler?"}{" "}
          <button
            onClick={() => {
              form.reset();
              setMode(mode === 'signin' ? 'signup' : 'signin')
            }}
            className="text-primary hover:underline font-bold"
            disabled={loading}
          >
            {mode === 'signin' ? 'Sign Up' : 'Sign In'}
          </button>
        </p>

      </TerminalCard>
    </motion.div>
  );
}

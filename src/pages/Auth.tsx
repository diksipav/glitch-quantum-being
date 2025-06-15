
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
import { Chrome, Loader2 } from "lucide-react";

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
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="mr-2" viewBox="0 0 16 16"><path d="M8.082 1.326a4.545 4.545 0 0 0-3.32.964A4.526 4.526 0 0 0 3.33 4.25c0 1.25.59 2.372 1.596 3.064a3.63 3.63 0 0 1-1.464 2.892.51.51 0 0 0-.158.558c.07.19.232.308.438.308.05 0 .1-.008.15-.024a3.812 3.812 0 0 0 1.248-.523c.532.42.99.73 1.596.73.614 0 1.082-.31 1.612-.73a3.79 3.79 0 0 0 1.24.523c.05.016.1.024.15.024.206 0 .368-.118.438-.308a.51.51 0 0 0-.158-.558 3.63 3.63 0 0 1-1.464-2.892C11.08 6.622 11.67 5.5 11.67 4.25a4.526 4.526 0 0 0-1.432-1.96 4.545 4.545 0 0 0-2.156-.964z"/><path d="M6.289 10.165a2.76 2.76 0 0 0 1.045 2.146 2.58 2.58 0 0 0 1.48.59c.008 0 .016 0 .023-.002.533-.024.965-.246 1.437-.62a.522.522 0 0 0 .19-.434.51.51 0 0 0-.54-.42c-.18.04-.37.06-.57.06-.48 0-.89-.213-1.28-.56a2.44 2.44 0 0 1-.95-1.55.51.51 0 0 0-.51-.41H6.7a.51.51 0 0 0-.41.51zM4.62 1.488a3.54 3.54 0 0 1 2.33-1.223 3.528 3.528 0 0 1 2.11.002c.11.023.19.12.19.232a.21.21 0 0 1-.22.21c-.8.016-1.52.28-2.07.67a3.528 3.528 0 0 0-1.92 1.524.21.21 0 0 1-.38-.115.21.21 0 0 1 .01-.102z"/></svg> Apple
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

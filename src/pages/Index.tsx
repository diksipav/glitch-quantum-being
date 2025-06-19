
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { RitualCircle } from "@/components/home/RitualCircle";
import { useAuth } from "@/hooks/use-auth";
import { useAppStore } from "@/lib/store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Zap, Calendar, Activity, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useEffect, useState } from "react";

type MeditationLog = Database['public']['Tables']['meditation_logs']['Row'];

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { energyLevels, focusPoints, getAverageEnergyLevel } = useAppStore();
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  // Fetch recent meditation logs
  const { data: recentMeditations = [] } = useQuery({
    queryKey: ['recent_meditations_home', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('meditation_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(2);

      if (error) return [];
      return data as MeditationLog[];
    },
    enabled: !!user,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const averageEnergy = getAverageEnergyLevel();

  const handleEnergyLevelClick = () => {
    if (!user) {
      toast.error("Please log in to access Energy Level calibration");
      return;
    }

    // Create particle animation
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    }));
    setParticles(newParticles);

    // Clear particles after animation
    setTimeout(() => setParticles([]), 2000);

    // Navigate after a short delay to let animation play
    setTimeout(() => navigate('/energy-level'), 500);
  };

  const handleOnboardingClick = () => {
    if (user) {
      toast.success("Welcome Program", {
        description: "Your consciousness matrix is synchronized."
      });
    } else {
      navigate('/auth');
    }
  };

  return (
    <motion.div 
      className="text-center relative overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Particle Animation */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-primary rounded-full pointer-events-none z-10"
          initial={{ 
            x: particle.x, 
            y: particle.y, 
            scale: 0,
            opacity: 0 
          }}
          animate={{ 
            x: window.innerWidth / 2, 
            y: window.innerHeight / 2, 
            scale: [0, 1, 0],
            opacity: [0, 1, 0] 
          }}
          transition={{ 
            duration: 2,
            ease: "easeInOut"
          }}
        />
      ))}

      <motion.h1 
        variants={itemVariants}
        className="font-display text-4xl md:text-6xl lg:text-8xl uppercase mb-4 glitch" 
        data-text="Cosmic Rituals"
      >
        Cosmic Rituals
      </motion.h1>
      
      <motion.p 
        variants={itemVariants}
        className="text-muted-foreground mb-8 max-w-2xl mx-auto"
      >
        Welcome to the liminal space between consciousness and void. Here, ancient wisdom meets quantum uncertainty.
      </motion.p>

      {user && (
        <motion.div variants={itemVariants} className="mb-8">
          <TerminalCard className="max-w-md mx-auto p-6 text-left">
            <h3 className="font-bold uppercase tracking-widest text-primary mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Energy Level:</span>
                <span className="font-mono text-primary">{averageEnergy}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Focus Points:</span>
                <span className="font-mono text-green-400">{focusPoints}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status:</span>
                <span className="font-mono text-primary">SYNCHRONIZED</span>
              </div>
            </div>
          </TerminalCard>
        </motion.div>
      )}

      <motion.div 
        variants={itemVariants}
        className="mb-8"
      >
        <RitualCircle />
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8"
      >
        <TerminalCard className="p-4 text-left">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="font-bold uppercase tracking-widest text-sm">Energy Level</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-3">
            Current: {averageEnergy}% synchronization
          </p>
          <Button
            onClick={handleEnergyLevelClick}
            variant="outline"
            size="sm"
            className="w-full text-primary border-primary/50"
            disabled={!user}
          >
            {user ? "Calibrate Energy" : "Login Required"}
          </Button>
        </TerminalCard>

        <TerminalCard className="p-4 text-left">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-bold uppercase tracking-widest text-sm">Daily Ritual</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-3">
            Connect with cosmic frequencies
          </p>
          <Button
            onClick={() => navigate('/ritual')}
            variant="outline"
            size="sm"
            className="w-full text-primary border-primary/50"
            disabled={!user}
          >
            {user ? "Begin Ritual" : "Login Required"}
          </Button>
        </TerminalCard>
      </motion.div>

      {/* Recent Activity Section */}
      {user && recentMeditations.length > 0 && (
        <motion.div variants={itemVariants} className="max-w-2xl mx-auto mb-8">
          <TerminalCard className="p-4 text-left">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="font-bold uppercase tracking-widest text-sm">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {recentMeditations.map((meditation) => (
                <div key={meditation.id} className="flex justify-between items-center py-2 border-b border-primary/10 last:border-b-0">
                  <div>
                    <p className="font-mono text-sm text-primary">{meditation.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {meditation.duration_minutes} min • {new Date(meditation.completed_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-xs text-green-400 font-mono">COMPLETED</div>
                </div>
              ))}
            </div>
          </TerminalCard>
        </motion.div>
      )}

      <motion.div 
        variants={itemVariants}
        className="space-y-4"
      >
        <Button 
          onClick={handleOnboardingClick}
          className={`w-64 ${user ? 'bg-green-500 hover:bg-green-600 animate-pulse text-white' : ''}`}
          variant={user ? "default" : "outline"}
        >
          {user ? "Boarding Complete :)" : "Initiate Onboarding"}
        </Button>
        
        {!user && (
          <p className="text-muted-foreground text-sm">
            Begin your journey into the quantum realm of consciousness
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Index;


import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { X, CheckCircle } from "lucide-react";
import { WaveAnimation } from "@/components/meditation/WaveAnimation";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const MeditationSession = () => {
  const { duration: urlDuration, title, description } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const duration = parseInt(urlDuration || "13");
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isCompleted) return;

    if (timeLeft <= 0) {
      setIsCompleted(true);
      handleComplete();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, isCompleted]);

  const handleComplete = async () => {
    if (!user || !title || !description) return;

    try {
      const { error } = await supabase.from('meditation_logs').insert({
        user_id: user.id,
        title: decodeURIComponent(title),
        description: decodeURIComponent(description),
        duration_minutes: duration,
      });

      if (error) throw error;
      toast.success("Meditation integrated into the cosmic consciousness.");
    } catch (error) {
      console.error('Error logging meditation:', error);
      toast.error("Failed to archive meditation in the void.");
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Animation */}
      <div className="fixed inset-0 z-0">
        <WaveAnimation />
      </div>

      {/* Cancel Button - Abstract and minimalist */}
      <motion.div 
        className="absolute top-6 right-6 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Button 
          onClick={handleCancel} 
          variant="ghost"
          size="icon"
          className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white/80 hover:text-white rounded-full w-12 h-12"
        >
          <X className="w-5 h-5" />
        </Button>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {!isCompleted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            {/* Meditation Title */}
            <motion.h1 
              className="font-display text-2xl md:text-3xl text-white/90 uppercase tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              {title ? decodeURIComponent(title) : "Quantum Meditation"}
            </motion.h1>

            {/* Countdown */}
            <motion.div 
              className="text-6xl md:text-8xl font-mono text-white font-light tracking-wider"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              {formatTime(timeLeft)}
            </motion.div>

            {/* Focus, Breath Text */}
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
            >
              <motion.p 
                className="text-xl md:text-2xl text-pink-300/80 font-light tracking-widest uppercase"
                animate={{ 
                  opacity: [0.6, 1, 0.6],
                  scale: [1, 1.02, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                Focus
              </motion.p>
              <motion.p 
                className="text-lg md:text-xl text-purple-300/70 font-light tracking-widest uppercase"
                animate={{ 
                  opacity: [0.7, 1, 0.7],
                  scale: [1, 1.01, 1]
                }}
                transition={{ 
                  duration: 3.5, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                Breathe
              </motion.p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-6"
          >
            <CheckCircle className="w-20 h-20 text-green-400 mx-auto" />
            <div>
              <p className="text-2xl text-green-400 font-bold uppercase tracking-wider">Session Complete</p>
              <p className="text-lg text-white/70 mt-2">Consciousness expanded. Reality updated.</p>
            </div>
            <Button 
              onClick={handleCancel} 
              variant="outline" 
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
            >
              Return to Meditations
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MeditationSession;


import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Abstract quantum meditation animation component
const QuantumMeditationAnimation = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Flowing quantum particles */}
      {Array.from({ length: 100 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0,
          }}
          animate={{
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
            ],
            y: [
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
              Math.random() * window.innerHeight,
            ],
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Flowing energy streams */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`stream-${i}`}
          className="absolute w-px h-32 bg-gradient-to-b from-transparent via-pink-400 to-transparent"
          style={{
            left: `${(i + 1) * 12}%`,
            top: "20%",
          }}
          animate={{
            scaleY: [0.5, 2, 0.5],
            opacity: [0.3, 0.8, 0.3],
            rotateZ: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Central quantum field */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,20,147,0.1) 0%, rgba(138,43,226,0.05) 50%, transparent 100%)",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Geometric patterns */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={`geo-${i}`}
          className="absolute border border-purple-400/20"
          style={{
            width: `${60 + i * 20}px`,
            height: `${60 + i * 20}px`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 15 + i * 2,
            repeat: Infinity,
            ease: "linear",
            delay: i * 0.8,
          }}
        />
      ))}
    </div>
  );
};

// Glitch text component for Focus/Breathe
const GlitchText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: Math.random() * 100 - 50 }}
      animate={{ 
        opacity: [0, 1, 1, 0],
        x: [Math.random() * 100 - 50, 0, 0, Math.random() * 100 - 50],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
      style={{
        position: "absolute",
        top: `${Math.random() * 60 + 20}%`,
        left: `${Math.random() * 60 + 20}%`,
      }}
    >
      <motion.p
        className={`text-lg md:text-xl font-light tracking-widest uppercase transition-all duration-200 ${
          isGlitching 
            ? "text-red-400 scale-110 blur-sm" 
            : text === "Focus" 
              ? "text-pink-300/80" 
              : "text-purple-300/70"
        }`}
        animate={isGlitching ? {
          x: [0, -2, 2, -1, 1, 0],
          textShadow: [
            "0 0 0px #ff0000",
            "2px 0 0px #ff0000, -2px 0 0px #00ffff",
            "0 0 0px #ff0000"
          ]
        } : {}}
        transition={{ duration: 0.2 }}
      >
        {text}
      </motion.p>
    </motion.div>
  );
};

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
      <QuantumMeditationAnimation />

      {/* Floating Focus/Breathe Text */}
      {!isCompleted && (
        <div className="fixed inset-0 pointer-events-none z-10">
          <GlitchText text="Focus" delay={0} />
          <GlitchText text="Breathe" delay={2} />
          <GlitchText text="Focus" delay={4} />
          <GlitchText text="Breathe" delay={6} />
        </div>
      )}

      {/* Cancel Button */}
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
          className="bg-slate-800/40 backdrop-blur-sm border border-pink-400/30 hover:bg-pink-500/20 text-pink-300 hover:text-pink-200 rounded-full w-12 h-12 transition-all duration-300"
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

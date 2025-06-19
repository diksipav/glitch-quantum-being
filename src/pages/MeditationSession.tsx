
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

const MeditationSession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { title, description, duration } = location.state || {
    title: "Mindful Presence",
    description: "Focus on your breath and be present in this moment.",
    duration: 5
  };

  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isActive, setIsActive] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isActive || timeLeft <= 0 || isCompleted) return;

    const interval = setInterval(() => {
      setTimeLeft(time => {
        if (time <= 1) {
          setIsCompleted(true);
          setIsActive(false);
          completeMeditation();
          return 0;
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft, isCompleted]);

  const completeMeditation = async () => {
    if (!user) return;
    
    try {
      await supabase.from('meditation_logs').insert({
        user_id: user.id,
        title,
        description,
        duration_minutes: duration
      });
      
      toast.success("Meditation completed! Your consciousness has expanded.");
    } catch (error) {
      console.error('Error logging meditation:', error);
    }
  };

  const handleCancel = () => {
    setIsActive(false);
    navigate('/meditation');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-terminal flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Spirals */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border-2 border-pink-500/20 rounded-full"
            style={{
              width: `${200 + i * 100}px`,
              height: `${200 + i * 100}px`,
              left: '50%',
              top: '50%',
              marginLeft: `${-(100 + i * 50)}px`,
              marginTop: `${-(100 + i * 50)}px`,
            }}
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 20 + i * 5, repeat: Infinity, ease: "linear" },
              scale: { duration: 3 + i, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        ))}
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-pink-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div 
        className="text-center z-10 max-w-md"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-2xl md:text-3xl uppercase mb-4 text-pink-400">
          {title}
        </h1>
        
        <p className="text-foreground/80 mb-8 text-sm">
          {description}
        </p>

        {/* Timer Circle */}
        <motion.div 
          className="relative w-48 h-48 mx-auto mb-8"
          animate={{ rotate: isCompleted ? 360 : 0 }}
          transition={{ duration: 1 }}
        >
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgba(236, 72, 153, 0.2)"
              strokeWidth="3"
              fill="none"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke="#ec4899"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (timeLeft / (duration * 60))}`}
              transition={{ duration: 0.5 }}
            />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-mono text-pink-400">
              {formatTime(timeLeft)}
            </span>
          </div>
        </motion.div>

        {isCompleted ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="space-y-4"
          >
            <h2 className="text-xl text-green-400 font-bold animate-pulse">
              Session Complete! ✨
            </h2>
            <Button 
              onClick={() => navigate('/meditation')}
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              Return to Meditations
            </Button>
          </motion.div>
        ) : (
          <Button 
            onClick={handleCancel}
            variant="outline" 
            className="text-pink-400 border-pink-400/50 hover:bg-pink-400/10"
          >
            Cancel Session
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default MeditationSession;

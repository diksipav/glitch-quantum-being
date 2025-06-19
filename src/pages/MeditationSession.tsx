
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { ArrowLeft, CheckCircle } from "lucide-react";
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
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isActive || isCompleted) return;

    if (timeLeft <= 0) {
      setIsCompleted(true);
      handleComplete();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [isActive, timeLeft, isCompleted]);

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
      toast.success("Meditation completed and logged into the cosmic void.");
    } catch (error) {
      console.error('Error logging meditation:', error);
      toast.error("Failed to log meditation to the cosmic records.");
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsActive(true);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Animation */}
      <div className="fixed inset-0 z-0">
        <WaveAnimation />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-md w-full text-center">
        <TerminalCard className="p-6 mb-6 bg-terminal/90 backdrop-blur-sm">
          <h1 className="font-display text-xl uppercase glitch mb-4" data-text={title ? decodeURIComponent(title) : "Meditation"}>
            {title ? decodeURIComponent(title) : "Meditation"}
          </h1>
          
          <p className="text-sm text-foreground/80 mb-6">
            {description ? decodeURIComponent(description) : "Focus on your breathing and let the cosmic waves guide you."}
          </p>

          <div className="mb-6">
            <div className="text-4xl font-mono mb-2">
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">
              {duration} minute session
            </div>
          </div>

          {!isActive && !isCompleted && (
            <Button onClick={handleStart} className="w-full mb-4">
              Begin Meditation
            </Button>
          )}

          {isCompleted && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-4"
            >
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
              <p className="text-green-400 font-bold">Session Complete</p>
              <p className="text-xs text-muted-foreground">Your consciousness has been expanded</p>
            </motion.div>
          )}

          <Button 
            onClick={handleCancel} 
            variant="outline" 
            size="sm"
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isCompleted ? "Return to Meditations" : "Cancel Session"}
          </Button>
        </TerminalCard>
      </div>
    </div>
  );
};

export default MeditationSession;

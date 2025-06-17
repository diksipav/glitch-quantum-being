
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { InteractiveEnergyCircles } from "@/components/energy/InteractiveEnergyCircles";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

const EnergyLevel = () => {
  const navigate = useNavigate();
  const { updateEnergyLevels } = useAppStore();
  const [energyLevels, setEnergyLevels] = useState({
    mental: 0,
    physical: 0,
    emotional: 0,
    intentional: 0,
  });

  const handleSave = () => {
    const average = Math.round((energyLevels.mental + energyLevels.physical + energyLevels.emotional + energyLevels.intentional) / 4);
    updateEnergyLevels(energyLevels);
    toast.success(`Energy levels saved! Average: ${average}%`);
    navigate('/');
  };

  return (
    <motion.div 
      className="text-center min-h-screen flex flex-col justify-center items-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="font-display text-2xl md:text-4xl uppercase tracking-widest mb-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Energy Calibration
      </motion.h1>
      
      <motion.p 
        className="text-muted-foreground mb-8 max-w-md text-sm md:text-base"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Set your energy levels by moving the sliders around each circle. Drag the dots or tap to adjust your energy in each dimension.
      </motion.p>

      <motion.div 
        className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs max-w-2xl mx-auto"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="text-center md:text-left">
          <span className="text-blue-400">●</span> <strong>Mental:</strong> Cognitive clarity, focus, and mental sharpness
        </div>
        <div className="text-center md:text-left">
          <span className="text-green-400">●</span> <strong>Physical:</strong> Body vitality, strength, and physical wellness
        </div>
        <div className="text-center md:text-left">
          <span className="text-purple-400">●</span> <strong>Emotional:</strong> Feeling balance, emotional stability, and mood
        </div>
        <div className="text-center md:text-left">
          <span className="text-yellow-400">●</span> <strong>Intentional:</strong> Sense of purpose, direction, and motivation
        </div>
      </motion.div>

      <InteractiveEnergyCircles 
        energyLevels={energyLevels}
        onEnergyChange={setEnergyLevels}
      />

      <motion.div 
        className="mt-8 space-y-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="grid grid-cols-2 gap-4 text-sm max-w-md mx-auto">
          <div className="text-left">
            <span className="text-blue-400">●</span> Mental: {energyLevels.mental}%
          </div>
          <div className="text-left">
            <span className="text-green-400">●</span> Physical: {energyLevels.physical}%
          </div>
          <div className="text-left">
            <span className="text-purple-400">●</span> Emotional: {energyLevels.emotional}%
          </div>
          <div className="text-left">
            <span className="text-yellow-400">●</span> Intentional: {energyLevels.intentional}%
          </div>
        </div>

        <Button 
          onClick={handleSave}
          className="w-48 mt-8"
          variant="outline"
        >
          SAVE ENERGY LEVELS
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default EnergyLevel;

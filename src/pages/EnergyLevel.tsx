
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { InteractiveEnergyCircles } from "@/components/energy/InteractiveEnergyCircles";

const EnergyLevel = () => {
  const navigate = useNavigate();
  const [energyLevels, setEnergyLevels] = useState({
    mental: 0,
    physical: 0,
    emotional: 0,
    intentional: 0,
  });

  const handleSave = () => {
    // Here you would save the energy levels to your store or database
    console.log("Energy levels:", energyLevels);
    navigate('/');
  };

  return (
    <motion.div 
      className="text-center min-h-screen flex flex-col justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="font-display text-2xl md:text-4xl uppercase tracking-widest mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Energy Calibration
      </motion.h1>
      
      <motion.p 
        className="text-muted-foreground mb-12 max-w-md"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Adjust your energy levels by dragging the dots around each circle. Move clockwise to increase energy.
      </motion.p>

      <InteractiveEnergyCircles 
        energyLevels={energyLevels}
        onEnergyChange={setEnergyLevels}
      />

      <motion.div 
        className="mt-12 space-y-4"
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

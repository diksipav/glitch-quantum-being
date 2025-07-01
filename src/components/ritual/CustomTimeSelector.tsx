
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Check, Clock } from 'lucide-react';

interface CustomTimeSelectorProps {
  onTimeSelect: (totalSeconds: number) => void;
  onCancel: () => void;
}

export const CustomTimeSelector = ({ onTimeSelect, onCancel }: CustomTimeSelectorProps) => {
  const [minutes, setMinutes] = useState([13]);
  const [seconds, setSeconds] = useState([0]);

  const formatTime = (mins: number, secs: number) => {
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleConfirm = () => {
    const totalSeconds = minutes[0] * 60 + seconds[0];
    if (totalSeconds > 0) {
      onTimeSelect(totalSeconds);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="p-6 space-y-6"
    >
      <div className="text-center">
        <Clock className="w-8 h-8 mx-auto text-primary mb-2" />
        <h3 className="font-bold uppercase tracking-widest text-muted-foreground text-sm">Custom Duration</h3>
      </div>

      {/* Clock Display */}
      <div className="text-center">
        <div className="text-4xl font-mono text-primary mb-4">
          {formatTime(minutes[0], seconds[0])}
        </div>
      </div>

      {/* Minutes Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Minutes</label>
          <span className="text-sm font-mono text-primary">{minutes[0]}m</span>
        </div>
        <Slider
          value={minutes}
          onValueChange={setMinutes}
          max={180}
          min={1}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1m</span>
          <span>180m</span>
        </div>
      </div>

      {/* Seconds Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Seconds</label>
          <span className="text-sm font-mono text-primary">{seconds[0]}s</span>
        </div>
        <Slider
          value={seconds}
          onValueChange={setSeconds}
          max={59}
          min={0}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0s</span>
          <span>59s</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button 
          onClick={handleConfirm} 
          className="flex-1"
          disabled={minutes[0] * 60 + seconds[0] <= 0}
        >
          <Check className="w-4 h-4 mr-2" />
          Confirm
        </Button>
      </div>
    </motion.div>
  );
};

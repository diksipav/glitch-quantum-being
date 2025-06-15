
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TerminalCard } from '@/components/ui/TerminalCard';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Sparkles, Wind, Activity, Flame, Dumbbell, Mountain, Flower2, Play, X, Waves, Rabbit, Footprints, Snowflake, PersonStanding } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const rituals = [
    { name: "Grounding Posture", icon: Sparkles },
    { name: "Breath Synchronization", icon: Wind },
    { name: "Spinal Waves", icon: Activity },
    { name: "Breath of Fire", icon: Flame },
    { name: "Calisthenics", icon: Dumbbell },
    { name: "Bouldering", icon: Mountain },
    { name: "Yoga", icon: Flower2 },
    { name: "Skating", icon: PersonStanding },
    { name: "Surf", icon: Waves },
    { name: "Animal Flow", icon: Rabbit },
    { name: "Running", icon: Footprints },
    { name: "Ice Bath", icon: Snowflake },
];

const timeOptions = [
    { label: "00:13", value: 13 },
    { label: "00:33", value: 33 },
    { label: "01:03", value: 63 },
];

interface RitualSelectionProps {
    onStart: (ritual: string, durationInSeconds: number) => void;
    onCancel: () => void;
}

export const RitualSelection = ({ onStart, onCancel }: RitualSelectionProps) => {
    const [selectedRitual, setSelectedRitual] = useState<string | null>(null);
    const [selectedTimeOption, setSelectedTimeOption] = useState<number | 'custom' | null>(null);
    const [customMinutes, setCustomMinutes] = useState('');
    const [customSeconds, setCustomSeconds] = useState('');

    const handleStart = () => {
        if (selectedRitual) {
            if (typeof selectedTimeOption === 'number') {
                onStart(selectedRitual, selectedTimeOption);
            } else if (selectedTimeOption === 'custom') {
                const minutes = parseInt(customMinutes, 10) || 0;
                const seconds = parseInt(customSeconds, 10) || 0;
                const totalSeconds = minutes * 60 + seconds;
                if (totalSeconds > 0) {
                    onStart(selectedRitual, totalSeconds);
                }
            }
        }
    };

    const isStartDisabled = !selectedRitual || selectedTimeOption === null || (selectedTimeOption === 'custom' && ((parseInt(customMinutes, 10) || 0) * 60 + (parseInt(customSeconds, 10) || 0)) <= 0);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-8">
            <TerminalCard className="p-4 text-left">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold uppercase tracking-widest text-muted-foreground text-sm">Choose Your Ritual</h3>
                  <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 h-8 w-8" onClick={onCancel}>
                      <X className="h-4 w-4" />
                  </Button>
                </div>
                <RadioGroup value={selectedRitual || ""} onValueChange={setSelectedRitual}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {rituals.map((ritual) => (
                            <Label key={ritual.name} htmlFor={ritual.name} className="cursor-pointer">
                                <TerminalCard className={cn('p-4 flex flex-col items-center justify-center aspect-square text-center', selectedRitual === ritual.name ? 'border-primary bg-primary/10' : 'border-border')}>
                                    <RadioGroupItem value={ritual.name} id={ritual.name} className="sr-only" />
                                    <ritual.icon className={cn('w-8 h-8 mx-auto', selectedRitual === ritual.name ? 'text-primary' : 'text-muted-foreground')} />
                                    <span className="text-xs uppercase mt-3 tracking-wider block">{ritual.name}</span>
                                </TerminalCard>
                            </Label>
                        ))}
                    </div>
                </RadioGroup>
                <div className="flex justify-end mt-4">
                    <Button variant="ghost" className="text-destructive hover:bg-transparent hover:text-destructive/80" size="sm" onClick={onCancel}>
                        <X className="mr-2 h-4 w-4" /> Close
                    </Button>
                </div>
            </TerminalCard>

            <TerminalCard className="p-4 text-left">
                <h3 className="font-bold uppercase tracking-widest text-muted-foreground mb-4 text-sm">Set Duration (mm:ss)</h3>
                 <RadioGroup value={selectedTimeOption?.toString() || ""} onValueChange={(val) => setSelectedTimeOption(val === 'custom' ? 'custom' : Number(val))} className="flex justify-center flex-wrap gap-4">
                    {timeOptions.map((option) => (
                         <Label key={option.value} htmlFor={option.label} className={cn("flex items-center border-2 rounded-md p-3 cursor-pointer", selectedTimeOption === option.value ? 'border-primary bg-primary/10' : 'border-border')}>
                            <RadioGroupItem value={option.value.toString()} id={option.label} />
                            <span className="ml-3 font-mono text-lg">{option.label}</span>
                        </Label>
                    ))}
                    <Label htmlFor="custom" className={cn("flex items-center border-2 rounded-md p-3 cursor-pointer", selectedTimeOption === 'custom' ? 'border-primary bg-primary/10' : 'border-border')}>
                        <RadioGroupItem value="custom" id="custom" />
                        <span className="ml-3 font-mono text-lg">Custom</span>
                    </Label>
                </RadioGroup>
                {selectedTimeOption === 'custom' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 flex items-center justify-center gap-2">
                        <Input 
                            type="number" 
                            placeholder="MM" 
                            className="w-20 text-center font-mono" 
                            value={customMinutes}
                            onChange={(e) => setCustomMinutes(e.target.value)}
                            min="0"
                        />
                        <span className="font-mono text-lg">:</span>
                        <Input 
                            type="number" 
                            placeholder="SS" 
                            className="w-20 text-center font-mono" 
                            value={customSeconds}
                            onChange={(e) => setCustomSeconds(e.target.value)}
                            min="0"
                            max="59"
                        />
                    </motion.div>
                )}
            </TerminalCard>

            <Button onClick={handleStart} disabled={isStartDisabled} className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Start Ritual
            </Button>
        </motion.div>
    );
};

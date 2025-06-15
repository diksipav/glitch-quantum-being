
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TerminalCard } from '@/components/ui/TerminalCard';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Sparkles, Wind, Activity, Flame, Dumbbell, Mountain, Flower2, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

const rituals = [
    { name: "Grounding Posture", icon: Sparkles },
    { name: "Breath Synchronization", icon: Wind },
    { name: "Spinal Waves", icon: Activity },
    { name: "Breath of Fire", icon: Flame },
    { name: "Calisthenics", icon: Dumbbell },
    { name: "Bouldering", icon: Mountain },
    { name: "Yoga", icon: Flower2 },
];

const timeOptions = [
    { label: "13:00", value: 13 },
    { label: "33:00", value: 33 },
    { label: "01:03:00", value: 63 },
];

interface RitualSelectionProps {
    onStart: (ritual: string, durationInMinutes: number) => void;
}

export const RitualSelection = ({ onStart }: RitualSelectionProps) => {
    const [selectedRitual, setSelectedRitual] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<number | null>(null);

    const handleStart = () => {
        if (selectedRitual && selectedTime) {
            onStart(selectedRitual, selectedTime);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-8">
            <TerminalCard className="p-4 text-left">
                <h3 className="font-bold uppercase tracking-widest text-muted-foreground mb-4 text-sm">Choose Your Ritual</h3>
                <RadioGroup value={selectedRitual || ""} onValueChange={setSelectedRitual}>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
            </TerminalCard>

            <TerminalCard className="p-4 text-left">
                <h3 className="font-bold uppercase tracking-widest text-muted-foreground mb-4 text-sm">Set Duration</h3>
                 <RadioGroup value={selectedTime?.toString() || ""} onValueChange={(val) => setSelectedTime(Number(val))} className="flex justify-center gap-4">
                    {timeOptions.map((option) => (
                         <Label key={option.value} htmlFor={option.label} className={cn("flex items-center border-2 rounded-md p-3 cursor-pointer", selectedTime === option.value ? 'border-primary bg-primary/10' : 'border-border')}>
                            <RadioGroupItem value={option.value.toString()} id={option.label} />
                            <span className="ml-3 font-mono text-lg">{option.label}</span>
                        </Label>
                    ))}
                </RadioGroup>
            </TerminalCard>

            <Button onClick={handleStart} disabled={!selectedRitual || !selectedTime} className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Start Ritual
            </Button>
        </motion.div>
    );
};

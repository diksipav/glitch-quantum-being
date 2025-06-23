
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TerminalCard } from '@/components/ui/TerminalCard';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wind, Activity, Flame, Dumbbell, Mountain, Flower2, Play, X, Waves, Rabbit, Footprints, Snowflake, PersonStanding, ArrowRight } from 'lucide-react';
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
    { label: "13 MIN", value: 13 * 60 },
    { label: "33 MIN", value: 33 * 60 },
    { label: "63 MIN", value: 63 * 60 },
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
    const [step, setStep] = useState<'ritual' | 'time' | 'ready'>('ritual');

    const handleRitualSelect = (ritual: string) => {
        setSelectedRitual(ritual);
        setTimeout(() => setStep('time'), 500);
    };

    const handleTimeSelect = (timeOption: number | 'custom') => {
        setSelectedTimeOption(timeOption);
        setTimeout(() => setStep('ready'), 500);
    };

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

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-8">
            <AnimatePresence mode="wait">
                {step === 'ritual' && (
                    <motion.div
                        key="ritual"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <TerminalCard className="p-4 text-left">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold uppercase tracking-widest text-muted-foreground text-sm">Choose Your Ritual</h3>
                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 h-8 w-8" onClick={onCancel}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {rituals.map((ritual) => (
                                    <motion.button
                                        key={ritual.name}
                                        onClick={() => handleRitualSelect(ritual.name)}
                                        className="cursor-pointer"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <TerminalCard className="p-4 flex flex-col items-center justify-center aspect-square text-center border-border hover:border-primary hover:bg-primary/10 transition-all">
                                            <ritual.icon className="w-8 h-8 mx-auto text-muted-foreground" />
                                            <span className="text-xs uppercase mt-3 tracking-wider block">{ritual.name}</span>
                                        </TerminalCard>
                                    </motion.button>
                                ))}
                            </div>
                        </TerminalCard>
                    </motion.div>
                )}

                {step === 'time' && (
                    <motion.div
                        key="time"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <TerminalCard className="p-4 text-left">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold uppercase tracking-widest text-muted-foreground text-sm">Set Duration</h3>
                                <div className="text-xs text-primary">{selectedRitual}</div>
                            </div>
                            <RadioGroup value={selectedTimeOption?.toString() || ""} onValueChange={(val) => handleTimeSelect(val === 'custom' ? 'custom' : Number(val))} className="flex justify-center flex-wrap gap-4">
                                {timeOptions.map((option) => (
                                    <motion.button
                                        key={option.value}
                                        onClick={() => handleTimeSelect(option.value)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Label htmlFor={option.label} className="flex items-center border-2 rounded-md p-3 cursor-pointer border-border hover:border-primary hover:bg-primary/10 transition-all">
                                            <RadioGroupItem value={option.value.toString()} id={option.label} />
                                            <span className="ml-3 font-mono text-lg">{option.label}</span>
                                        </Label>
                                    </motion.button>
                                ))}
                                <motion.button
                                    onClick={() => handleTimeSelect('custom')}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Label htmlFor="custom" className="flex items-center border-2 rounded-md p-3 cursor-pointer border-border hover:border-primary hover:bg-primary/10 transition-all">
                                        <RadioGroupItem value="custom" id="custom" />
                                        <span className="ml-3 font-mono text-lg">Custom</span>
                                    </Label>
                                </motion.button>
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
                    </motion.div>
                )}

                {step === 'ready' && (
                    <motion.div
                        key="ready"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                    >
                        <TerminalCard className="p-8 text-center">
                            <motion.div
                                animate={{ 
                                    filter: 'drop-shadow(0 0 0.75rem hsl(var(--primary) / 0.6))',
                                    scale: [1, 1.05, 1]
                                }}
                                transition={{ 
                                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                                    filter: { duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }
                                }}
                                className="mb-6"
                            >
                                <div className="w-24 h-24 mx-auto border-2 border-primary rounded-full flex items-center justify-center bg-primary/10">
                                    <Play className="w-12 h-12 text-primary" />
                                </div>
                            </motion.div>
                            <h3 className="font-bold uppercase tracking-widest text-primary mb-2">{selectedRitual}</h3>
                            <p className="text-muted-foreground mb-2">
                                {typeof selectedTimeOption === 'number' 
                                    ? formatTime(selectedTimeOption)
                                    : `${customMinutes}:${customSeconds.padStart(2, '0')}`
                                }
                            </p>
                            <motion.p 
                                className="text-sm text-muted-foreground mb-6"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                Ready to begin your ritual journey
                            </motion.p>
                            <Button onClick={handleStart} disabled={isStartDisabled} className="w-full">
                                <ArrowRight className="w-4 h-4 mr-2" />
                                Start Ritual
                            </Button>
                        </TerminalCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

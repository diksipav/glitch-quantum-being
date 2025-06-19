
import { useState } from "react";
import { Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChallengeInfoTooltipProps {
  title: string;
  description: string;
}

const challengeBenefits: Record<string, string> = {
  "SENSORY AWARENESS": "Enhances mindfulness, sharpens focus, and connects you deeply with your present environment through heightened sensory perception.",
  "TEMPORAL ANCHOR": "Develops present-moment awareness, reduces anxiety about future/past, and creates mental stability through regular grounding practices.",
  "PERIPHERAL EXPANSION": "Improves spatial awareness, reduces tunnel vision thinking, and enhances your ability to notice subtle changes in your environment.",
  "ACTIVE LISTENING": "Deepens empathy, improves relationships, and cultivates patience while reducing reactive communication patterns.",
  "MINDFUL TOUCH": "Grounds you in physical reality, reduces dissociation, and enhances your connection to the material world through tactile awareness.",
};

export const ChallengeInfoTooltip = ({ title, description }: ChallengeInfoTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const benefits = challengeBenefits[title.toUpperCase()] || "This practice helps cultivate present-moment awareness and enhances your connection to the here and now.";

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="text-muted-foreground hover:text-primary transition-colors"
      >
        <Info className="w-4 h-4" />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40 bg-black/20" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Tooltip positioned relative to the card area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              className="absolute bottom-full left-0 mb-2 w-72 max-w-[90vw] p-4 bg-terminal border border-primary/20 rounded-lg shadow-lg z-50"
            >
              <div className="space-y-2">
                <h4 className="font-bold text-primary text-sm uppercase">{title} Benefits</h4>
                <p className="text-xs text-foreground/90 leading-relaxed">{benefits}</p>
              </div>
              
              {/* Arrow pointing down */}
              <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary/20" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

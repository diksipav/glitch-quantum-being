
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
  "BREATH OBSERVATION": "Regulates nervous system, improves emotional stability, and creates a foundation for deeper meditative states through conscious breathing.",
  "SOUND MAPPING": "Develops acute auditory awareness, reduces mental noise, and cultivates present-moment attention through sound exploration.",
  "MICRO-MOVEMENT": "Increases body awareness, improves coordination, and builds connection between conscious intention and physical expression.",
};

const generateBenefitInfo = (title: string, description: string) => {
  const exactMatch = challengeBenefits[title.toUpperCase()];
  if (exactMatch) return exactMatch;
  
  // Generate contextual benefits based on keywords
  const lowerDesc = description.toLowerCase();
  const lowerTitle = title.toLowerCase();
  
  if (lowerDesc.includes('sound') || lowerDesc.includes('listen') || lowerDesc.includes('hear')) {
    return "Develops auditory mindfulness, improves focus through sound awareness, and creates deeper connection to your acoustic environment.";
  }
  
  if (lowerDesc.includes('breath') || lowerDesc.includes('breathing')) {
    return "Regulates nervous system, calms the mind, and builds a foundation for present-moment awareness through conscious breathing practices.";
  }
  
  if (lowerDesc.includes('touch') || lowerDesc.includes('feel') || lowerDesc.includes('texture')) {
    return "Grounds consciousness in physical sensation, reduces dissociation, and enhances your connection to the material present moment.";
  }
  
  if (lowerDesc.includes('observe') || lowerDesc.includes('watch') || lowerDesc.includes('see')) {
    return "Sharpens visual awareness, reduces mental distractions, and cultivates non-judgmental observation skills for enhanced mindfulness.";
  }
  
  if (lowerDesc.includes('time') || lowerDesc.includes('moment') || lowerTitle.includes('temporal')) {
    return "Develops temporal awareness, reduces anxiety about past/future, and anchors consciousness firmly in the present moment.";
  }
  
  // Default fallback
  return "This practice helps cultivate present-moment awareness, enhances mindfulness, and strengthens your connection to the here and now through focused attention.";
};

export const ChallengeInfoTooltip = ({ title, description }: ChallengeInfoTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const benefits = generateBenefitInfo(title, description);

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
            
            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="absolute bottom-full right-0 mb-2 w-80 max-w-[90vw] p-4 bg-terminal border border-primary/20 rounded-lg shadow-lg z-50"
            >
              <div className="space-y-2">
                <h4 className="font-bold text-primary text-sm uppercase">{title} Benefits</h4>
                <p className="text-xs text-foreground/90 leading-relaxed">{benefits}</p>
              </div>
              
              {/* Arrow */}
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary/20" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

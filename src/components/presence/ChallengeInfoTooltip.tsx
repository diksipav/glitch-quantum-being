
import { useState } from "react";
import { Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChallengeInfoTooltipProps {
  title: string;
  description: string;
  generatedInfo?: string;
}

const generateContextualInfo = (title: string, description: string) => {
  const lowerDesc = description.toLowerCase();
  const lowerTitle = title.toLowerCase();
  
  if (lowerDesc.includes('sound') || lowerDesc.includes('listen') || lowerDesc.includes('hear')) {
    return "Enhances auditory awareness and creates deeper present-moment anchoring through acoustic mindfulness. Develops ability to distinguish subtle sound layers and reduces mental noise.";
  }
  
  if (lowerDesc.includes('breath') || lowerDesc.includes('breathing')) {
    return "Regulates nervous system and establishes rhythmic presence. Serves as a bridge between voluntary and involuntary awareness, promoting calm and centeredness.";
  }
  
  if (lowerDesc.includes('touch') || lowerDesc.includes('feel') || lowerDesc.includes('texture')) {
    return "Grounds consciousness in physical reality and reduces mental dissociation. Creates tangible connection to the present moment through tactile awareness.";
  }
  
  if (lowerDesc.includes('observe') || lowerDesc.includes('watch') || lowerDesc.includes('see')) {
    return "Develops non-judgmental observation skills and trains attention to witness without automatically categorizing. Enhances visual mindfulness and peripheral awareness.";
  }
  
  if (lowerDesc.includes('time') || lowerDesc.includes('moment') || lowerTitle.includes('temporal')) {
    return "Dissolves past/future fixation and anchors consciousness in the present. Develops temporal awareness and helps break automatic thought patterns.";
  }

  if (lowerDesc.includes('movement') || lowerDesc.includes('body') || lowerDesc.includes('physical')) {
    return "Integrates mind-body connection and uses physical sensation as a gateway to consciousness. Develops embodied awareness and somatic intelligence.";
  }

  if (lowerDesc.includes('space') || lowerDesc.includes('room') || lowerDesc.includes('environment')) {
    return "Expands peripheral consciousness beyond tunnel vision and cultivates 360-degree present-moment attention. Enhances spatial intelligence and environmental awareness.";
  }
  
  return "Cultivates heightened awareness by challenging habitual attention patterns. Creates new neural pathways for present-moment consciousness and enhances mindful observation.";
};

export const ChallengeInfoTooltip = ({ title, description, generatedInfo }: ChallengeInfoTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const benefits = generatedInfo || generateContextualInfo(title, description);

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
            
            {/* Tooltip - Mobile optimized */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-72 max-w-[90vw] p-4 bg-terminal border border-primary/20 rounded-lg shadow-lg z-50 md:left-0 md:right-auto md:transform-none md:w-80"
            >
              <div className="space-y-2">
                <h4 className="font-bold text-primary text-sm uppercase">{title} • Potential Benefits</h4>
                <p className="text-xs text-foreground/90 leading-relaxed">{benefits}</p>
              </div>
              
              {/* Arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary/20 md:left-6 md:transform-none" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

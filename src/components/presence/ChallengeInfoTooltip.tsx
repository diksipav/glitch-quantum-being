
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
    return "This auditory awareness practice enhances your ability to distinguish subtle sound layers, creating deeper present-moment anchoring through acoustic mindfulness.";
  }
  
  if (lowerDesc.includes('breath') || lowerDesc.includes('breathing')) {
    return "Conscious breathing serves as a bridge between voluntary and involuntary awareness, regulating your nervous system while establishing rhythmic presence.";
  }
  
  if (lowerDesc.includes('touch') || lowerDesc.includes('feel') || lowerDesc.includes('texture')) {
    return "Tactile awareness grounds consciousness in physical reality, reducing mental dissociation and creating tangible connection to the present moment.";
  }
  
  if (lowerDesc.includes('observe') || lowerDesc.includes('watch') || lowerDesc.includes('see')) {
    return "Visual mindfulness develops non-judgmental observation skills, training your attention to witness without automatically categorizing or analyzing.";
  }
  
  if (lowerDesc.includes('time') || lowerDesc.includes('moment') || lowerTitle.includes('temporal')) {
    return "Temporal awareness practices dissolve the illusion of past/future fixation, anchoring consciousness firmly in the only moment that truly exists.";
  }

  if (lowerDesc.includes('movement') || lowerDesc.includes('body') || lowerDesc.includes('physical')) {
    return "Embodied awareness integrates mind-body connection, using physical sensation as a gateway to present-moment consciousness.";
  }

  if (lowerDesc.includes('space') || lowerDesc.includes('room') || lowerDesc.includes('environment')) {
    return "Spatial awareness expands peripheral consciousness beyond tunnel vision, cultivating 360-degree present-moment attention.";
  }
  
  // Default contextual response
  return "This practice cultivates heightened awareness by challenging habitual patterns of attention, creating new neural pathways for present-moment consciousness.";
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
            
            {/* Tooltip */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="absolute bottom-full right-0 mb-2 w-80 max-w-[90vw] p-4 bg-terminal border border-primary/20 rounded-lg shadow-lg z-50"
            >
              <div className="space-y-2">
                <h4 className="font-bold text-primary text-sm uppercase">{title} • Benefits</h4>
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


import { motion } from "framer-motion";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, Eye } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const MotionCard = motion(TerminalCard);

const pastEntries = [
    {
        date: "27.05.3023",
        text: "My mind today is a desert of shifting silica dunes, each thought particle catching the twin suns' glare..."
    },
    {
        date: "26.05.3023",
        text: "A dense fungal forest where bioluminescent spores drift upward in lazy spirals. Each..."
    }
];

const Journal = () => {
  const { user } = useAuth();
  return (
  <motion.div
    className="max-w-2xl mx-auto"
    initial="hidden"
    animate="visible"
    variants={containerVariants}
  >
    <motion.h1 variants={itemVariants} className="text-center font-display text-2xl md:text-4xl uppercase glitch" data-text="Creative Journal">
      Creative Journal
    </motion.h1>
    
    <MotionCard variants={itemVariants} className="mt-8 p-4 text-left">
      <div className="flex justify-between items-center">
        <h3 className="font-bold uppercase tracking-widest text-muted-foreground text-sm">Today's Prompt</h3>
        <Button variant="ghost" size="sm" className="text-xs h-7">CHANGE <ChevronDown className="w-4 h-4 ml-1"/></Button>
      </div>
      <p className="mt-2 text-foreground/90">"Describe your current mental state as if it were a landscape on an alien planet."</p>
      <Textarea 
        placeholder={user ? "BEGIN TRANSMISSION..." : "Log in to save your entry."} 
        className="bg-terminal border-primary/20 focus-visible:ring-primary h-32 mt-4"
        disabled={!user}
      />
      {user && (
        <div className="flex justify-center mt-4">
          <Button variant="ghost" className="uppercase text-primary tracking-widest">
            Save Entry
          </Button>
        </div>
      )}
    </MotionCard>

    <MotionCard variants={itemVariants} className="mt-8 p-4 text-left">
      <div className="flex justify-between items-center">
          <h3 className="font-bold uppercase tracking-widest text-muted-foreground text-sm">Cosmic Tutor</h3>
          <div className="flex items-center text-xs text-green-400">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            ONLINE
          </div>
      </div>
      <p className="mt-3 text-sm text-foreground/80"><span className="text-primary">COSMIC_TUTOR:</span> Greetings, star-born scribe. I perceive you're grappling with today's prompt. Would you like to explore this mental landscape together?</p>
      <Button variant="ghost" className="w-full mt-4 text-primary text-xs justify-start p-2">
        COMMUNE WITH THE COSMOS...
      </Button>
    </MotionCard>

    {user && (
      <motion.div className="mt-8 text-left" variants={containerVariants}>
        <h2 className="font-display text-xl uppercase tracking-widest mb-4">Past Entries</h2>
        {pastEntries.map((entry, index) => (
            <MotionCard key={index} variants={itemVariants} className="mb-4 p-4">
              <div className="flex justify-between items-start">
                  <div>
                      <div className="text-xs text-muted-foreground uppercase">{entry.date}</div>
                      <p className="mt-2 text-foreground/90 text-sm">"{entry.text}"</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                      <Eye className="h-4 w-4" />
                  </Button>
              </div>
            </MotionCard>
        ))}
      </motion.div>
    )}
  </motion.div>
  )
};
export default Journal;

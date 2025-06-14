import { motion } from "framer-motion";
import { TerminalCard } from "@/components/ui/TerminalCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, Video } from "lucide-react";

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
const MotionButton = motion(Button);

const filterOptions = ["All", "Rituals", "Revelations", "Glitches", "Artifacts"];

const posts = [
  {
    initials: "QN",
    username: "@QUANTUM_NOMAD",
    time: "2H AGO",
    text: "Today I realized my morning coffee ritual is actually a spacetime anchoring ceremony. The steam curls are timelines converging.",
    likes: 12,
    comments: 3,
  },
  {
    initials: "DW",
    username: "@DUST_WHISPERER",
    time: "17M AGO",
    text: "Found a crack in reality while staring at bathroom tiles for 17 minutes. Will investigate further. Anyone else experience this?",
    likes: 7,
    comments: 4,
  },
  {
    initials: "VS",
    username: "@VOID_SURFER",
    time: "6H AGO",
    text: "The challenge to notice textures made me realize my desk has the same pattern as Martian rock formations. Coincidence? I think not.",
    likes: 23,
    comments: 5,
  },
  {
    initials: "NH",
    username: "@NOISE_HACKER",
    time: "1D AGO",
    text: "Created a meditation that uses the sound of dial-up internet to achieve gnosis. Anyone want to beta test?",
    likes: 42,
    comments: 12,
  },
];

const skills = [
  { name: "Focus", level: 80 },
  { name: "Clarity", level: 65 },
  { name: "Presence", level: 90 },
  { name: "Resilience", level: 75 },
  { name: "Self-awareness", level: 50 },
]

const Matrix = () => (
  <motion.div
    className="pt-8 md:pt-16 max-w-2xl mx-auto"
    initial="hidden"
    animate="visible"
    variants={containerVariants}
  >
    <motion.h1 variants={itemVariants} className="text-center font-display text-2xl md:text-4xl uppercase glitch" data-text="BREAK_THE_MATRIX">
      BREAK_THE_MATRIX
    </motion.h1>
    
    <motion.div variants={itemVariants} className="flex justify-center items-center gap-2 mt-4 flex-wrap">
        {filterOptions.map((filter, i) => (
            <Button key={filter} variant={i === 0 ? "outline" : "ghost"} size="sm" className={`uppercase text-xs tracking-widest ${i === 0 ? 'text-primary border-primary' : 'text-muted-foreground'}`}>
                {filter}
            </Button>
        ))}
    </motion.div>

    <motion.div className="space-y-4 mt-8" variants={containerVariants}>
        {posts.map((post, index) => (
            <MotionCard key={index} variants={itemVariants} className="p-4 text-left font-mono">
                <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center text-primary font-bold text-xs">
                        {post.initials}
                    </div>
                    <div className="flex-grow">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="text-primary font-bold">{post.username}</span>
                            <span>{post.time}</span>
                        </div>
                        <p className="text-foreground/90 mt-2 text-sm">{post.text}</p>
                         <div className="flex gap-4 text-xs mt-3 text-muted-foreground">
                            <span>{post.likes} LIKES</span>
                            <span>{post.comments} COMMENTS</span>
                        </div>
                    </div>
                </div>
            </MotionCard>
        ))}
    </motion.div>

    <MotionCard variants={itemVariants} className="mt-8 p-4 text-left">
        <h3 className="font-bold uppercase tracking-widest text-muted-foreground text-sm">Create Post</h3>
        <Textarea placeholder="SHARE YOUR GLITCH..." className="bg-terminal border-primary/20 focus-visible:ring-primary h-24 mt-4"/>
        <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2 text-muted-foreground">
                <Button variant="ghost" size="icon" className="w-8 h-8"><Image className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="w-8 h-8"><Video className="w-4 h-4" /></Button>
            </div>
            <Button variant="ghost" className="uppercase text-primary tracking-widest">Post</Button>
        </div>
    </MotionCard>
  </motion.div>
);
export default Matrix;

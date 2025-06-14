
import { NavLink } from "react-router-dom";
import { Home, Sparkles, CircleCheck, Zap, BookOpenText, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/meditation", icon: Sparkles, label: "MDTIN" },
  { to: "/challenge", icon: CircleCheck, label: "CHLLNG" },
  { to: "/ritual", icon: Zap, label: "Ritual" },
  { to: "/journal", icon: BookOpenText, label: "Journal" },
  { to: "/matrix", icon: Users, label: "Matrix" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-terminal/80 backdrop-blur-lg border-t border-border z-50 md:hidden">
      <div className="flex justify-around items-center h-full">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center text-muted-foreground transition-colors duration-300 w-full h-full",
                isActive && "text-primary"
              )
            }
          >
            <item.icon className="h-6 w-6 mb-1" />
            <span className="text-xs font-mono uppercase">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

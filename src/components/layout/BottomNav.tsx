
import { NavLink } from "react-router-dom";
import { Home, Sparkles, CircleCheck, Zap, BookOpenText, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/meditation", icon: Sparkles, label: "Meditation" },
  { to: "/challenge", icon: CircleCheck, label: "Challenge" },
  { to: "/ritual", icon: Zap, label: "Ritual" },
  { to: "/journal", icon: BookOpenText, label: "Journal" },
  { to: "/matrix", icon: Users, label: "Matrix" },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-terminal/80 backdrop-blur-lg border-t border-border z-50 md:hidden">
      <div className="overflow-x-auto h-full">
        <div className="flex items-center h-full min-w-max px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center text-muted-foreground transition-colors duration-300 w-24 h-full flex-shrink-0",
                  isActive && "text-primary"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn("h-6 w-6 mb-1 transition-all", isActive && "scale-110 drop-shadow-[0_0_8px_hsl(var(--primary))]")} />
                  <span
                    className={cn(
                      "text-[11px] font-mono uppercase transition-all",
                      isActive && "drop-shadow-[0_0_4px_hsl(var(--primary))]"
                    )}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

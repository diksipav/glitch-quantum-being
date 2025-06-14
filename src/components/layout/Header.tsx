
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/medit", label: "Medit" },
  { to: "/challenge", label: "Challenge" },
  { to: "/ritual", label: "Ritual" },
  { to: "/journal", label: "Journal" },
  { to: "/matrix", label: "Matrix" },
];

export function Header() {
  return (
    <header className="hidden md:flex items-center justify-between p-4 fixed top-0 left-0 right-0 z-50 bg-background/50 backdrop-blur-md">
      <div className="font-display text-2xl uppercase glitch" data-text="BUGGED_BEING">
        BUGGED_BEING
      </div>
      <nav className="flex items-center space-x-6 font-mono text-sm uppercase">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "relative text-muted-foreground transition-colors hover:text-primary",
                "after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-[-4px] after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left",
                isActive && "text-primary after:scale-x-100"
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
       <div className="font-mono text-xs text-primary uppercase flex items-center">
         RITUAL_SEQUENCE_READY
         <span className="w-2 h-2 bg-primary inline-block ml-2 animate-blink"></span>
       </div>
    </header>
  );
}

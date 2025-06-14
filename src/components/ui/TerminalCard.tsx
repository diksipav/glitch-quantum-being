
import { cn } from "@/lib/utils";
import React from "react";

const TerminalCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("terminal-card", className)}
    {...props}
  />
));
TerminalCard.displayName = "TerminalCard";

export { TerminalCard };

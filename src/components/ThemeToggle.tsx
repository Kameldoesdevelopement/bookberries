import { Coffee, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const cozy = theme === "cozy";
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="sm" onClick={toggleTheme} role="switch"
          aria-checked={cozy} aria-label="Cozy theme" className="h-8 w-[78px] shrink-0 gap-1.5 px-2 font-sans text-xs">
          {cozy ? <Coffee /> : <Sun />}
          {cozy ? "Cozy" : "Default"}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Switch to {cozy ? "Default" : "Cozy"}</TooltipContent>
    </Tooltip>
  );
}
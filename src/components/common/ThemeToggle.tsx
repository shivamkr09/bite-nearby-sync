
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import React from "react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();

  const handleToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size={isMobile ? "sm" : "icon"}
      onClick={handleToggle}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
      className="hover:bg-transparent hover:text-primary"
    >
      {theme === "dark" ? (
        <Sun className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} transition-all`} />
      ) : (
        <Moon className={`${isMobile ? "h-4 w-4" : "h-5 w-5"} transition-all`} />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;

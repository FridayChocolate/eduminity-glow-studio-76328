import { Type, Sparkles, BookOpen, Cpu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useFont, fontOptions, FontStyle } from "@/hooks/useFont";
import { cn } from "@/lib/utils";

const categoryIcons = {
  "sci-fi": Cpu,
  "classic": BookOpen,
  "modern": Sparkles,
};

const categoryLabels = {
  "sci-fi": "Sci-Fi Fonts",
  "classic": "Classic Fonts",
  "modern": "Modern Fonts",
};

export const FontSelector = () => {
  const { font, setFont } = useFont();

  const sciFiFonts = fontOptions.filter(f => f.category === "sci-fi");
  const classicFonts = fontOptions.filter(f => f.category === "classic");
  const modernFonts = fontOptions.filter(f => f.category === "modern");

  const renderFontItem = (fontOption: typeof fontOptions[0]) => {
    const isActive = font === fontOption.id;
    return (
      <DropdownMenuItem
        key={fontOption.id}
        onClick={() => setFont(fontOption.id)}
        className={cn(
          "flex flex-col items-start gap-1 cursor-pointer py-3 px-4",
          isActive && "bg-primary/10 border-l-2 border-primary"
        )}
      >
        <span 
          className="font-medium text-foreground"
          style={{ fontFamily: fontOption.family }}
        >
          {fontOption.name}
        </span>
        <span 
          className="text-xs text-muted-foreground"
          style={{ fontFamily: fontOption.family }}
        >
          {fontOption.preview}
        </span>
      </DropdownMenuItem>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-muted dark:hover:shadow-glow-teal transition-all"
        >
          <Type className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 max-h-[400px] overflow-y-auto bg-popover border border-border z-50"
      >
        {/* Sci-Fi Section */}
        <DropdownMenuLabel className="flex items-center gap-2 text-neon-teal">
          <Cpu className="h-4 w-4" />
          {categoryLabels["sci-fi"]}
        </DropdownMenuLabel>
        {sciFiFonts.map(renderFontItem)}
        
        <DropdownMenuSeparator />
        
        {/* Classic Section */}
        <DropdownMenuLabel className="flex items-center gap-2 text-neon-violet">
          <BookOpen className="h-4 w-4" />
          {categoryLabels["classic"]}
        </DropdownMenuLabel>
        {classicFonts.map(renderFontItem)}
        
        <DropdownMenuSeparator />
        
        {/* Modern Section */}
        <DropdownMenuLabel className="flex items-center gap-2 text-neon-magenta">
          <Sparkles className="h-4 w-4" />
          {categoryLabels["modern"]}
        </DropdownMenuLabel>
        {modernFonts.map(renderFontItem)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

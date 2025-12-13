import { Type, Sparkles, BookOpen, Cpu, RotateCcw, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useFont, fontOptions } from "@/hooks/useFont";
import { cn } from "@/lib/utils";
import { useState } from "react";

const categoryLabels = {
  "sci-fi": "Sci-Fi Fonts",
  "classic": "Classic Fonts",
  "modern": "Modern Fonts",
};

export const FontSelector = () => {
  const { font, setFont } = useFont();
  const [previewFont, setPreviewFont] = useState<string | null>(null);

  const defaultFont = fontOptions.find(f => f.id === "default")!;
  const sciFiFonts = fontOptions.filter(f => f.category === "sci-fi");
  const classicFonts = fontOptions.filter(f => f.category === "classic");
  const modernFonts = fontOptions.filter(f => f.category === "modern" && f.id !== "default");

  const renderFontItem = (fontOption: typeof fontOptions[0]) => {
    const isActive = font === fontOption.id;
    const isHovered = previewFont === fontOption.id;
    
    return (
      <DropdownMenuItem
        key={fontOption.id}
        onClick={() => setFont(fontOption.id)}
        onMouseEnter={() => setPreviewFont(fontOption.id)}
        onMouseLeave={() => setPreviewFont(null)}
        className={cn(
          "flex flex-col items-start gap-1 cursor-pointer py-3 px-4 transition-all duration-200",
          isActive && "bg-primary/10 border-l-2 border-primary",
          isHovered && !isActive && "bg-accent/50"
        )}
      >
        <div className="flex items-center justify-between w-full">
          <span 
            className="font-medium text-foreground text-base"
            style={{ fontFamily: fontOption.family }}
          >
            {fontOption.name}
          </span>
          {isHovered && (
            <Eye className="h-3 w-3 text-muted-foreground animate-pulse" />
          )}
        </div>
        <span 
          className="text-sm text-muted-foreground"
          style={{ fontFamily: fontOption.family }}
        >
          {fontOption.preview}
        </span>
        {/* Live preview sentence */}
        <span 
          className="text-xs text-foreground/70 mt-1 leading-relaxed"
          style={{ fontFamily: fontOption.family }}
        >
          The quick brown fox jumps over the lazy dog
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
        className="w-72 max-h-[500px] overflow-y-auto bg-popover border border-border z-50"
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wider">
          Choose Your Font
        </DropdownMenuLabel>
        
        {/* Default Option */}
        <DropdownMenuItem
          onClick={() => setFont("default")}
          onMouseEnter={() => setPreviewFont("default")}
          onMouseLeave={() => setPreviewFont(null)}
          className={cn(
            "flex items-center gap-3 cursor-pointer py-3 px-4 transition-all duration-200",
            font === "default" && "bg-primary/10 border-l-2 border-primary",
            previewFont === "default" && font !== "default" && "bg-accent/50"
          )}
        >
          <RotateCcw className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between">
              <span 
                className="font-medium text-foreground" 
                style={{ fontFamily: defaultFont.family }}
              >
                Default (Inter)
              </span>
              {previewFont === "default" && (
                <Eye className="h-3 w-3 text-muted-foreground animate-pulse" />
              )}
            </div>
            <span 
              className="text-xs text-muted-foreground"
              style={{ fontFamily: defaultFont.family }}
            >
              Clean & Modern • System default
            </span>
            <span 
              className="text-xs text-foreground/70 mt-1"
              style={{ fontFamily: defaultFont.family }}
            >
              The quick brown fox jumps over the lazy dog
            </span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
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

import { useEffect, useState } from "react";

export const LoginMonster = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [emotion, setEmotion] = useState<"happy" | "curious" | "excited" | "laughing">("curious");
  const [isJumping, setIsJumping] = useState(false);

  const handleClick = () => {
    setIsJumping(true);
    setEmotion("laughing");
    
    setTimeout(() => {
      setIsJumping(false);
      setTimeout(() => {
        setEmotion("happy");
      }, 300);
    }, 600);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isJumping) return; // Don't track mouse while jumping
      
      const monsterElement = document.getElementById("login-monster");
      if (monsterElement) {
        const rect = monsterElement.getBoundingClientRect();
        const monsterCenterX = rect.left + rect.width / 2;
        const monsterCenterY = rect.top + rect.height / 2;
        
        setMousePos({
          x: e.clientX - monsterCenterX,
          y: e.clientY - monsterCenterY,
        });

        // Calculate distance to determine emotion
        const distance = Math.sqrt(
          Math.pow(e.clientX - monsterCenterX, 2) + 
          Math.pow(e.clientY - monsterCenterY, 2)
        );

        if (distance < 150) {
          setEmotion("excited");
        } else if (distance < 300) {
          setEmotion("happy");
        } else {
          setEmotion("curious");
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isJumping]);

  // Calculate eye movement based on mouse position
  const maxEyeMove = 8;
  const distance = Math.sqrt(mousePos.x ** 2 + mousePos.y ** 2);
  const angle = Math.atan2(mousePos.y, mousePos.x);
  const eyeMoveX = Math.min(distance / 30, maxEyeMove) * Math.cos(angle);
  const eyeMoveY = Math.min(distance / 30, maxEyeMove) * Math.sin(angle);

  const getMouthPath = () => {
    switch (emotion) {
      case "laughing":
        return "M 28 43 Q 40 58 52 43"; // Wide open laugh
      case "excited":
        return "M 30 45 Q 40 55 50 45"; // Big smile
      case "happy":
        return "M 30 45 Q 40 50 50 45"; // Medium smile
      case "curious":
        return "M 30 45 Q 40 48 50 45"; // Small smile
    }
  };

  const getEyeSize = () => {
    if (emotion === "laughing") return 6; // Squinted eyes when laughing
    return emotion === "excited" ? 12 : 10;
  };

  return (
    <div 
      id="login-monster" 
      className="flex items-center justify-center mb-8 relative cursor-pointer"
      onClick={handleClick}
      style={{ 
        transform: isJumping 
          ? "translateY(-30px) rotate(5deg)" 
          : `translateY(${Math.sin(Date.now() / 1000) * 3}px)`,
        transition: isJumping ? "transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)" : "transform 0.3s ease-out"
      }}
    >
      <svg
        width="120"
        height="120"
        viewBox="0 0 80 80"
        className="drop-shadow-lg transition-transform duration-300 hover:scale-110"
      >
        {/* Body */}
        <ellipse
          cx="40"
          cy="45"
          rx="30"
          ry="28"
          className="fill-primary animate-pulse"
          style={{ animationDuration: "3s" }}
        />
        
        {/* Belly */}
        <ellipse
          cx="40"
          cy="50"
          rx="18"
          ry="15"
          className="fill-primary/20"
        />

        {/* Ears */}
        <circle cx="20" cy="25" r="8" className="fill-primary" />
        <circle cx="60" cy="25" r="8" className="fill-primary" />
        <circle cx="20" cy="25" r="4" className="fill-primary/40" />
        <circle cx="60" cy="25" r="4" className="fill-primary/40" />

        {/* Eyes white */}
        <circle cx="30" cy="35" r={getEyeSize()} className="fill-white" />
        <circle cx="50" cy="35" r={getEyeSize()} className="fill-white" />

        {/* Pupils - track mouse */}
        <circle
          cx={30 + eyeMoveX}
          cy={35 + eyeMoveY}
          r="4"
          className="fill-gray-900 transition-all duration-100"
        />
        <circle
          cx={50 + eyeMoveX}
          cy={35 + eyeMoveY}
          r="4"
          className="fill-gray-900 transition-all duration-100"
        />

        {/* Eye highlights */}
        <circle cx={30 + eyeMoveX - 1} cy={35 + eyeMoveY - 1} r="1.5" className="fill-white/90" />
        <circle cx={50 + eyeMoveX - 1} cy={35 + eyeMoveY - 1} r="1.5" className="fill-white/90" />

        {/* Mouth */}
        <path
          d={getMouthPath()}
          stroke="hsl(var(--foreground))"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          className="transition-all duration-300"
        />

        {/* Blush when excited or laughing */}
        {(emotion === "excited" || emotion === "laughing") && (
          <>
            <circle cx="22" cy="42" r="3" className="fill-neon-magenta/40 animate-pulse" />
            <circle cx="58" cy="42" r="3" className="fill-neon-magenta/40 animate-pulse" />
          </>
        )}

        {/* Laugh tears when laughing */}
        {emotion === "laughing" && (
          <>
            <circle cx="26" cy="40" r="2" className="fill-neon-teal/60 animate-pulse" />
            <circle cx="54" cy="40" r="2" className="fill-neon-teal/60 animate-pulse" />
          </>
        )}

        {/* Arms */}
        <ellipse
          cx="10"
          cy="50"
          rx="6"
          ry="12"
          className="fill-primary"
          style={{ transform: emotion === "excited" ? "rotate(-20deg)" : "rotate(0deg)", transformOrigin: "10px 50px" }}
        />
        <ellipse
          cx="70"
          cy="50"
          rx="6"
          ry="12"
          className="fill-primary"
          style={{ transform: emotion === "excited" ? "rotate(20deg)" : "rotate(0deg)", transformOrigin: "70px 50px" }}
        />

        {/* Feet */}
        <ellipse cx="30" cy="70" rx="8" ry="5" className="fill-primary" />
        <ellipse cx="50" cy="70" rx="8" ry="5" className="fill-primary" />
      </svg>
    </div>
  );
};

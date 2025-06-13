interface QuiltBlockPatternProps {
  pattern: string;
  primaryColor: string;
  secondaryColor?: string;
  size?: number;
}

export default function QuiltBlockPattern({ 
  pattern, 
  primaryColor, 
  secondaryColor = "#FFFFFF", 
  size = 60 
}: QuiltBlockPatternProps) {
  const renderPattern = () => {
    switch (pattern) {
      case "ninePatch":
        return (
          <svg width={size} height={size} viewBox="0 0 60 60">
            <rect width="20" height="20" fill={primaryColor} />
            <rect x="20" width="20" height="20" fill={secondaryColor} />
            <rect x="40" width="20" height="20" fill={primaryColor} />
            <rect y="20" width="20" height="20" fill={secondaryColor} />
            <rect x="20" y="20" width="20" height="20" fill={primaryColor} />
            <rect x="40" y="20" width="20" height="20" fill={secondaryColor} />
            <rect y="40" width="20" height="20" fill={primaryColor} />
            <rect x="20" y="40" width="20" height="20" fill={secondaryColor} />
            <rect x="40" y="40" width="20" height="20" fill={primaryColor} />
          </svg>
        );

      case "logCabin":
        return (
          <svg width={size} height={size} viewBox="0 0 60 60">
            <rect width="60" height="60" fill={secondaryColor} />
            <rect x="25" y="25" width="10" height="10" fill={primaryColor} />
            <rect x="15" y="25" width="10" height="10" fill={primaryColor} />
            <rect x="15" y="15" width="20" height="10" fill={primaryColor} />
            <rect x="35" y="15" width="10" height="20" fill={secondaryColor} />
            <rect x="15" y="35" width="20" height="10" fill={secondaryColor} />
            <rect x="35" y="35" width="10" height="10" fill={secondaryColor} />
            <rect x="5" y="15" width="10" height="30" fill={primaryColor} />
            <rect x="15" y="5" width="30" height="10" fill={primaryColor} />
            <rect x="45" y="15" width="10" height="30" fill={secondaryColor} />
            <rect x="15" y="45" width="30" height="10" fill={secondaryColor} />
          </svg>
        );

      case "flyingGeese":
        return (
          <svg width={size} height={size} viewBox="0 0 60 60">
            <rect width="60" height="60" fill={secondaryColor} />
            <polygon points="0,30 30,0 30,30" fill={primaryColor} />
            <polygon points="30,30 60,0 60,30" fill={primaryColor} />
            <polygon points="0,60 30,30 30,60" fill={primaryColor} />
            <polygon points="30,60 60,30 60,60" fill={primaryColor} />
          </svg>
        );

      case "pinwheel":
        return (
          <svg width={size} height={size} viewBox="0 0 60 60">
            <rect width="60" height="60" fill={secondaryColor} />
            <polygon points="0,0 30,0 30,30" fill={primaryColor} />
            <polygon points="30,0 60,0 60,30" fill={secondaryColor} />
            <polygon points="60,30 60,60 30,60" fill={primaryColor} />
            <polygon points="30,60 0,60 0,30" fill={secondaryColor} />
            <polygon points="0,30 30,30 30,0" fill={secondaryColor} />
            <polygon points="30,0 30,30 60,30" fill={primaryColor} />
            <polygon points="60,30 30,30 30,60" fill={secondaryColor} />
            <polygon points="30,60 30,30 0,30" fill={primaryColor} />
          </svg>
        );

      case "ohioStar":
        return (
          <svg width={size} height={size} viewBox="0 0 60 60">
            <rect width="60" height="60" fill={secondaryColor} />
            {/* Center square */}
            <rect x="20" y="20" width="20" height="20" fill={primaryColor} />
            {/* Star points */}
            <polygon points="20,0 30,10 40,0 40,20 20,20" fill={primaryColor} />
            <polygon points="60,20 50,30 60,40 40,40 40,20" fill={primaryColor} />
            <polygon points="40,60 30,50 20,60 20,40 40,40" fill={primaryColor} />
            <polygon points="0,40 10,30 0,20 20,20 20,40" fill={primaryColor} />
            {/* Corner squares */}
            <rect x="0" y="0" width="20" height="20" fill={secondaryColor} />
            <rect x="40" y="0" width="20" height="20" fill={secondaryColor} />
            <rect x="0" y="40" width="20" height="20" fill={secondaryColor} />
            <rect x="40" y="40" width="20" height="20" fill={secondaryColor} />
          </svg>
        );

      case "churnDash":
        return (
          <svg width={size} height={size} viewBox="0 0 60 60">
            <rect width="60" height="60" fill={secondaryColor} />
            {/* Corner rectangles */}
            <rect x="0" y="0" width="15" height="15" fill={primaryColor} />
            <rect x="45" y="0" width="15" height="15" fill={primaryColor} />
            <rect x="0" y="45" width="15" height="15" fill={primaryColor} />
            <rect x="45" y="45" width="15" height="15" fill={primaryColor} />
            {/* Side rectangles */}
            <rect x="15" y="0" width="30" height="15" fill={secondaryColor} />
            <rect x="45" y="15" width="15" height="30" fill={secondaryColor} />
            <rect x="15" y="45" width="30" height="15" fill={secondaryColor} />
            <rect x="0" y="15" width="15" height="30" fill={secondaryColor} />
            {/* Center cross */}
            <rect x="15" y="15" width="30" height="30" fill={primaryColor} />
            <rect x="25" y="5" width="10" height="50" fill={secondaryColor} />
            <rect x="5" y="25" width="50" height="10" fill={secondaryColor} />
          </svg>
        );

      case "bearPaw":
        return (
          <svg width={size} height={size} viewBox="0 0 60 60">
            <rect width="60" height="60" fill={secondaryColor} />
            {/* Main paw shape */}
            <rect x="15" y="15" width="30" height="30" fill={primaryColor} />
            {/* Paw pad triangles */}
            <polygon points="15,15 25,5 35,15" fill={primaryColor} />
            <polygon points="45,15 55,25 45,35" fill={primaryColor} />
            <polygon points="45,45 35,55 25,45" fill={primaryColor} />
            <polygon points="15,45 5,35 15,25" fill={primaryColor} />
            {/* Small corner squares */}
            <rect x="0" y="0" width="15" height="15" fill={secondaryColor} />
            <rect x="45" y="0" width="15" height="15" fill={secondaryColor} />
            <rect x="0" y="45" width="15" height="15" fill={secondaryColor} />
            <rect x="45" y="45" width="15" height="15" fill={secondaryColor} />
          </svg>
        );

      case "halfSquare":
        return (
          <svg width={size} height={size} viewBox="0 0 60 60">
            <rect width="60" height="60" fill={secondaryColor} />
            <polygon points="0,0 60,0 0,60" fill={primaryColor} />
          </svg>
        );

      case "courthouseSteps":
        return (
          <svg width={size} height={size} viewBox="0 0 60 60">
            <rect width="60" height="60" fill={secondaryColor} />
            <rect x="20" y="20" width="20" height="20" fill={primaryColor} />
            <rect x="15" y="20" width="5" height="20" fill={secondaryColor} />
            <rect x="40" y="20" width="5" height="20" fill={secondaryColor} />
            <rect x="15" y="15" width="30" height="5" fill={secondaryColor} />
            <rect x="15" y="40" width="30" height="5" fill={secondaryColor} />
            <rect x="10" y="15" width="5" height="30" fill={primaryColor} />
            <rect x="45" y="15" width="5" height="30" fill={primaryColor} />
            <rect x="10" y="10" width="40" height="5" fill={primaryColor} />
            <rect x="10" y="45" width="40" height="5" fill={primaryColor} />
          </svg>
        );

      case "fourPatch":
        return (
          <svg width={size} height={size} viewBox="0 0 60 60">
            <rect width="30" height="30" fill={primaryColor} />
            <rect x="30" width="30" height="30" fill={secondaryColor} />
            <rect y="30" width="30" height="30" fill={secondaryColor} />
            <rect x="30" y="30" width="30" height="30" fill={primaryColor} />
          </svg>
        );

      case "solid":
        return (
          <svg width={size} height={size} viewBox="0 0 60 60">
            <rect width="60" height="60" fill={primaryColor} />
          </svg>
        );

      case "hst":
        return (
          <svg width={size} height={size} viewBox="0 0 60 60">
            <rect width="60" height="60" fill={secondaryColor} />
            <polygon points="0,0 60,0 0,60" fill={primaryColor} />
          </svg>
        );

      case "quarterSquare":
        return (
          <svg width={size} height={size} viewBox="0 0 60 60">
            <rect width="60" height="60" fill={secondaryColor} />
            <polygon points="0,0 30,0 0,30" fill={primaryColor} />
            <polygon points="60,60 30,60 60,30" fill={primaryColor} />
          </svg>
        );

      default:
        return (
          <svg width={size} height={size} viewBox="0 0 60 60">
            <rect width="60" height="60" fill={primaryColor} />
          </svg>
        );
    }
  };

  return <div className="w-full h-full flex items-center justify-center">{renderPattern()}</div>;
}
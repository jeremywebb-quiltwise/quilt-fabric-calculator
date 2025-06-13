interface QuiltBlockProps {
  type: string;
  color: string;
  size?: number;
  onClick?: () => void;
}

export default function QuiltBlock({ type, color, size = 100, onClick }: QuiltBlockProps) {
  const baseStyle = {
    width: size,
    height: size,
    cursor: onClick ? "pointer" : "default",
  };

  const renderBlock = () => {
    switch (type) {
      case "solid":
        return (
          <div
            className="quilt-block"
            style={{
              ...baseStyle,
              backgroundColor: color,
            }}
            onClick={onClick}
          />
        );

      case "gradient":
        return (
          <div
            className="quilt-block"
            style={{
              ...baseStyle,
              background: `linear-gradient(45deg, ${color}, #C4A76B)`,
            }}
            onClick={onClick}
          />
        );

      case "gradient-2":
        return (
          <div
            className="quilt-block"
            style={{
              ...baseStyle,
              background: `linear-gradient(135deg, #6B8B73, ${color})`,
            }}
            onClick={onClick}
          />
        );

      case "outline":
        return (
          <div
            className="quilt-block"
            style={{
              ...baseStyle,
              backgroundColor: "transparent",
              border: `2px solid ${color}`,
            }}
            onClick={onClick}
          />
        );

      case "nine-patch":
        return (
          <div
            className="quilt-block grid grid-cols-3 gap-px p-1"
            style={baseStyle}
            onClick={onClick}
          >
            {Array.from({ length: 9 }, (_, i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  backgroundColor: i % 2 === 0 ? color : "#F7F5F3",
                }}
              />
            ))}
          </div>
        );

      case "log-cabin":
        return (
          <div
            className="quilt-block flex items-center justify-center"
            style={{
              ...baseStyle,
              backgroundColor: color,
            }}
            onClick={onClick}
          >
            <div
              className="w-1/2 h-1/2 rounded-full"
              style={{ backgroundColor: "#C4A76B" }}
            />
          </div>
        );

      case "flying-geese":
        return (
          <div
            className="quilt-block flex items-center justify-center"
            style={{
              ...baseStyle,
              backgroundColor: color,
            }}
            onClick={onClick}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderBottom: "12px solid white",
              }}
            />
          </div>
        );

      default:
        return (
          <div
            className="quilt-block"
            style={{
              ...baseStyle,
              backgroundColor: color,
            }}
            onClick={onClick}
          />
        );
    }
  };

  return renderBlock();
}

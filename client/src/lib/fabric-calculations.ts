interface CalculationParams {
  quiltWidth: number;
  quiltHeight: number;
  blockSize?: number;
  seamAllowance: string;
  fabricWidth: number;
  pattern: string;
  bindingWidth: string;
  backingPieces: string;
  battingType: string;
  extraFabric: string;
}

interface PatternMultipliers {
  main: number;
  accent1: number;
  accent2: number;
  binding: number;
}

const PATTERN_MULTIPLIERS: Record<string, PatternMultipliers> = {
  "pieced": {
    main: 0.45,
    accent1: 0.30,
    accent2: 0.15,
    binding: 0.10,
  },
  "applique": {
    main: 0.60,
    accent1: 0.20,
    accent2: 0.10,
    binding: 0.10,
  },
  "wholecloth": {
    main: 0.85,
    accent1: 0.05,
    accent2: 0.00,
    binding: 0.10,
  },
  "art": {
    main: 0.40,
    accent1: 0.35,
    accent2: 0.15,
    binding: 0.10,
  },
  "baby": {
    main: 0.50,
    accent1: 0.25,
    accent2: 0.15,
    binding: 0.10,
  },
  "medallion": {
    main: 0.35,
    accent1: 0.30,
    accent2: 0.25,
    binding: 0.10,
  },
};

function roundToFraction(yards: number): string {
  if (yards < 0.125) return "1/8";
  if (yards < 0.25) return "1/4";
  if (yards < 0.375) return "3/8";
  if (yards < 0.5) return "1/2";
  if (yards < 0.625) return "5/8";
  if (yards < 0.75) return "3/4";
  if (yards < 0.875) return "7/8";
  
  const wholeYards = Math.floor(yards);
  const remainder = yards - wholeYards;
  
  let fractionPart = "";
  if (remainder >= 0.875) {
    fractionPart = "7/8";
  } else if (remainder >= 0.75) {
    fractionPart = "3/4";
  } else if (remainder >= 0.625) {
    fractionPart = "5/8";
  } else if (remainder >= 0.5) {
    fractionPart = "1/2";
  } else if (remainder >= 0.375) {
    fractionPart = "3/8";
  } else if (remainder >= 0.25) {
    fractionPart = "1/4";
  } else if (remainder >= 0.125) {
    fractionPart = "1/8";
  }
  
  if (wholeYards === 0) {
    return fractionPart;
  } else if (fractionPart === "") {
    return wholeYards.toString();
  } else {
    return `${wholeYards} ${fractionPart}`;
  }
}

export function calculateFabricRequirements(params: CalculationParams) {
  const {
    quiltWidth,
    quiltHeight,
    seamAllowance,
    fabricWidth,
    pattern,
    bindingWidth,
    backingPieces,
    battingType,
    extraFabric,
  } = params;

  // Calculate basic quilt metrics
  const seamAllowanceNum = parseFloat(seamAllowance);
  const extraFabricPercent = parseFloat(extraFabric) / 100;
  
  // Calculate total fabric area needed (in square inches)
  const quiltArea = quiltWidth * quiltHeight;
  
  // Add extra fabric percentage for seam allowances and waste
  const adjustedArea = quiltArea * (1 + extraFabricPercent);
  
  // Calculate yardage (fabric width in inches, 36 inches per yard)
  const totalYards = adjustedArea / (fabricWidth * 36);
  
  // Get pattern-specific multipliers
  const multipliers = PATTERN_MULTIPLIERS[pattern] || PATTERN_MULTIPLIERS.pieced;
  
  // Calculate individual fabric requirements
  const mainFabric = roundToFraction(totalYards * multipliers.main);
  const accentFabric1 = roundToFraction(totalYards * multipliers.accent1);
  const accentFabric2 = roundToFraction(totalYards * multipliers.accent2);
  
  // Calculate binding requirements
  const perimeter = 2 * (quiltWidth + quiltHeight);
  const bindingWidthNum = parseFloat(bindingWidth);
  const bindingLength = perimeter + 12; // Add 12" for joining and mitering
  const bindingStrips = Math.ceil(bindingLength / (fabricWidth - 2)); // 2" margin
  const bindingYards = roundToFraction((bindingStrips * bindingWidthNum) / 36);
  
  // Calculate backing requirements
  let backingYards = "0";
  if (backingPieces === "1" || backingPieces === "wide") {
    // Single width or wide backing
    backingYards = roundToFraction((quiltHeight + 8) / 36); // Add 4" on each side
  } else if (backingPieces === "2") {
    // Two panels
    const panelWidth = Math.ceil((quiltWidth + 8) / 2);
    backingYards = roundToFraction(2 * (quiltHeight + 8) / 36);
  } else if (backingPieces === "3") {
    // Three panels
    backingYards = roundToFraction(3 * (quiltHeight + 8) / 36);
  } else if (backingPieces === "horizontal") {
    // Horizontal seam
    backingYards = roundToFraction(2 * (quiltWidth + 8) / 36);
  }
  
  // Calculate batting size
  const battingWidth = quiltWidth + 4;
  const battingHeight = quiltHeight + 4;
  const battingSize = `${battingWidth}" x ${battingHeight}"`;
  
  // Convert fractional values back to decimal for total calculation
  const convertFractionToDecimal = (fraction: string): number => {
    if (fraction === "0") return 0;
    
    const parts = fraction.split(' ');
    let total = 0;
    
    if (parts.length === 2) {
      // Has whole number and fraction
      total += parseInt(parts[0]);
      fraction = parts[1];
    } else if (parts.length === 1 && !fraction.includes('/')) {
      // Just a whole number
      return parseInt(fraction);
    }
    
    // Convert fraction part
    if (fraction.includes('1/8')) total += 0.125;
    else if (fraction.includes('1/4')) total += 0.25;
    else if (fraction.includes('3/8')) total += 0.375;
    else if (fraction.includes('1/2')) total += 0.5;
    else if (fraction.includes('5/8')) total += 0.625;
    else if (fraction.includes('3/4')) total += 0.75;
    else if (fraction.includes('7/8')) total += 0.875;
    
    return total;
  };

  const totalYardsDecimal = 
    convertFractionToDecimal(mainFabric) + 
    convertFractionToDecimal(accentFabric1) + 
    convertFractionToDecimal(accentFabric2) + 
    convertFractionToDecimal(bindingYards) +
    convertFractionToDecimal(backingYards);
    
  const totalFabric = roundToFraction(totalYardsDecimal);

  return {
    mainFabric,
    accentFabric1,
    accentFabric2,
    bindingFabric: bindingYards,
    backingFabric: backingYards,
    battingSize,
    battingType,
    totalFabric,
    quiltSize: `${quiltWidth}" × ${quiltHeight}"`,
    perimeter: `${Math.round(perimeter)}"`,
    quiltWidth,
    quiltHeight,
  };
}

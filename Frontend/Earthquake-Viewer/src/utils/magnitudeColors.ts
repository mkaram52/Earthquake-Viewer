export interface MagnitudeColor {
  chakraToken: string;
  hex: string;
  hoverHex: string;
}

// Helper function to lighten a hex color, increasing number makes it lighter
const lightenHex = (hex: string, factor: number = 0.2): string => {
  hex = hex.replace('#', '');
  
  // Parse RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Lighten by blending towards white (255, 255, 255), closing the distance between the color and white by number %
  const lightenedR = Math.min(255, Math.floor(r + (255 - r) * factor));
  const lightenedG = Math.min(255, Math.floor(g + (255 - g) * factor));
  const lightenedB = Math.min(255, Math.floor(b + (255 - b) * factor));
  
  // Convert back to hex
  return `#${lightenedR.toString(16).padStart(2, '0')}${lightenedG.toString(16).padStart(2, '0')}${lightenedB.toString(16).padStart(2, '0')}`;
};

export const getMagnitudeColor = (magnitude: number): MagnitudeColor => {
  if (magnitude >= 6) {
    const hex = "#9F7AEA";
    return {
      chakraToken: "purple.400",
      hex: hex,
      hoverHex: lightenHex(hex, 0.2),
    };
  } else if (magnitude >= 5) {
    const hex = "#F56565";
    return {
      chakraToken: "red.400",
      hex: hex,
      hoverHex: lightenHex(hex, 0.2),
    };
  } else if (magnitude >= 4) {
    const hex = "#ED8936";
    return {
      chakraToken: "orange.400",
      hex: hex,
      hoverHex: lightenHex(hex, 0.2),
    };
  } else if (magnitude >= 3) {
    const hex = "#ECC94B";
    return {
      chakraToken: "yellow.400",
      hex: hex,
      hoverHex: lightenHex(hex, 0.2),
    };
  } else if (magnitude >= 2) {
    const hex = "#48BB78";
    return {
      chakraToken: "green.400",
      hex: hex,
      hoverHex: lightenHex(hex, 0.2),
    };
  } else {
    const hex = "#4299E1";
    return {
      chakraToken: "blue.400",
      hex: hex,
      hoverHex: lightenHex(hex, 0.2),
    };
  }
};

export const getMagnitudeColorToken = (magnitude: number): string => {
  return getMagnitudeColor(magnitude).chakraToken;
};

export const getMagnitudeColorHex = (magnitude: number): string => {
  return getMagnitudeColor(magnitude).hex;
};

export const getMagnitudeColorHoverHex = (magnitude: number): string => {
  return getMagnitudeColor(magnitude).hoverHex;
};


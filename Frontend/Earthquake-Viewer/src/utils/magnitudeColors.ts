export interface MagnitudeColor {
  chakraToken: string;
  hex: string;
}

export const getMagnitudeColor = (magnitude: number): MagnitudeColor => {
  if (magnitude >= 6) {
    return {
      chakraToken: "purple.400",
      hex: "#9F7AEA"
    };
  } else if (magnitude >= 5) {
    return {
      chakraToken: "red.400",
      hex: "#F56565"
    };
  } else if (magnitude >= 4) {
    return {
      chakraToken: "orange.400",
      hex: "#ED8936"
    };
  } else if (magnitude >= 3) {
    return {
      chakraToken: "yellow.400",
      hex: "#ECC94B"
    };
  } else if (magnitude >= 2) {
    return {
      chakraToken: "green.400",
      hex: "#48BB78"
    };
  } else {
    return {
      chakraToken: "blue.400",
      hex: "#4299E1"
    };
  }
};

export const getMagnitudeColorToken = (magnitude: number): string => {
  return getMagnitudeColor(magnitude).chakraToken;
};

export const getMagnitudeColorHex = (magnitude: number): string => {
  return getMagnitudeColor(magnitude).hex;
};


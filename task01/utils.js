export const checkIsCharCodeSymbol = (charCode) => (charCode >= 32 && charCode <= 64)
    || (charCode >= 91 && charCode <= 96)
    || (charCode >= 123 && charCode <= 126);

export const isCharCodeUpperCased = (charCode) => charCode >= 65 && charCode <= 90;
export const isCharCodeLowerCased = (charCode) => charCode >= 97 && charCode <= 122;

export const charToASCII = (char) => char.charCodeAt(0);

export const ASCIIWithShiftToChar = (charCode, shift) => {
  const isEncoded = shift > 0;
  const shiftedCharCode = charCode + shift;

  if (checkIsCharCodeSymbol(charCode)) {
    return String.fromCharCode(charCode);
  }

  if (isCharCodeLowerCased(charCode)) {
    if (isEncoded) {
      return shiftedCharCode > 122
        ? String.fromCharCode(shiftedCharCode - 26)
        : String.fromCharCode(shiftedCharCode);
    }
    return shiftedCharCode < 97
      ? String.fromCharCode(shiftedCharCode + 26)
      : String.fromCharCode(shiftedCharCode);
  }

  if (isCharCodeUpperCased(charCode)) {
    if (isEncoded) {
      return shiftedCharCode > 90
        ? String.fromCharCode(shiftedCharCode - 26)
        : String.fromCharCode(shiftedCharCode);
    }
    return shiftedCharCode < 65
      ? String.fromCharCode(shiftedCharCode + 26)
      : String.fromCharCode(shiftedCharCode);
  }

  return undefined;
};

export const mirrorASCIIChar = (charCode) => {
  if (checkIsCharCodeSymbol(charCode)) {
    return String.fromCharCode(charCode);
  }

  const MAX = isCharCodeUpperCased(charCode) ? 90 : 122;
  const MIN = isCharCodeUpperCased(charCode) ? 65 : 97;
  const delta = charCode - MIN;

  return String.fromCharCode(MAX - delta);
};

export const runPipeline = (streams) => streams.reduce((prev, curr) => prev.pipe(curr));

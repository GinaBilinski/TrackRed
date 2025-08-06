// src/utils/conversion.ts
// globale Funktion um Werte und Referenzbereiche umzurechnen

export const umrechnen = (
  wert: number | null,
  von: string,
  nach: string,
  factors?: { [key: string]: number }
): number | null => {
  if (wert === null || von === nach) return wert;

  const fVonReferenz = factors?.[von];
  const fNachReferenz = factors?.[nach];

  if (fVonReferenz && fNachReferenz) {
    const inReferenz = wert / fVonReferenz;
    return +(inReferenz * fNachReferenz).toFixed(2);
  }

  if (fVonReferenz) return +(wert / fVonReferenz).toFixed(2);
  if (fNachReferenz) return +(wert * fNachReferenz).toFixed(2);

  return wert;
};

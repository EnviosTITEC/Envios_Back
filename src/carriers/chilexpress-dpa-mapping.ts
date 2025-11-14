// src/carriers/chilexpress-dpa-mapping.ts
export const DPA_TO_CHILEXPRESS_COUNTY: Record<string, string> = {
  // ---------------- Región Metropolitana ----------------
  // 13101 = Santiago
  '13101': 'SCL',

  // 13114 = Las Condes (Chilexpress la agrupa igual bajo SCL)
  '13114': 'SCL',

  // ...otros códigos que ya tengas mapeados...

  // ---------------- Región de Valparaíso ----------------
  // 05109 = Viña del Mar (DPA)
  '05109': 'VAP',

  // 05101 = Valparaíso (DPA)
  '05101': 'VAP',

  // Si después quieres agregar más comunas de la zona,
  // puedes mapearlas también a 'VAP' si Chilexpress las agrupa igual.
};

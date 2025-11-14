// Mapping entre DPA (Gobierno de Chile) ↔ Chilexpress
// Solo comunas de Región Metropolitana + Valparaíso, suficiente para demo.

export type ChilexpressCommuneInfo = {
  dpaCommuneId: string;        // ID oficial API DPA Gobierno
  dpaCommuneName: string;      // Nombre oficial comuna Gobierno
  chilexpressCountyCode: string;   // Código Chilexpress
  chilexpressCountyName: string;   // Nombre Chilexpress
};

// NOTA IMPORTANTE:
// Chilexpress agrupa comunas por "countyCode", por ejemplo
// muchas comunas de Santiago comparten el mismo código "SCL".
// Para la demo NO necesitas exactitud perfecta; basta con mapping funcional.

export const CHILEXPRESS_COMMUNES: ChilexpressCommuneInfo[] = [
  // --- REGIÓN METROPOLITANA (CÓDIGO SCL) ---
  {
    dpaCommuneId: "13101",
    dpaCommuneName: "Santiago",
    chilexpressCountyCode: "SCL",
    chilexpressCountyName: "SANTIAGO",
  },
  {
    dpaCommuneId: "13114",
    dpaCommuneName: "Providencia",
    chilexpressCountyCode: "SCL",
    chilexpressCountyName: "SANTIAGO",
  },
  {
    dpaCommuneId: "13115",
    dpaCommuneName: "Las Condes",
    chilexpressCountyCode: "SCL",
    chilexpressCountyName: "SANTIAGO",
  },
  {
    dpaCommuneId: "13108",
    dpaCommuneName: "La Florida",
    chilexpressCountyCode: "SCL",
    chilexpressCountyName: "SANTIAGO",
  },
  {
    dpaCommuneId: "13110",
    dpaCommuneName: "Maipú",
    chilexpressCountyCode: "SCL",
    chilexpressCountyName: "SANTIAGO",
  },

  // --- REGIÓN DE VALPARAÍSO (CÓDIGO VAP) ---
  {
    dpaCommuneId: "5101",
    dpaCommuneName: "Valparaíso",
    chilexpressCountyCode: "VAP",
    chilexpressCountyName: "VALPARAISO",
  },
  {
    dpaCommuneId: "5109",
    dpaCommuneName: "Viña del Mar",
    chilexpressCountyCode: "VAP",
    chilexpressCountyName: "VALPARAISO",
  },
  {
    dpaCommuneId: "5107",
    dpaCommuneName: "Concón",
    chilexpressCountyCode: "VAP",
    chilexpressCountyName: "VALPARAISO",
  },
];

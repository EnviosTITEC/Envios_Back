export function mapFrontendAddressToInternal(body: any): any {
  if (!body || typeof body !== 'object') return body;

  // If body already uses internal keys, return as-is
  const internalKeys = ['calle', 'numero', 'comuna_id', 'codigo_comuna', 'region_id', 'codigo_postal', 'referencias', 'usuario_id'];
  if (internalKeys.some(k => Object.prototype.hasOwnProperty.call(body, k))) return body;

  const map: Record<string, string> = {
    street: 'calle',
    number: 'numero',
    communeId: 'comuna_id',
    countyCode: 'codigo_comuna',
    postalCode: 'codigo_postal',
    references: 'referencias',
    regionId: 'region_id',
    userId: 'usuario_id',
    user_id: 'usuario_id',
  };

  const out: any = {};
  for (const [k, v] of Object.entries(body)) {
    const target = map[k] ?? k;
    out[target] = v;
  }

  return out;
}

export function mapFrontendDeliveryToInternal(body: any): any {
  // Placeholder for future mappings (deliveries). Keep for discoverability.
  return body;
}

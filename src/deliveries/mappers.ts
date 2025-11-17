// mappers para integrar con API externa y mantener modelos internos en español snake_case
export function toExternalPayload(d: any) {
  return {
    originCountyCode: d.codigo_postal_origen,
    destinationCountyCode: d.codigo_postal_destino,
    package: {
      weight: String(d.peso),
      height: String(d.dimensiones?.alto ?? d.alto ?? 0),
      width: String(d.dimensiones?.ancho ?? d.ancho ?? 0),
      length: String(d.dimensiones?.largo ?? d.largo ?? 0),
    },
    productType: d.tipo_producto,
    contentType: d.tipo_contenido,
    declaredWorth: String(d.valor_declarado ?? d.valor_seguro ?? 0),
    deliveryTime: d.tiempo_entrega,
  };
}

export function fromExternalPayload(p: any) {
  return {
    codigo_postal_origen: p.originCountyCode,
    codigo_postal_destino: p.destinationCountyCode,
    peso: Number(p.package?.weight ?? 0),
    dimensiones: {
      largo: Number(p.package?.length ?? 0),
      ancho: Number(p.package?.width ?? 0),
      alto: Number(p.package?.height ?? 0),
      peso_dim: Number(p.package?.weight ?? 0),
    },
    tipo_producto: p.productType,
    tipo_contenido: p.contentType,
    valor_declarado: Number(p.declaredWorth ?? 0),
    tiempo_entrega: p.deliveryTime,
  };
}

export default { toExternalPayload, fromExternalPayload };

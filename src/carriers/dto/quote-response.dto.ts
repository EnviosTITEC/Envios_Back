import { ApiProperty } from '@nestjs/swagger';

export class OpcionServicioDto {
  @ApiProperty({
    example: 'PRIORITARIO',
    description: 'Nombre del servicio de envío',
  })
  nombre_servicio?: string;

  @ApiProperty({
    example: 'PRI',
    description: 'Código del servicio',
  })
  codigo_servicio?: string;

  @ApiProperty({
    example: 8500,
    description: 'Costo del servicio en pesos chilenos',
  })
  valor_servicio?: number;

  @ApiProperty({
    example: '1 día hábil',
    description: 'Tiempo estimado de entrega',
  })
  tiempo_entrega?: string;

  @ApiProperty({
    example: true,
    description: 'Indica si el servicio está disponible',
  })
  disponible?: boolean;
}

export class RespuestaCotizacionDto {
  @ApiProperty({
    example: 0,
    description: 'Código de estado de la respuesta (0 = éxito)',
  })
  codigo_estado: number;

  @ApiProperty({
    example: 'Cotización exitosa',
    description: 'Descripción del estado',
  })
  descripcion_estado: string;

  @ApiProperty({
    type: [OpcionServicioDto],
    description: 'Lista de opciones de servicio disponibles',
  })
  opciones_servicio?: OpcionServicioDto[];

  @ApiProperty({
    example: '13101',
    description: 'Código de comuna de origen utilizado',
  })
  comuna_origen_id?: string;

  @ApiProperty({
    example: '05109',
    description: 'Código de comuna de destino utilizado',
  })
  comuna_destino_id?: string;

  @ApiProperty({
    example: 'SCL',
    description: 'Código de cobertura Chilexpress de origen',
  })
  codigo_cobertura_origen?: string;

  @ApiProperty({
    example: 'VAP',
    description: 'Código de cobertura Chilexpress de destino',
  })
  codigo_cobertura_destino?: string;

  @ApiProperty({
    description: 'Mensaje de error si la cotización falló',
  })
  error?: string;

  @ApiProperty({
    description: 'Datos adicionales de la respuesta de Chilexpress',
  })
  datos_crudos?: any;
}

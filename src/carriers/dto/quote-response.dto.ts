import { ApiProperty } from '@nestjs/swagger';

export class ServiceOptionDto {
  @ApiProperty({
    example: 'PRIORITARIO',
    description: 'Nombre del servicio de envío',
  })
  serviceName?: string;

  @ApiProperty({
    example: 'PRI',
    description: 'Código del servicio',
  })
  serviceCode?: string;

  @ApiProperty({
    example: 8500,
    description: 'Costo del servicio en pesos chilenos',
  })
  serviceValue?: number;

  @ApiProperty({
    example: '1 día hábil',
    description: 'Tiempo estimado de entrega',
  })
  deliveryTime?: string;

  @ApiProperty({
    example: true,
    description: 'Indica si el servicio está disponible',
  })
  available?: boolean;
}

export class QuoteResponseDto {
  @ApiProperty({
    example: 0,
    description: 'Código de estado de la respuesta (0 = éxito)',
  })
  statusCode: number;

  @ApiProperty({
    example: 'Cotización exitosa',
    description: 'Descripción del estado',
  })
  statusDescription: string;

  @ApiProperty({
    type: [ServiceOptionDto],
    description: 'Lista de opciones de servicio disponibles',
    example: [
      {
        serviceName: 'PRIORITARIO',
        serviceCode: 'PRI',
        serviceValue: 8500,
        deliveryTime: '1 día hábil',
        available: true,
      },
    ],
  })
  serviceOptions?: ServiceOptionDto[];

  @ApiProperty({
    example: '13101',
    description: 'Código de comuna de origen utilizado',
  })
  originCommuneId?: string;

  @ApiProperty({
    example: '05109',
    description: 'Código de comuna de destino utilizado',
  })
  destinationCommuneId?: string;

  @ApiProperty({
    example: 'SCL',
    description: 'Código de cobertura Chilexpress de origen',
  })
  originCountyCode?: string;

  @ApiProperty({
    example: 'VAP',
    description: 'Código de cobertura Chilexpress de destino',
  })
  destinationCountyCode?: string;

  @ApiProperty({
    description: 'Mensaje de error si la cotización falló',
    example: 'Error al procesar la solicitud',
  })
  error?: string;

  @ApiProperty({
    description: 'Datos adicionales de la respuesta de Chilexpress',
    example: {},
  })
  rawData?: any;
}

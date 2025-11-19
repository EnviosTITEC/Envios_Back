import { ApiProperty } from '@nestjs/swagger';
import { DeliveryStatus } from '../schemas/delivery.schema';

export class DeliveryResponseDto {
  @ApiProperty({ example: 'ENV-1234567890-ABCDEF', description: 'Número de seguimiento único del envío' })
  numero_seguimiento: string;

  @ApiProperty({ example: 'En tránsito', description: 'Estado actual del envío' })
  estado: DeliveryStatus;

  @ApiProperty({ example: 'pago_12345', description: 'ID del pago asociado al envío' })
  id_pago: string;

  @ApiProperty({ example: 'carrito_67890', description: 'ID del carrito de compras asociado' })
  id_carrito: string;

  @ApiProperty({ example: 'usuario_123', description: 'ID del usuario que realizó la compra' })
  id_usuario: string;

  @ApiProperty({ example: 'vendedor_456', description: 'ID del vendedor asociado al envío' })
  id_vendedor: string;

  @ApiProperty({ example: 'Chilexpress', description: 'Nombre del transportista' })
  nombre_transportista: string;

  @ApiProperty({ example: 'PRIORITARIO', description: 'Tipo de servicio utilizado para el envío' })
  tipo_servicio: string;

  @ApiProperty({ example: 8812, description: 'Costo estimado del envío en pesos chilenos' })
  costo_estimado: number;

  @ApiProperty({ example: 'CLP', description: 'Moneda utilizada para el costo estimado' })
  moneda: string;

  @ApiProperty({ example: '13101', description: 'ID de la dirección de origen' })
  id_direccion_origen: string;

  @ApiProperty({ example: '05109', description: 'ID de la dirección de destino' })
  id_direccion_destino: string;

  @ApiProperty({ 
    example: [{ id_producto: 'prod_1', nombre: 'iPhone 14', cantidad: 1, precio: 899990 }],
    description: 'Lista de productos incluidos en el envío' 
  })
  items: Array<{
    id_producto: string;
    nombre: string;
    cantidad: number;
    precio: number;
  }>;

  @ApiProperty({ example: '2025-11-25T10:00:00Z', description: 'Fecha estimada de entrega del envío' })
  fecha_entrega_estimada?: Date;

  @ApiProperty({ example: '2025-11-19T15:30:00Z', description: 'Fecha de creación del envío' })
  fecha_creacion: Date;

  @ApiProperty({ example: 'Envío creado exitosamente.', description: 'Mensaje informativo sobre el estado del envío' })
  message: string;
}

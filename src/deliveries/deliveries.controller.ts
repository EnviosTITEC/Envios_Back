import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { DeliveriesService as DeliveriesService } from './deliveries.service';
import { DeliveryDto } from '../contracts/delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { CrearEnvioDesdePagoDto } from './dto/create-delivery-from-payment.dto';
import { CrearEnvioDirectoDto } from './dto/create-delivery-directly.dto';
import { RespuestaEnvioDto } from './dto/delivery-response.dto';

@ApiTags('Deliveries')
@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveryService: DeliveriesService) {}



  /**
   * Crear envío directamente desde el frontend (para flujo de cotización)
   */
  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Crear envío directamente',
    description: 'Crea un envío desde el frontend sin necesidad de un pago previo. Usado en el flujo de cotización.'
  })
  @ApiBody({
    type: CrearEnvioDirectoDto,
    description: 'Datos del envío',
    examples: {
      example1: {
        summary: 'Ejemplo de creación directa',
        value: {
          usuario_id: 'user_456',
          vendedor_id: 'STGO',
          carrito_id: 'cart-1764464473687',
          pago_id: 'pendiente',
          articulo_carrito: [
            {
              producto_id: 'prod_001',
              nombre: 'iPhone 14 Pro',
              cantidad: 1,
              precio: 899990
            },
            {
              producto_id: 'prod_002',
              nombre: 'Samsung Galaxy S23',
              cantidad: 1,
              precio: 799990
            },
            {
              producto_id: 'prod_003',
              nombre: 'AirPods Pro',
              cantidad: 2,
              precio: 299990
            }
          ],
          paquete: {
            peso: 1.3,
            largo: 22,
            ancho: 16,
            alto: 12
          },
          informacion_envio: {
            origen_direccion_id: 'STGO',
            destino_direccion_id: 'CALA',
            nombre_transportista: 'EXPRESS',
            tipo_servicio: 'EXPRESS',
            costo_estimado: 13897,
            calle: 'test',
            numero: '111'
          },
          valor_declarado: 2299960,
          notas: 'Creado desde frontend'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Envío creado exitosamente',
    type: RespuestaEnvioDto
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createDirectly(@Body() dto: CrearEnvioDirectoDto): Promise<RespuestaEnvioDto> {
    return this.deliveryService.createDirectly(dto);
  }

  /**
   * Listar envíos de un usuario específico
   */
  @Get('user/:userId')
  @ApiOperation({ 
    summary: 'Listar envíos del usuario',
    description: 'Obtiene todos los envíos asociados a un usuario específico, ordenados por fecha de creación descendente.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de envíos del usuario',
    type: [RespuestaEnvioDto]
  })
  @ApiResponse({ status: 404, description: 'Usuario sin envíos' })
  async findByUserId(@Param('userId') userId: string) {
    return this.deliveryService.findByUserId(userId);
  }

  /**
   * Buscar envío por número de tracking
   */
  @Get('tracking/:trackingNumber')
  @ApiOperation({ 
    summary: 'Buscar envío por número de tracking',
    description: 'Obtiene los detalles completos de un envío usando su número de seguimiento (tracking number).'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Envío encontrado',
    type: RespuestaEnvioDto
  })
  @ApiResponse({ status: 404, description: 'Envío no encontrado con ese número de tracking' })
  async findByTrackingNumber(@Param('trackingNumber') trackingNumber: string) {
    return this.deliveryService.findByTrackingNumber(trackingNumber);
  }

  /**
   * Actualizar envío por número de tracking
   * Ej: PATCH /deliveries/tracking/ENV-123456789
   */
  @Patch('tracking/:trackingNumber')
  @ApiOperation({ summary: 'Actualizar envío por número de tracking' })
  @ApiResponse({ status: 200, description: 'Envío actualizado' })
  @ApiResponse({ status: 404, description: 'Envío no encontrado' })
  updateByTracking(@Param('trackingNumber') trackingNumber: string, @Body() dto: UpdateDeliveryDto) {
    return this.deliveryService.updateByTrackingNumber(trackingNumber, dto);
  }


  @Get()
  @ApiOperation({ summary: 'Listar todos los envíos' })
  @ApiResponse({ status: 200, description: 'Lista de envíos' })
  findAll() {
    return this.deliveryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener envío por ID' })
  @ApiResponse({ status: 200, description: 'Envío encontrado' })
  @ApiResponse({ status: 404, description: 'Envío no encontrado' })
  findOne(@Param('id') id: string) {
    return this.deliveryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar envío' })
  @ApiResponse({ status: 200, description: 'Envío actualizado' })
  @ApiResponse({ status: 404, description: 'Envío no encontrado' })
  update(@Param('id') id: string, @Body() dto: UpdateDeliveryDto) {
    return this.deliveryService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar envío' })
  @ApiResponse({ status: 200, description: 'Envío eliminado' })
  remove(@Param('id') id: string) {
    return this.deliveryService.remove(id);
  }
}

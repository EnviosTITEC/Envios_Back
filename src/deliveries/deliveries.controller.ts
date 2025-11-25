import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { DeliveriesService as DeliveriesService } from './deliveries.service';
import { DeliveryDto } from '../contracts/delivery.dto';
import { CrearEnvioDesdePagoDto } from './dto/create-delivery-from-payment.dto';
import { CrearEnvioDirectoDto } from './dto/create-delivery-directly.dto';
import { RespuestaEnvioDto } from './dto/delivery-response.dto';

@ApiTags('deliveries')
@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveryService: DeliveriesService) {}

  /**
   * Webhook para crear envío cuando el pago se completa
   * Este endpoint será llamado por el microservicio de Pagos
   */
  @Post('create-from-payment')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Crear envío desde pago completado',
    description: 'Endpoint llamado automáticamente por el microservicio de Pagos cuando un pago se completa. Crea el envío con estado "Preparando" y genera el tracking number.'
  })
  @ApiBody({
    type: CrearEnvioDesdePagoDto,
    description: 'Datos del pago y envío',
    examples: {
      example1: {
        summary: 'Ejemplo completo',
        value: {
          paymentId: 'pay_abc123',
          cartId: 'cart_xyz789',
          userId: 'user_456',
          sellerId: 'seller_789',
          totalAmount: 950000,
          items: [
            {
              productId: 'prod_12345',
              name: 'iPhone 14 Pro 256GB',
              quantity: 1,
              price: 899990
            }
          ],
          package: {
            weight: 0.5,
            length: 20,
            width: 15,
            height: 10
          },
          shippingInfo: {
            originAddressId: 'addr_origin_123',
            destinationAddressId: 'addr_dest_456',
            carrierName: 'Chilexpress',
            serviceType: 'PRIORITARIO',
            estimatedCost: 8812
          },
          declaredWorth: 50000,
          notes: 'Entregar en horario de oficina'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Envío creado exitosamente',
    type: RespuestaEnvioDto,
    example: {
      trackingNumber: 'ENV-1734480000000-A3B7F9',
      status: 'Preparando',
      paymentId: 'pay_abc123',
      cartId: 'cart_xyz789',
      userId: 'user_456',
      sellerId: 'seller_789',
      carrierName: 'Chilexpress',
      serviceType: 'PRIORITARIO',
      estimatedCost: 8812,
      currency: 'CLP',
      originAddressId: 'addr_origin_123',
      destinationAddressId: 'addr_dest_456',
      items: [
        {
          productId: 'prod_12345',
          name: 'iPhone 14 Pro 256GB',
          quantity: 1,
          price: 899990
        }
      ],
      estimatedDeliveryDate: '2024-12-18T10:00:00Z',
      createdAt: '2024-12-17T15:30:00Z',
      message: 'Envío creado exitosamente. El vendedor ha sido notificado.'
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o envío ya existe para este pago' })
  @ApiResponse({ status: 500, description: 'Error al crear el envío' })
  async createFromPayment(@Body() dto: CrearEnvioDesdePagoDto): Promise<RespuestaEnvioDto> {
    return this.deliveryService.createFromPayment(dto);
  }

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
          userId: 'user_456',
          sellerId: 'seller_789',
          cartId: 'cart_xyz789',
          items: [
            {
              productId: 'prod_12345',
              name: 'iPhone 14 Pro 256GB',
              quantity: 1,
              price: 899990
            }
          ],
          package: {
            weight: 0.5,
            length: 20,
            width: 15,
            height: 10
          },
          shippingInfo: {
            originAddressId: 'addr_origin_123',
            destinationAddressId: 'addr_dest_456',
            carrierName: 'Chilexpress',
            serviceType: 'PRIORITARIO',
            estimatedCost: 8812
          },
          declaredWorth: 50000,
          notes: 'Entregar en horario de oficina'
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
  update(@Param('id') id: string, @Body() dto: DeliveryDto) {
    return this.deliveryService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar envío' })
  @ApiResponse({ status: 200, description: 'Envío eliminado' })
  remove(@Param('id') id: string) {
    return this.deliveryService.remove(id);
  }
}

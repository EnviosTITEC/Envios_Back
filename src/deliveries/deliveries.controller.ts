import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { DeliveriesService as DeliveriesService } from './deliveries.service';
import { DeliveryDto } from '../contracts/delivery.dto';
import { CreateDeliveryFromPaymentDto } from './dto/create-delivery-from-payment.dto';
import { DeliveryResponseDto } from './dto/delivery-response.dto';

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
    type: CreateDeliveryFromPaymentDto,
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
    type: DeliveryResponseDto,
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
  async createFromPayment(@Body() dto: CreateDeliveryFromPaymentDto): Promise<DeliveryResponseDto> {
    return this.deliveryService.createFromPayment(dto);
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

import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Delivery, DeliveryStatus } from './schemas/delivery.schema';
import { DeliveryDto } from '../contracts/delivery.dto';
import { CreateDeliveryFromPaymentDto } from './dto/create-delivery-from-payment.dto';
import { DeliveryResponseDto } from './dto/delivery-response.dto';

const ERROR_MSG = "Delivery not found."

@Injectable()
export class DeliveriesService {
  private readonly logger = new Logger(DeliveriesService.name);

  constructor(
    @InjectModel(Delivery.name) private deliveryModel: Model<Delivery>,
  ) {}

  /**
   * Genera un número de tracking único con formato: ENV-{timestamp}-{random}
   */
  private generateTrackingNumber(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ENV-${timestamp}-${random}`;
  }

  /**
   * Calcula fecha estimada de entrega según el tipo de servicio
   */
  private calculateEstimatedDelivery(serviceType: string): Date {
    const now = new Date();
    const daysToAdd = serviceType === 'PRIORITARIO' ? 1 : serviceType === 'EXPRESS' ? 2 : 3;
    now.setDate(now.getDate() + daysToAdd);
    return now;
  }

  /**
   * Crea un envío desde una notificación de pago completado
   * Endpoint llamado por el microservicio de Pagos
   */
  async createFromPayment(dto: CreateDeliveryFromPaymentDto): Promise<DeliveryResponseDto> {
    this.logger.log(`Creating delivery from payment: ${dto.paymentId}`);

    // Validar que no exista ya un envío para este pago
    const existingDelivery = await this.deliveryModel.findOne({ paymentId: dto.paymentId });
    if (existingDelivery) {
      throw new BadRequestException(`Delivery already exists for payment ${dto.paymentId}`);
    }

    // Generar tracking number único
    let trackingNumber = this.generateTrackingNumber();
    let attempts = 0;
    while (await this.deliveryModel.findOne({ trackingNumber })) {
      trackingNumber = this.generateTrackingNumber();
      attempts++;
      if (attempts > 10) {
        throw new BadRequestException('Unable to generate unique tracking number');
      }
    }

    // Calcular fecha estimada de entrega
    const estimatedDeliveryDate = this.calculateEstimatedDelivery(dto.shippingInfo.serviceType);

    // Calcular valor declarado (si no viene, usar monto total)
    const declaredWorth = dto.declaredWorth || dto.totalAmount;

    // Crear el envío
    const delivery = new this.deliveryModel({
      trackingNumber,
      status: DeliveryStatus.PREPARANDO,
      paymentId: dto.paymentId,
      cartId: dto.cartId,
      userId: dto.userId,
      sellerId: dto.sellerId,
      carrierId: dto.shippingInfo.carrierName.toLowerCase(),
      carrierName: dto.shippingInfo.carrierName,
      serviceType: dto.shippingInfo.serviceType,
      estimatedCost: dto.shippingInfo.estimatedCost,
      currency: 'CLP',
      originAddressId: dto.shippingInfo.originAddressId,
      destinationAddressId: dto.shippingInfo.destinationAddressId,
      weight: dto.package.weight,
      dimensions: {
        length: dto.package.length,
        width: dto.package.width,
        height: dto.package.height,
      },
      declaredWorth,
      fragile: false, // Por defecto, puede mejorarse
      items: dto.items,
      estimatedDeliveryDate,
      notes: dto.notes,
    });

    const saved = await delivery.save();

    // TODO: Notificar al vendedor (email/webhook)
    this.logger.log(`✉️ TODO: Notify seller ${dto.sellerId} about new shipment ${trackingNumber}`);
    // Aquí se integrará con el sistema de notificaciones
    // Ejemplo: await this.notificationsService.notifySeller(dto.sellerId, saved);

    this.logger.log(`Delivery created successfully: ${trackingNumber}`);

    return {
      trackingNumber: saved.trackingNumber,
      status: saved.status,
      paymentId: saved.paymentId,
      cartId: saved.cartId,
      userId: saved.userId,
      sellerId: saved.sellerId,
      carrierName: saved.carrierName,
      serviceType: saved.serviceType,
      estimatedCost: saved.estimatedCost,
      currency: saved.currency,
      originAddressId: saved.originAddressId,
      destinationAddressId: saved.destinationAddressId,
      items: saved.items,
      estimatedDeliveryDate: saved.estimatedDeliveryDate,
      createdAt: new Date(),
      message: 'Envío creado exitosamente. El vendedor ha sido notificado.',
    };
  }

  async create(dto: DeliveryDto) {
    const created = new this.deliveryModel(dto);
    return created.save();
  }

  async findAll() {
    const delivery = await this.deliveryModel.find().exec();
    if (!delivery) throw new NotFoundException(ERROR_MSG);
    return delivery
  }

  async findOne(id: string) {
    const delivery = await this.deliveryModel.findById(id).exec();
    if (!delivery) throw new NotFoundException(ERROR_MSG);
    return delivery
  }

  async update(id: string, dto: DeliveryDto) {
    const updated = await this.deliveryModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException(ERROR_MSG);
    return updated;
  }

  async remove(id: string) {
    return this.deliveryModel.findByIdAndDelete(id).exec();
  }
}

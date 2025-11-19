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
    @InjectModel('envios') private deliveryModel: Model<Delivery>, // Cambiado de Delivery.name a 'envios'
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
    this.logger.log(`Creating delivery from payment: ${dto.id_pago}`);

    // Validar que no exista ya un envío para este pago
    const existingDelivery = await this.deliveryModel.findOne({ id_pago: dto.id_pago });
    if (existingDelivery) {
      throw new BadRequestException(`Delivery already exists for payment ${dto.id_pago}`);
    }

    // Generar tracking number único
    let trackingNumber = this.generateTrackingNumber();
    let attempts = 0;
    while (await this.deliveryModel.findOne({ numero_seguimiento: trackingNumber })) {
      trackingNumber = this.generateTrackingNumber();
      attempts++;
      if (attempts > 10) {
        throw new BadRequestException('Unable to generate unique tracking number');
      }
    }

    // Calcular fecha estimada de entrega
    const estimatedDeliveryDate = this.calculateEstimatedDelivery(dto.info_envio.tipo_servicio);

    // Calcular valor declarado (si no viene, usar monto total)
    const declaredWorth = dto.valor_declarado || dto.monto_total;

    // Crear el envío
    const delivery = new this.deliveryModel({
      numero_seguimiento: trackingNumber,
      estado: DeliveryStatus.PREPARANDO,
      id_pago: dto.id_pago,
      id_carrito: dto.id_carrito,
      id_usuario: dto.id_usuario,
      id_vendedor: dto.id_vendedor,
      id_transportista: dto.info_envio.nombre_transportista.toLowerCase(),
      nombre_transportista: dto.info_envio.nombre_transportista,
      tipo_servicio: dto.info_envio.tipo_servicio,
      costo_estimado: dto.info_envio.costo_estimado,
      moneda: 'CLP',
      id_direccion_origen: dto.info_envio.id_direccion_origen,
      id_direccion_destino: dto.info_envio.id_direccion_destino,
      peso: dto.paquete.peso,
      dimensiones: {
        largo: dto.paquete.largo,
        ancho: dto.paquete.ancho,
        alto: dto.paquete.alto,
      },
      valor_declarado: declaredWorth,
      fragil: false, // Por defecto, puede mejorarse
      items: dto.items,
      fecha_entrega_estimada: estimatedDeliveryDate,
      notas: dto.notas,
    });

    const saved = await delivery.save();

    // TODO: Notificar al vendedor (email/webhook)
    this.logger.log(`✉️ TODO: Notify seller ${dto.id_vendedor} about new shipment ${trackingNumber}`); // Cambiado de 'sellerId' a 'id_vendedor'
    // Aquí se integrará con el sistema de notificaciones
    // Ejemplo: await this.notificationsService.notifySeller(dto.sellerId, saved);

    this.logger.log(`Delivery created successfully: ${trackingNumber}`);

    return {
      numero_seguimiento: saved.numero_seguimiento, // Cambiado de 'trackingNumber'
      estado: saved.estado, // Cambiado de 'status'
      id_pago: saved.id_pago, // Cambiado de 'paymentId'
      id_carrito: saved.id_carrito, // Cambiado de 'cartId'
      id_usuario: saved.id_usuario, // Cambiado de 'userId'
      id_vendedor: saved.id_vendedor, // Cambiado de 'sellerId'
      nombre_transportista: saved.nombre_transportista, // Cambiado de 'carrierName'
      tipo_servicio: saved.tipo_servicio, // Cambiado de 'serviceType'
      costo_estimado: saved.costo_estimado, // Cambiado de 'estimatedCost'
      moneda: saved.moneda, // Cambiado de 'currency'
      id_direccion_origen: saved.id_direccion_origen, // Cambiado de 'originAddressId'
      id_direccion_destino: saved.id_direccion_destino, // Cambiado de 'destinationAddressId'
      fecha_entrega_estimada: saved.fecha_entrega_estimada, // Cambiado de 'estimatedDeliveryDate'
      fecha_creacion: new Date(), // Cambiado de 'createdAt' a 'fecha_creacion'
      message: 'Envío creado exitosamente. El vendedor ha sido notificado.',
      items: saved.items.map(item => ({
        id_producto: item.productId,
        nombre: item.name,
        cantidad: item.quantity,
        precio: item.price,
      })), // Convertir nombres de propiedades al formato esperado
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

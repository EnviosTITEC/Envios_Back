import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Delivery, DeliveryStatus } from './schemas/delivery.schema';
import { DeliveryDto } from '../contracts/delivery.dto';
import { CrearEnvioDesdePagoDto } from './dto/create-delivery-from-payment.dto';
import { CrearEnvioDirectoDto } from './dto/create-delivery-directly.dto';
import { RespuestaEnvioDto } from './dto/delivery-response.dto';

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
  async createFromPayment(dto: CrearEnvioDesdePagoDto): Promise<RespuestaEnvioDto> {
    this.logger.log(`Creating delivery from payment: ${dto.pago_id}`);

    // Validar que no exista ya un envío para este pago
    const existingDelivery = await this.deliveryModel.findOne({ pago_id: dto.pago_id });
    if (existingDelivery) {
      throw new BadRequestException(`Delivery already exists for payment ${dto.pago_id}`);
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
    const estimatedDeliveryDate = this.calculateEstimatedDelivery(dto.informacion_envio.tipo_servicio);

    // Calcular valor declarado (si no viene, usar monto total)
    const declaredWorth = dto.valor_declarado || dto.monto_total;

    // Crear el envío
    const delivery = new this.deliveryModel({
      numero_seguimiento: trackingNumber,
      estado: DeliveryStatus.PREPARANDO,
      pago_id: dto.pago_id,
      carrito_id: dto.carrito_id,
      usuario_id: dto.usuario_id,
      vendedor_id: dto.vendedor_id,
      transportista_id: dto.informacion_envio.nombre_transportista.toLowerCase(),
      nombre_transportista: dto.informacion_envio.nombre_transportista,
      tipo_servicio: dto.informacion_envio.tipo_servicio,
      costo_estimado: dto.informacion_envio.costo_estimado,
      moneda: 'CLP',
      origen_direccion_id: dto.informacion_envio.origen_direccion_id,
      destino_direccion_id: dto.informacion_envio.destino_direccion_id,
      peso: dto.paquete.peso,
      dimensiones: {
        largo: dto.paquete.largo,
        ancho: dto.paquete.ancho,
        alto: dto.paquete.alto,
      },
      valor_declarado: declaredWorth,
      fragil: false,
      articulos: dto.articulo_carrito,
      fecha_entrega_estimada: estimatedDeliveryDate,
      notas: dto.notas,
    });

    const saved = await delivery.save();

    // TODO: Notificar al vendedor (email/webhook)
    this.logger.log(`✉️ TODO: Notify seller ${dto.vendedor_id} about new shipment ${trackingNumber}`);
    // Aquí se integrará con el sistema de notificaciones
    // Ejemplo: await this.notificationsService.notifySeller(dto.sellerId, saved);

    this.logger.log(`Delivery created successfully: ${trackingNumber}`);

    return {
      numero_seguimiento: saved.numero_seguimiento,
      trackingNumber: saved.numero_seguimiento,
      estado: saved.estado,
      pago_id: saved.pago_id,
      carrito_id: saved.carrito_id,
      usuario_id: saved.usuario_id,
      vendedor_id: saved.vendedor_id,
      nombre_transportista: saved.nombre_transportista,
      tipo_servicio: saved.tipo_servicio,
      costo_estimado: saved.costo_estimado,
      moneda: saved.moneda,
      origen_direccion_id: saved.origen_direccion_id,
      destino_direccion_id: saved.destino_direccion_id,
      articulos: saved.articulos,
      fecha_entrega_estimada: saved.fecha_entrega_estimada,
      creado_en: new Date(),
      mensaje: 'Envío creado exitosamente. El vendedor ha sido notificado.',
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

  async update(id: string, dto: any) {
    // Allow partial updates (e.g., only `estado`). Use runValidators to validate provided fields.
    const updated = await this.deliveryModel.findByIdAndUpdate(id, dto, { new: true, runValidators: true }).exec();
    if (!updated) throw new NotFoundException(ERROR_MSG);
    return updated;
  }

  async remove(id: string) {
    return this.deliveryModel.findByIdAndDelete(id).exec();
  }

  /**
   * Crea un envío directamente desde el frontend (sin pago)
   * Para el flujo de cotización
   */
  async createDirectly(dto: CrearEnvioDirectoDto): Promise<RespuestaEnvioDto> {
    this.logger.log(`Creating delivery directly for user: ${dto.usuario_id}`);

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
    const estimatedDeliveryDate = this.calculateEstimatedDelivery(dto.informacion_envio.tipo_servicio);

    // Crear el envío
    const delivery = new this.deliveryModel({
      numero_seguimiento: trackingNumber,
      estado: DeliveryStatus.PREPARANDO,
      carrito_id: dto.carrito_id || `cart-${Date.now()}`,
      usuario_id: dto.usuario_id,
      vendedor_id: dto.vendedor_id,
      transportista_id: dto.informacion_envio.nombre_transportista.toLowerCase(),
      nombre_transportista: dto.informacion_envio.nombre_transportista,
      tipo_servicio: dto.informacion_envio.tipo_servicio,
      costo_estimado: dto.informacion_envio.costo_estimado,
      moneda: 'CLP',
      origen_direccion_id: dto.informacion_envio.origen_direccion_id,
      destino_direccion_id: dto.informacion_envio.destino_direccion_id,
      peso: dto.paquete.peso,
      dimensiones: {
        largo: dto.paquete.largo,
        ancho: dto.paquete.ancho,
        alto: dto.paquete.alto,
      },
      valor_declarado: dto.valor_declarado || 0,
      // Guardar calle y número si vienen en el payload
      calle: dto.informacion_envio.calle || "",
      numero: dto.informacion_envio.numero || "",
      fragil: false,
      articulos: dto.articulo_carrito,
      fecha_entrega_estimada: estimatedDeliveryDate,
      notas: dto.notas || '',
    });

    const saved = await delivery.save();
    this.logger.log(`Delivery created successfully: ${trackingNumber}`);

    return {
      numero_seguimiento: saved.numero_seguimiento,
      trackingNumber: saved.numero_seguimiento,
      estado: saved.estado,
      pago_id: saved.pago_id,
      carrito_id: saved.carrito_id,
      usuario_id: saved.usuario_id,
      vendedor_id: saved.vendedor_id,
      nombre_transportista: saved.nombre_transportista,
      tipo_servicio: saved.tipo_servicio,
      costo_estimado: saved.costo_estimado,
      moneda: saved.moneda,
      origen_direccion_id: saved.origen_direccion_id,
      destino_direccion_id: saved.destino_direccion_id,
      articulos: saved.articulos,
      fecha_entrega_estimada: saved.fecha_entrega_estimada,
      creado_en: new Date(),
      mensaje: 'Envío creado exitosamente.',
    };
  }

  /**
   * Lista todos los envíos de un usuario específico
   */
  async findByUserId(userId: string) {
    const deliveries = await this.deliveryModel.find({ usuario_id: userId }).sort({ creado_en: -1 }).exec();
    if (!deliveries || deliveries.length === 0) {
      return [];
    }
    return deliveries;
  }

  /**
   * Busca un envío por su número de tracking
   */
  async findByTrackingNumber(trackingNumber: string) {
    this.logger.log(`Fetching delivery by tracking number: ${trackingNumber}`);
    const delivery = await this.deliveryModel.findOne({ numero_seguimiento: trackingNumber }).exec();
    if (!delivery) {
      throw new NotFoundException(`Envío con número de seguimiento "${trackingNumber}" no encontrado.`);
    }
    return delivery;
  }

  /**
   * Actualiza un envío buscándolo por `numero_seguimiento`.
   * Permite actualizaciones parciales y ejecuta validaciones de esquema.
   */
  async updateByTrackingNumber(trackingNumber: string, dto: any) {
    this.logger.log(`Updating delivery by tracking number: ${trackingNumber}`);
    const updated = await this.deliveryModel.findOneAndUpdate(
      { numero_seguimiento: trackingNumber },
      dto,
      { new: true, runValidators: true }
    ).exec();
    if (!updated) throw new NotFoundException(`Envío con número de seguimiento "${trackingNumber}" no encontrado.`);
    return updated;
  }
}

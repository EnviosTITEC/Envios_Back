import { Body, Controller, Post, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { QuoteRecord } from './quote-record.schema';
import { QuoteRecordService } from './quote-record.service';

@ApiTags('QuoteRecord')
@Controller('quotes/record')
export class QuoteRecordController {
  constructor(private readonly quoteRecordService: QuoteRecordService) {}

  @Post()
  @ApiOperation({ summary: 'Guardar un nuevo registro de cotización' })
  @ApiBody({
    description: 'Ejemplo de cotización',
    examples: {
      ejemplo1: {
        summary: 'Cotización completa',
        value: {
          "usuario_id": "user_456",
          "vendedor_id": "STGO",
          "carrito_id": "cart-1764552625892",
          "pago_id": "pendiente",
          "articulo_carrito": [
            { "producto_id": "prod_001", "nombre": "iPhone 14 Pro", "cantidad": 1, "precio": 899990 },
            { "producto_id": "prod_002", "nombre": "Samsung Galaxy S23", "cantidad": 1, "precio": 799990 },
            { "producto_id": "prod_003", "nombre": "AirPods Pro", "cantidad": 2, "precio": 299990 }
          ],
          "paquete": { "peso": 1.3, "largo": 22, "ancho": 16, "alto": 12 },
          "informacion_envio": {
            "origen_direccion_id": "STGO",
            "destino_direccion_id": "VINA",
            "nombre_transportista": "PRIORITARIO",
            "tipo_servicio": "PRIORITARIO",
            "costo_estimado": 10444,
            "calle": "TEST",
            "numero": "2232"
          },
          "valor_declarado": 2299960,
          "notas": "Creado desde frontend"
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Registro guardado', type: QuoteRecord })
  async save(@Body() body: any) {
    return this.quoteRecordService.saveQuoteRecord(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un registro de cotización por ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Registro encontrado', type: QuoteRecord })
  @ApiResponse({ status: 404, description: 'Registro no encontrado' })
  async findOne(@Param('id') id: string) {
    const record = await this.quoteRecordService.findById(id);
    if (!record) throw new NotFoundException('Quote record not found');
    return record;
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los registros de cotización' })
  @ApiResponse({ status: 200, description: 'Lista de registros', type: [QuoteRecord] })
  async findAll() {
    return this.quoteRecordService.findAll();
  }
}

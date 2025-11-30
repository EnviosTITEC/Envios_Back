import { Body, Controller, Post, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { QuoteRecord } from './quote-record.schema';
import { QuoteRecordService } from './quote-record.service';

@ApiTags('QuoteRecord')
@Controller('quotes/record')
export class QuoteRecordController {
  constructor(private readonly quoteRecordService: QuoteRecordService) {}

  @Post()
  @ApiOperation({ summary: 'Guardar un nuevo registro de cotización' })
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

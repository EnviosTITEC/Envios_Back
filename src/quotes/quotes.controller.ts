import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { QuotesService } from './quotes.service';
import { SolicitudCotizacionDto } from '../carriers/dto/quote-request.dto';
import { RespuestaCotizacionDto } from '../carriers/dto/quote-response.dto';

@ApiTags('Quotes')
@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  @ApiOperation({
    summary: 'Cotizar envío',
    description: 'Obtiene el costo de envío usando los datos proporcionados.'
  })
  @ApiBody({
    type: SolicitudCotizacionDto,
    examples: {
      'Ejemplo': {
        value: {
          originCountyCode: 'STGO',
          destinationCountyCode: 'PROV',
          package: {
            weight: '2.5',
            height: '15',
            width: '25',
            length: '35',
          },
          productType: 3,
          contentType: 1,
          declaredWorth: '25000',
          deliveryTime: 0,
        },
      },
    },
  })
  @ApiOkResponse({
    type: RespuestaCotizacionDto,
    description: 'Cotización exitosa con opciones de servicio',
  })
  async quote(@Body() dto: any): Promise<any> {
    return this.quotesService.quote(dto);
  }
}

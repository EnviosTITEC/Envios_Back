import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CreateCarrierDto } from './dto/create-carrier.dto';
import { UpdateCarrierDto } from './dto/update-carrier.dto';

@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly enviosService: DeliveriesService) {}

  // ----- DIRECCIONES -----
  @Post('addresses')
  createAddress(@Body() dto: CreateAddressDto) {
    return this.enviosService.createAddress(dto);
  }

  @Get('addresses')
  findAllAddresses(@Query('userId') userId: string) {
    return this.enviosService.findAllDirecciones(userId);
  }

  @Get('addresses/:id')
  findAddressById(@Param('id') id: string) {
    return this.enviosService.findAddressById(id);
  }

  @Patch('addresses/:id')
  updateAddress(@Param('id') id: string, @Body() dto: UpdateAddressDto) {
    return this.enviosService.updateAddress(id, dto);
  }

  @Delete('addresses/:id')
  deleteAddress(@Param('id') id: string) {
    return this.enviosService.deleteAddress(id);
  }

  // ----- TRANSPORTISTAS -----
  @Post('carriers')
  createCarrier(@Body() dto: CreateCarrierDto) {
    return this.enviosService.createCarrier(dto);
  }

  @Get('carriers')
  findAllCarriers() {
    return this.enviosService.findAllCarriers();
  }

  @Get('carriers/:id')
  findCarrierById(@Param('id') id: string) {
    return this.enviosService.findCarrierById(id);
  }

  @Patch('carriers/:id')
  updateCarrier(@Param('id') id: string, @Body() dto: UpdateCarrierDto) {
    return this.enviosService.updateCarrier(id, dto);
  }

  @Delete('carriers/:id')
  deleteCarrier(@Param('id') id: string) {
    return this.enviosService.deleteCarrier(id);
  }
}

import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CarriersService } from './carriers.service';
import { CreateCarrierDto } from './dto/create-carrier.dto';
import { UpdateCarrierDto } from './dto/update-carrier.dto';
import { DeliveryDto } from '../contracts/delivery.dto';

@Controller("carriers")
export class CarriersController {
  constructor(private readonly carriersService: CarriersService) {}

  @Post()
  createCarrier(@Body() dto: CreateCarrierDto) {
    return this.carriersService.createCarrier(dto);
  }

  @Get()
  findAllCarriers() {
    return this.carriersService.findAllCarriers();
  }

  @Get(':id')
  findCarrierById(@Param('id') id: string) {
    return this.carriersService.findCarrierById(id);
  }

  @Patch(':id')
  updateCarrier(@Param('id') id: string, @Body() dto: UpdateCarrierDto) {
    return this.carriersService.updateCarrier(id, dto);
  }

  @Delete(':id')
  deleteCarrier(@Param('id') id: string) {
    return this.carriersService.deleteCarrier(id);
  }

  @Post(':id/quote')
  async quoteCarrier(
    @Param('id') id: string,
    @Body() dto: DeliveryDto,
  ) {
    return this.carriersService.quoteCarrier(id, dto);
  }

  
}

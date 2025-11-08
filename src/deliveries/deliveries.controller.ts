import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DeliveriesService as DeliveriesService } from './deliveries.service';
import { DeliveryDto } from '../contracts/delivery.dto';

@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveryService: DeliveriesService) {}

  @Post()
  create(@Body() dto: DeliveryDto) {
    return this.deliveryService.create(dto);
  }

  @Get()
  findAll() {
    return this.deliveryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: DeliveryDto) {
    return this.deliveryService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliveryService.remove(id);
  }
}

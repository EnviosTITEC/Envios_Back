import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DeliveriesService as DeliveriesService } from './deliveries.service';
import { DeliveryDto } from '../contracts/delivery.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveryService: DeliveriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createDeliveryDto: DeliveryDto) {
    return this.deliveryService.create(createDeliveryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.deliveryService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveryService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCityDto: DeliveryDto) {
    return this.deliveryService.update(id, updateCityDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliveryService.remove(id);
  }
}

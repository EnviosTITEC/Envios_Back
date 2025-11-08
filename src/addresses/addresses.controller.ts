import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('address')
export class AddressesController {
  constructor(private readonly addressService: AddressesService) {}

  @Post('addresses')
  create(@Body() dto: CreateAddressDto) {
    return this.addressService.create(dto);
  }

  @Get('addresses')
  findAll(@Query('userId') userId: string) {
    return this.addressService.findAll(userId);
  }

  @Get('addresses/:id')
  findById(@Param('id') id: string) {
    return this.addressService.findById(id);
  }

  @Patch('addresses/:id')
  update(@Param('id') id: string, @Body() dto: UpdateAddressDto) {
    return this.addressService.update(id, dto);
  }

  @Delete('addresses/:id')
  delete(@Param('id') id: string) {
    return this.addressService.delete(id);
  }

  
}

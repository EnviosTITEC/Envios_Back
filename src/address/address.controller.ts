import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post('addresses')
  createAddress(@Body() dto: CreateAddressDto) {
    return this.addressService.createAddress(dto);
  }

  @Get('addresses')
  findAllAddresses(@Query('userId') userId: string) {
    return this.addressService.findAllAddress(userId);
  }

  @Get('addresses/:id')
  findAddressById(@Param('id') id: string) {
    return this.addressService.findAddressById(id);
  }

  @Patch('addresses/:id')
  updateAddress(@Param('id') id: string, @Body() dto: UpdateAddressDto) {
    return this.addressService.updateAddress(id, dto);
  }

  @Delete('addresses/:id')
  deleteAddress(@Param('id') id: string) {
    return this.addressService.deleteAddress(id);
  }

  
}

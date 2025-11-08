import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CitiesService as CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Controller('cities')
export class CitiesController {
  constructor(private readonly cityService: CitiesService) {}

  @Post()
  create(@Body() dto: CreateCityDto) {
    return this.cityService.create(dto);
  }

  @Get()
  findAll() {
    return this.cityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cityService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCityDto) {
    return this.cityService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cityService.remove(id);
  }
}

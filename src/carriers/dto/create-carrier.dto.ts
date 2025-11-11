import { IsNotEmpty, IsString, IsBoolean, IsJSON } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarrierDto {

  @ApiProperty({ required: true, example: "DHL" })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    required: true,
    example: {"X-API-AppKey": "Luke Skywalker", "X-API-AppToken": "R2D2"},
  })
  @IsJSON()
  @IsNotEmpty()
  credentials: JSON;

  @ApiProperty({ required: true, example: true })
  @IsBoolean()
  isActive: boolean;

}

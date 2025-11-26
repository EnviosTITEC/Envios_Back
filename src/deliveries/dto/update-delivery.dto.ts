import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { DeliveryStatus } from '../schemas/delivery.schema';

export class UpdateDeliveryDto {
  @ApiProperty({ enum: DeliveryStatus, description: 'Estado nuevo del envío' })
  @IsEnum(DeliveryStatus)
  @IsOptional()
  estado?: DeliveryStatus;
}

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

  @ApiProperty({ example: 'Juan', description: 'Nombre del usuario' })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellido del usuario' })
  @IsNotEmpty()
  @IsString()
  apellido: string;

  @ApiProperty({ example: 'juan.perez@example.com', description: 'Correo electrónico del usuario' })
  @IsNotEmpty()
  @IsEmail()
  correo: string;

  @ApiProperty({ example: '123456', description: 'Contraseña del usuario' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  contrasena: string;
}

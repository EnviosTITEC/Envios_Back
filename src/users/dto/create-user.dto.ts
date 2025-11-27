import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CrearUsuarioDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  apellido: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  correo: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  contrasena: string;
}

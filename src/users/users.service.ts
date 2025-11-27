// src/users/users.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { CrearUsuarioDto } from './dto/create-user.dto';
import { ActualizarUsuarioDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CrearUsuarioDto): Promise<UserDocument> {
    // Verificar si el correo ya existe
    const existingUser = await this.userModel.findOne({
      correo: createUserDto.correo,
    });
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.contrasena, salt);

    // Crear el nuevo usuario
    const newUser = new this.userModel({
      nombre: createUserDto.nombre,
      apellido: createUserDto.apellido,
      correo: createUserDto.correo,
      contrasena: hashedPassword,
    });

    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-contrasena').exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-contrasena').exec();
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ correo: email }).exec();
  }

  async update(id: string, updateUserDto: ActualizarUsuarioDto): Promise<User> {
    // Si hay una nueva contraseña, la hasheamos
    if ((updateUserDto as any).contrasena) {
      const salt = await bcrypt.genSalt();
      (updateUserDto as any).contrasena = await bcrypt.hash((updateUserDto as any).contrasena, salt);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto as any, { new: true })
      .select('-contrasena')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }
}

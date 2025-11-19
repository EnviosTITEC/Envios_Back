// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Para tener mejor tipado con MongoDB:
export interface UserDocument extends User, Document {
  id: string; // Mongoose crea un getter 'id' que devuelve el _id como string
}

@Schema({
  collection: 'usuarios', // Cambiado para cumplir con la nomenclatura
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_: any, ret: any) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class User {
  @Prop({ required: true })
  nombre: string; // Cambiado de 'name' a 'nombre'

  @Prop({ required: true })
  apellido: string; // Cambiado de 'lastName' a 'apellido'

  @Prop({ required: true, unique: true })
  correo: string; // Cambiado de 'email' a 'correo'

  @Prop({ required: true })
  contrasena: string; // Cambiado de 'password' a 'contrasena'

  @Prop({ default: 'usuario' }) // Cambiado de 'role' a 'rol'
  rol: string;

  @Prop({ default: true })
  activo: boolean; // Cambiado de 'isActive' a 'activo'
}

export const UserSchema = SchemaFactory.createForClass(User);

// Añadir un virtual 'id' para acceso más fácil al _id como string
UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

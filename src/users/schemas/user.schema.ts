// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Para tener mejor tipado con MongoDB:
export interface UserDocument extends User, Document {
  id: string; // Mongoose crea un getter 'id' que devuelve el _id como string
}

@Schema({
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
  nombre: string;

  @Prop({ required: true })
  apellido: string;

  @Prop({ required: true, unique: true })
  correo: string;

  @Prop({ required: true })
  contrasena: string;

  @Prop({ default: 'user' }) // 'admin' o 'user'
  rol: string;

  @Prop({ default: true })
  activo: boolean;

  // Compatibility getters/setters (TypeScript) to preserve original property names
  get name(): string {
    return (this as any).nombre;
  }
  set name(v: string) {
    (this as any).nombre = v;
  }

  get lastName(): string {
    return (this as any).apellido;
  }
  set lastName(v: string) {
    (this as any).apellido = v;
  }

  get email(): string {
    return (this as any).correo;
  }
  set email(v: string) {
    (this as any).correo = v;
  }

  get password(): string {
    return (this as any).contrasena;
  }
  set password(v: string) {
    (this as any).contrasena = v;
  }

  get role(): string {
    return (this as any).rol;
  }
  set role(v: string) {
    (this as any).rol = v;
  }

  get isActive(): boolean {
    return (this as any).activo;
  }
  set isActive(v: boolean) {
    (this as any).activo = v;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Añadir un virtual 'id' para acceso más fácil al _id como string
UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Virtuals English -> Spanish para compatibilidad con código existente
UserSchema.virtual('name')
  .get(function () {
    return this.nombre;
  })
  .set(function (v) {
    this.nombre = v;
  });

UserSchema.virtual('lastName')
  .get(function () {
    return this.apellido;
  })
  .set(function (v) {
    this.apellido = v;
  });

UserSchema.virtual('email')
  .get(function () {
    return this.correo;
  })
  .set(function (v) {
    this.correo = v;
  });

UserSchema.virtual('password')
  .get(function () {
    return this.contrasena;
  })
  .set(function (v) {
    this.contrasena = v;
  });

UserSchema.virtual('role')
  .get(function () {
    return this.rol;
  })
  .set(function (v) {
    this.rol = v;
  });

UserSchema.virtual('isActive')
  .get(function () {
    return this.activo;
  })
  .set(function (v) {
    this.activo = v;
  });

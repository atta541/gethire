import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/common/enums/role.enum';

@Schema({ timestamps: true })
export class User extends Document {

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: [String], enum: Role, default: [Role.Student] })
    roles: Role[];

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ required: true })
    city: string;

    @Prop({ required: true })
    country: string;

    @Prop({ required: true })
    phonenumber: string;


    @Prop()
    emailVerificationCode?: string;

    @Prop()
    emailVerified?: boolean;

    @Prop()
    emailVerificationCodeExpires?: Date;



}

export const UserSchema = SchemaFactory.createForClass(User);

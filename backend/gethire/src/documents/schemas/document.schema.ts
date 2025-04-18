import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Role } from 'src/common/enums/role.enum';

@Schema({ timestamps: true })
export class UserDocument extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  profilePictureUrl: string;

  @Prop({ required: true })
  publicId: string;

  @Prop({ required: true, enum: Role })
  uploadedBy: Role; 


}

export const DocumentSchema = SchemaFactory.createForClass(UserDocument);
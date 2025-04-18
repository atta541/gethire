import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class StudentProfile extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: Types.ObjectId;

  @Prop()
  university: string;

  @Prop()
  degree: string;

  @Prop()
  currentClass: string;

  @Prop()
  subjectsNeeded: string[];

  @Prop()
  availability: string; 
}

export const StudentProfileSchema = SchemaFactory.createForClass(StudentProfile);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class TeacherProfile extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: Types.ObjectId;

  @Prop()
  education: string;


  @Prop()
  experienceYears: number;

  @Prop()
  specialization: string[];

  @Prop()
  availableFor: string; 

  @Prop()
  hourlyRate: number;

  @Prop()
  subjectsTaught: string[];

  @Prop()
  bio: string;
}

export const TeacherProfileSchema = SchemaFactory.createForClass(TeacherProfile);

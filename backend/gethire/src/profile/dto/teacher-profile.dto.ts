import { IsMongoId, IsNotEmpty, IsOptional, IsString, IsNumber, IsArray } from 'class-validator';

export class CreateTeacherProfileDto {


  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsNumber()
  experienceYears?: number;

  @IsOptional()
  @IsString()
  specialization?: string[];

  @IsOptional()
  @IsString()
  availableFor?: string; 

  @IsOptional()
  @IsNumber()
  hourlyRate?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subjectsTaught?: string[];

  @IsOptional()
  @IsString()
  bio?: string;
}

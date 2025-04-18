import { IsMongoId, IsNotEmpty, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateStudentProfileDto {
 

  @IsOptional()
  @IsString()
  university?: string;

  @IsOptional()
  @IsString()
  degree?: string;

  @IsOptional()
  @IsString()
  currentClass?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  subjectsNeeded?: string[];

  @IsOptional()
  @IsString()
  availability?: string; 
}

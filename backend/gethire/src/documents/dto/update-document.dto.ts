import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateDocumentDto {

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    profilePictureUrl?: string;
    

    @IsString()
    @IsNotEmpty()
    title: string;  
  
    @IsString()
    @IsOptional()
    description?: string;  
  
    @IsString()
    @IsOptional()
    publicId?: string;
  }
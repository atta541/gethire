import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;


  @IsNotEmpty()
  @IsString() 
  firstName: string;


  @IsNotEmpty()
  @IsString() 
  lastName: string;


  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  country: string;


  @IsNotEmpty()
  @IsString()
  phonenumber: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;
}

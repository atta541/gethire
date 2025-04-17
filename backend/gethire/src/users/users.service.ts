import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/common/enums/role.enum';
import { MailService } from 'src/mail/mail.service';


@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>,
  private readonly mailService: MailService, 
) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUser) {
      throw new BadRequestException('Email is already registered, please use another one.');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return createdUser.save();
  }


  async findByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<User | undefined> {
    return this.userModel.findById(id);
  }


  // this method is used to update user profile
  // it will be used by the user itself, teacher and admin
  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.userModel.findByIdAndUpdate(userId, updateUserDto, { new: true });
  }
  
  // This method is used to find users by their role.
  // It takes a role as a parameter and returns an array of users with that role.
  async findUsersByRole(role: Role): Promise<Partial<User>[]> {
    try {
      if (!role || typeof role !== 'string') {
        throw new BadRequestException('Role must be a valid string.');
      }

      const normalizedRole = role.toLowerCase();

      const users = await this.userModel
        .find({ roles: normalizedRole })
        .select('firstName lastName email city country phonenumber')
        .exec();

      if (!users || users.length === 0) {
        throw new NotFoundException(`No users found with role: ${role}`);
      }

      return users;
    } catch (error) {
      console.error('Error finding users by role:', error);
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred while fetching users.');
    }
  }
  







  

 async sendEmailVerificationCode(email: string): Promise<void> {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User not found');

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    user.emailVerificationCode = code;
    user.emailVerificationCodeExpires = expiry;
    await user.save();

    await this.mailService.sendVerificationEmail(email, code);
  }
  
 


  async verifyEmailCode(email: string, code: string): Promise<boolean> {
    console.log('Verifying code for email:', email, 'with code:', code);
    const user = await this.userModel.findOne({ email });
  
    if (!user || !user.emailVerificationCode || !user.emailVerificationCodeExpires) {
      throw new BadRequestException('Invalid or expired verification code.');
    }
  
    const isCodeValid = user.emailVerificationCode === code;
    const isCodeExpired = new Date() > user.emailVerificationCodeExpires;
  
    if (!isCodeValid || isCodeExpired) {
      throw new BadRequestException('Invalid or expired verification code.');
    }
  
    // Optionally: clear the code after successful verification
    user.emailVerificationCode = undefined;
    user.emailVerificationCodeExpires = undefined;
    user.emailVerified = true; // Set emailVerified to true
    await user.save();
  
    return true;
  }
  
}

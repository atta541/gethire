import { Controller, Get, UseGuards, Request, Patch, Body, Query, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import * as crypto from 'crypto';



@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.Teacher, Role.Student)
  getProfile(@Request() req) {
    return "User profile: " + req.user.email;
  }

  @Get('admin-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  getAdminResource() {
    return 'This is for admins only';
  }


  @Get('teacher-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Teacher)
  getTeacherResource() {
    return 'This is for teachers only';
  }

  // this endpoint is for update user profile
  // it will be used by the user itself, teacher and admin
  @Patch('update')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.Teacher, Role.Student)
  async updateUser(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.updateUser(req.user.userId, updateUserDto);
    return {
      message: 'User updated successfully',
      user: updatedUser,
    };
  }

  // this endpoint is for admin to get users by role
  // it will be used by admin only
  @Get('by-role')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async getUsersByRole(@Query('role') role: Role) {
    if (!role) {
      throw new BadRequestException('Role is required');
    }

    return this.usersService.findUsersByRole(role);
  }




  @Patch('send-verification-code')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.Teacher, Role.Student)
  async sendVerificationCode(@Query('email') email: string) {
    console.log('Sending verification code to:email', email);
    await this.usersService.sendEmailVerificationCode(email);
    return { message: 'Verification code sent to email' };
  }



  @Patch('verify-code')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.Teacher, Role.Student)
  async verifyCode(
    @Query('email') email: string,
    @Query('code') code: string,
  ) {
    const result = await this.usersService.verifyEmailCode(email, code);
    return { message: 'Email verified successfully', result };
  }












}

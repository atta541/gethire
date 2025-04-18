import {
    Controller,
    Post,
    UseGuards,
    Request,
    Body,
    HttpException,
    HttpStatus,
    Get,
  } from '@nestjs/common';
  import { ProfileService } from './profile.service';
  import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
  import { RolesGuard } from 'src/auth/guards/roles.guards';
  import { Roles } from 'src/auth/decorators/roles.decorator';
  import { Role } from 'src/common/enums/role.enum';
  import { CreateStudentProfileDto } from './dto/student-profile.dto';
  import { CreateTeacherProfileDto } from './dto/teacher-profile.dto';
  
  @Controller('profile')
  export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}
  
    @Post('student-profile')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles( Role.Student)
    async createStudentProfile(
      @Request() req,
      @Body() createStudentProfileDto: CreateStudentProfileDto,
    ) {
      const updatedUser = await this.profileService.createStudentProfile(
        req.user.userId,
        createStudentProfileDto,
      );
      if (!updatedUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return {
        message: 'Student profile created successfully',
        user: updatedUser,
      };
    }
  
    @Post('teacher-profile')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Teacher) 
    async createTeacherProfile(
      @Request() req, 
      @Body() createTeacherProfileDto: CreateTeacherProfileDto,
    ) {
        console.log('Decoded User:', req.user); 

      const updatedUser = await this.profileService.createTeacherProfile(
        req.user.userId,
        createTeacherProfileDto,
      );
      if (!updatedUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return {
        message: 'Teacher profile created successfully',
        user: updatedUser,
      };
    }


    @Get('student-profile')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Student)
    async getStudentProfile(@Request() req) {
      const user = await this.profileService.getStudentProfile(req.user.userId);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return {
        message: 'Student profile fetched successfully',
        user: user,
      };
    }

    @Get('teacher-profile')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Teacher)
    async getTeacherProfile(@Request() req) {
      const user = await this.profileService.getTeacherProfile(req.user.userId);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return {
        message: 'Teacher profile fetched successfully',
        user: user,
      };
    }
  }
  

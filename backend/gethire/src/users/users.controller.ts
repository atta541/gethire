import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('users')
export class UsersController {
  
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin, Role.Teacher, Role.Student)
  getProfile(@Request() req) {
    return "User profile: " + req.user.city; 
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
}

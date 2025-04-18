import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStudentProfileDto } from './dto/student-profile.dto';
import { CreateTeacherProfileDto } from './dto/teacher-profile.dto';
import { StudentProfile } from './schemas/student-profile.schema';
import { TeacherProfile } from './schemas/teacher-profile.schema';
import { User } from 'src/users/schemas/user.schema'; 

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(StudentProfile.name)
    private readonly studentProfileModel: Model<StudentProfile>,

    @InjectModel(TeacherProfile.name)
    private readonly teacherProfileModel: Model<TeacherProfile>,

    @InjectModel('User') 
    private readonly userModel: Model<User>,
  ) {}

  async createStudentProfile(userId: string, dto: CreateStudentProfileDto) {
    const user = await this.userModel.findById(userId);
    if (!user) return null;

    const existing = await this.studentProfileModel.findOne({ user: userId });
    if (existing) return existing;

    const profile = new this.studentProfileModel({ ...dto, user: userId });
    return profile.save();
  }

  async createTeacherProfile(userId: string, dto: CreateTeacherProfileDto) {
    const user = await this.userModel.findById(userId);
    if (!user) return null;

    const existing = await this.teacherProfileModel.findOne({ user: userId });
    if (existing) return existing;

    const profile = new this.teacherProfileModel({ ...dto, user: userId });
    return profile.save();
  }

  async getStudentProfile(userId: string) {
    const profile = await this.studentProfileModel.findOne({ user: userId }).populate('user', 'name email');
    return profile;
  }


async getTeacherProfile(userId: string) {
    const profile = await this.teacherProfileModel.findOne({ user: userId }).populate('user', 'name email');
    return profile;
  }

}

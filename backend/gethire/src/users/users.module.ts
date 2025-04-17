import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { MailModule } from 'src/mail/mail.module';
import { MailService } from '../mail/mail.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MailModule
  ],
  providers: [UsersService,MailService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}

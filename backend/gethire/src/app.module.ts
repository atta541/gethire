import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { ProfileModule } from './profile/profile.module';
import { DocumentsModule } from './documents/documents.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/gethire', {
      connectionFactory: (connection) => {
        console.log('✅ Successfully connected to the database');
        return connection;
      },
    }),
    AuthModule,
    UsersModule,
    MailModule,
    ProfileModule,
    DocumentsModule,
  ],
})
export class AppModule {}

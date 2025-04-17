import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {

        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    async sendVerificationEmail(to: string, code: string): Promise<void> {
        const mailOptions = {
          from: `"Your App Name" <${process.env.EMAIL_USER}>`, // Corrected the from field
          to,
          subject: 'Your Verification Code',
          text: `Your verification code is: ${code}. It will expire in 5 minutes.`,
          html: `<p>Your verification code is: <b>${code}</b>. It will expire in 5 minutes.</p>`,
        };
      
        await this.transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
      }
      
}

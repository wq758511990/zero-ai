import { Global, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';

@Global()
@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.get('email_host'),
      port: this.configService.get('email_port'),
      secure: false,
      auth: {
        user: this.configService.get('email_user'),
        pass: this.configService.get('email_pass'),
      },
    });
  }

  async sendEmail({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }) {
    await this.transporter.sendMail({
      from: {
        name: '基础',
        address: this.configService.get('email_user'),
      },
      to,
      subject,
      html,
    });
  }
}

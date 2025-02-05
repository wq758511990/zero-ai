import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequireLogin, UserInfo } from 'src/custom.decorator';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { UserLoginDto } from './dto/user-login.dto';
import { RegisterUserDto } from './dto/user-register.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(RedisService)
  private readonly redisService: RedisService;


  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Inject(EmailService)
  private emailService: EmailService;

  @Get('register-mail')
  async registerMail(@Query('email') email: string) {
    const captchaKey = `register_captcha_${email}`;

    const code = Math.random().toString().slice(2, 8);

    await this.emailService.sendEmail({
      to: email,
      subject: '基础系统',
      html: `<p>欢迎注册基础系统，您的注册验证码：${code}</p>，有效时间5分钟`,
    });

    this.redisService.set(captchaKey, code);
    return 'done';
  }

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  @Post('login')
  async login(@Body() loginUser: UserLoginDto) {
    const user = await this.userService.login(loginUser);

    const token = this.jwtService.sign(
      {
        userId: user.id,
        username: user.username,
      },
      {
        expiresIn: '7d',
      },
    );

    return token;
  }

  @Get('info')
  @RequireLogin()
  async getUserInfo(@UserInfo('userId') userId: number) {
    const user = await this.userService.findByUserId(userId);
    return user;
  }
}

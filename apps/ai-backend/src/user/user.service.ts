import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { md5 } from 'src/utils';
import { UserLoginDto } from './dto/user-login.dto';
import { RegisterUserDto } from './dto/user-register.dto';

@Injectable()
export class UserService {
  @Inject(RedisService)
  private readonly redisService: RedisService;

  @Inject(PrismaService)
  private readonly prisma: PrismaService;

  async register(registerUser: RegisterUserDto) {
    const { email, username, password, captcha, nickname } = registerUser;
    const captchaKey = `register_captcha_${email}`;
    const code = await this.redisService.get(captchaKey);

    if (!code) {
      throw new BadRequestException('no captcha');
    }

    if (code !== captcha) {
      throw new BadRequestException('captcha error');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (user) {
      throw new BadRequestException('username has already existed');
    }

    return await this.prisma.user.create({
      data: {
        username,
        password: md5(password),
        email,
        nickname: nickname ?? '',
      },
      omit: {
        password: true,
      },
    });
  }

  async login(loginUser: UserLoginDto) {
    const { username, password } = loginUser;

    const foundUser = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (!foundUser) {
      throw new BadRequestException('user does not exist!');
    }

    if (md5(password) !== foundUser.password) {
      throw new BadRequestException('password is wrong!');
    }

    delete foundUser.password;

    return foundUser;
  }

  async findByUserId(userId: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      omit: {
        password: true,
      },
    });
  }
}

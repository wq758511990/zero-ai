import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from 'src/email/email.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('jwt_secret'),
          signOptions: {
            expiresIn: configService.get('jwt_expires_in'),
          },
        };
      },
    }),
    EmailModule,
    ChatModule
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }

import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

type RequestUser = {
  userId: number;
  username: string;
  permissions?: string[];
};

declare module 'express' {
  interface Request {
    user: RequestUser;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject()
  private reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const requireLogin = this.reflector.getAllAndOverride('required-login', [
      context.getClass(),
      context.getHandler(),
    ]);

    if (!requireLogin) {
      return true;
    }

    try {
      const authorization = request.headers['authorization'];
      const token = authorization?.split(' ')[1];
      const userInfo = this.jwtService.verify<RequestUser>(token);

      request.user = {
        userId: userInfo.userId,
        username: userInfo.username,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('用户未登录');
    }
  }
}

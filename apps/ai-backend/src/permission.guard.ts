import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const requiredPermissions: string[] = this.reflector.getAllAndOverride(
      'required-permissions',
      [context.getClass(), context.getHandler()],
    );

    if (!requiredPermissions) {
      return true;
    }

    const userPermissions = request.user.permissions ?? [];

    if (!requiredPermissions.some((item) => userPermissions.includes(item))) {
      throw new UnauthorizedException('当前用户没有权限');
    }

    return true;
  }
}

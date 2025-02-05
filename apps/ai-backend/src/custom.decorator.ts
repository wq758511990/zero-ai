import {
  SetMetadata,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { Request } from 'express';

export const RequireLogin = () => SetMetadata('required-login', true);

export const Permission = (...permissions) =>
  SetMetadata('required-permissions', permissions);

export const RequirePermissions = (...permissions) =>
  applyDecorators(RequireLogin(), Permission(...permissions));

export const UserInfo = createParamDecorator(
  (data, ctx: ExecutionContextHost) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const userInfo = request.user;

    return data ? userInfo?.[data] : userInfo;
  },
);

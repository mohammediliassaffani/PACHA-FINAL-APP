import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from './types';
import { SetMetadata } from '@nestjs/common';

type rfTokenPayload = JwtPayload & { refreshToken: string };

export const Public = () => SetMetadata('isPublic', true);

export const GetCurrentUser = createParamDecorator(
  (data: keyof rfTokenPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);

export const Roles = (...roles: string[]) => SetMetadata('role', roles);

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return user.sub;
  },
);

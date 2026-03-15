import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '../guards/auth/auth.guard';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    const user = request.user;
    return user;
  },
);

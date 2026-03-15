import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../../decorators/public.decorator';
import { UserRole } from 'src/types/enums';
import { CookieNames } from 'src/auth/constants/cookie.constants';

export interface JwtPayload {
  id: string;
  name: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user: JwtPayload;
  cookies: Record<string, string>;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}
  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthRequest>();
    const token = request.cookies?.[CookieNames.AUTH];
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}

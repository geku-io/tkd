import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, type Response } from 'express';
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
export class RefreshGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const response = context.switchToHttp().getResponse<Response>();
    const token = request.cookies?.[CookieNames.REFRESH];
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      request['user'] = payload;
    } catch {
      response.clearCookie(CookieNames.AUTH);
      response.clearCookie(CookieNames.REFRESH);
      throw new UnauthorizedException();
    }
    return true;
  }
}

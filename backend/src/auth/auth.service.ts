import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { AuthRequest, JwtPayload } from './guards/auth/auth.guard';
import authConfigEnv from 'src/config/auth.config';
import appConfigEnv from 'src/config/app.config';
import { CookieNames } from './constants/cookie.constants';
import { type ConfigType } from '@nestjs/config';
import { type Response } from 'express';
import { LoginDto } from 'src/common/dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(authConfigEnv.KEY)
    private authConfig: ConfigType<typeof authConfigEnv>,
    @Inject(appConfigEnv.KEY)
    private appConfig: ConfigType<typeof appConfigEnv>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userInfo: LoginDto, res: Response) {
    const user = await this.usersService.findOne(userInfo.name);
    if (user) {
      const isPassMatch = await bcrypt.compare(
        userInfo.password,
        user.password,
      );

      if (isPassMatch) {
        const payload: JwtPayload = {
          id: user.id,
          name: user.name,
          role: user.role,
        };

        const { refresh_token } = this.generateTokens(payload, res);

        await this.usersService.update(user.id, { refresh_token });

        return payload;
      }
    }
    throw new UnauthorizedException();
  }

  generateTokens(payload: JwtPayload, res: Response) {
    const accessExpiration = parseInt(this.authConfig.accessExpires as string);
    const refreshExpiration = parseInt(
      this.authConfig.refreshExpires as string,
    );

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: `${accessExpiration}ms`,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: `${refreshExpiration}ms`,
    });

    res.cookie(CookieNames.AUTH, accessToken, {
      secure: this.appConfig.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true,
      path: '/',
    });

    res.cookie(CookieNames.REFRESH, refreshToken, {
      secure: this.appConfig.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true,
      path: '/',
    });
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refresh(request: AuthRequest, response: Response) {
    const user = await this.usersService.findById(request.user.id);

    const cookieRefreshToken = request.cookies?.[CookieNames.REFRESH];
    const payload =
      await this.jwtService.verifyAsync<JwtPayload>(cookieRefreshToken);

    const refreshTokenMatches = user?.refresh_token === cookieRefreshToken;
    if (!refreshTokenMatches) {
      response.clearCookie(CookieNames.AUTH);
      response.clearCookie(CookieNames.REFRESH);
      throw new UnauthorizedException();
    }

    const { refresh_token } = this.generateTokens(
      {
        id: user.id,
        name: user.name,
        role: user.role,
      },
      response,
    );

    await this.usersService.update(user.id, { refresh_token });

    return payload;
  }

  validateToken(request: AuthRequest) {
    const accessToken = request.cookies?.[CookieNames.AUTH];
    const refreshToken = request.cookies?.[CookieNames.REFRESH];
    console.log('access: ', accessToken);
    console.log('refresh: ', refreshToken);
    let payload: JwtPayload | null = null;
    try {
      if (accessToken) {
        payload = this.jwtService.verify<JwtPayload>(accessToken);
      }
    } catch {
      if (refreshToken) {
        payload = this.jwtService.verify<JwtPayload>(refreshToken);
      } else {
        throw new UnauthorizedException();
      }
    }
    return payload;
  }

  async logout(userId: string, res: Response) {
    await this.usersService.update(userId, { refresh_token: null });
    res.clearCookie(CookieNames.AUTH, { path: '/' });
    res.clearCookie(CookieNames.REFRESH, { path: '/' });
    return { id: userId };
  }
}

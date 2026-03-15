import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import type { Response } from 'express';
import { CurrentUser } from './decorators/currentUser.decorator';
import type { AuthRequest, JwtPayload } from './guards/auth/auth.guard';
import { RefreshGuard } from './guards/auth/refresh.guard';
import { LoginDto } from 'src/common/dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Get('validate')
  validateToken(@Req() req: AuthRequest) {
    return this.authService.validateToken(req);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(
    @Body(ValidationPipe) loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginDto, res);
  }

  @Public()
  @UseGuards(RefreshGuard)
  @Post('refresh')
  refresh(@Req() req: AuthRequest, @Res({ passthrough: true }) res: Response) {
    return this.authService.refresh(req, res);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.logout(user.id, res);
  }
}

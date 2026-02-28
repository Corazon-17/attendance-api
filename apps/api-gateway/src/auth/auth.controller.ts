import { LoginDto } from '@app/shared/auth/dto/auth.dto';
import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import type { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('login')
  @Public()
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const jwt = await firstValueFrom(
      this.authClient.send({ cmd: 'login' }, dto),
    );

    res.cookie('refresh_token', jwt.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'lax',
      maxAge: Number(process.env.REFRESH_TOKEN_TTL_SEC) * 1000,
    });

    return {
      access_token: jwt.access_token,
    };
  }

  @Post('refresh')
  @Public()
  async refresh(@Req() req: Request) {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      throw new RpcException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'No refresh token',
      });
    }
    return firstValueFrom(
      this.authClient.send({ cmd: 'refresh-token' }, refreshToken),
    );
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user; // from JwtGuard

    await firstValueFrom(this.authClient.send({ cmd: 'logout' }, {}));
    res.clearCookie('refresh_token');

    return { message: 'Logged out successfully' };
  }
}

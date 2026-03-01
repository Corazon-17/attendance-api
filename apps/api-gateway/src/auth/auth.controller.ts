import { LoginDto } from '@app/shared/auth/dto/auth.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
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
  @HttpCode(HttpStatus.OK)
  @Public()
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const jwt = await firstValueFrom(
      this.authClient.send({ cmd: 'login' }, dto),
    );

    res.cookie('refreshToken', jwt.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'lax',
      maxAge: Number(process.env.REFRESH_TOKEN_TTL_SEC) * 1000,
    });

    return {
      accessToken: jwt.accessToken,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @Public()
  async refresh(@Req() req: Request) {
    const refreshToken = req.cookies['refreshToken'];

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
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    const userId = req.user.id;

    await firstValueFrom(this.authClient.send({ cmd: 'logout' }, {}));
    res.clearCookie('refreshToken');

    return { message: 'Logged out successfully' };
  }

  @Get('/me')
  me(@Req() req) {
    const user = req.user.id;
    return firstValueFrom(this.authClient.send({ cmd: 'me' }, user?.id));
  }
}

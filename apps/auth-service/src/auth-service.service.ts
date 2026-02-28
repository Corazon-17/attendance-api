import { LoginDto } from '@app/shared/auth/dto/auth.dto';
import { JWTPayload } from '@app/shared/jwt/jwt.type';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PasswordService } from 'libs/security/password.service';
import { firstValueFrom } from 'rxjs';
import { JwtTokenService } from './jwt/jwt.service';
import { RedisService } from './redis/redis.service';

@Injectable()
export class AuthServiceService {
  constructor(
    @Inject('USER_SERVICE') private readonly usersClient: ClientProxy,
    private readonly jwtService: JwtTokenService,
    private readonly redisService: RedisService,
    private readonly password: PasswordService,
  ) {}

  async login(dto: LoginDto) {
    const user = await firstValueFrom(
      this.usersClient.send({ cmd: 'get-user-by-email' }, { email: dto.email }),
    );
    if (!user) {
      throw new RpcException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid credentials',
      });
    }

    const isPasswordValid = await this.password.compare(
      dto.password,
      user.password as string,
    );
    if (!isPasswordValid) {
      throw new RpcException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid credentials',
      });
    }

    const payload: JWTPayload = {
      id: user.id,
      name: user.name,
      position: user.position.name,
    };

    const accessToken = this.jwtService.generateAccessToken(payload);
    const refreshToken = this.jwtService.generateRefreshToken(payload);

    await this.redisService.set(
      `refresh:${user.id}`,
      refreshToken,
      Number(process.env.REFRESH_TOKEN_TTL_SEC),
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verifyToken(token);

      const userId = payload.id;
      const storedToken = await this.redisService.get(`refresh:${userId}`);

      if (!storedToken || storedToken !== token) {
        throw new RpcException({
          statusCode: 401,
          message: 'Invalid refresh token',
        });
      }

      const newAccessToken = this.jwtService.generateAccessToken({
        id: payload.id,
        name: payload.name,
        position: payload.position,
      });

      return {
        access_token: newAccessToken,
      };
    } catch (err) {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid or expired refresh token',
      });
    }
  }

  async logout(userId: string) {
    await this.redisService.del(`refresh:${userId}`);
  }
}

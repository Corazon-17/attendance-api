import { JWTPayload } from '@app/shared/jwt/jwt.type';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: JWTPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: Number(process.env.ACCESS_TOKEN_TTL_SEC),
    });
  }

  generateRefreshToken(payload: JWTPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: Number(process.env.REFRESH_TOKEN_TTL_SEC),
    });
  }

  verifyToken(token: string): JWTPayload {
    return this.jwtService.verify(token);
  }
}

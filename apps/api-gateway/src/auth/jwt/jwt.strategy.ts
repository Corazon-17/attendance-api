import { JWTPayload } from '@app/shared/jwt/jwt.type';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: JwtStrategy.extractJwt,
      secretOrKey: process.env.JWT_SECRET || 'supersecret',
    });
  }

  private static extractJwt = (req: Request): string | null => {
    const tokenFromHeader = req.headers['authorization']?.split(' ')[1];
    const tokenFromCookie = req.cookies['accessToken'];
    return tokenFromHeader || tokenFromCookie || null;
  };

  validate(payload: JWTPayload): JWTPayload {
    return {
      id: payload.id,
      name: payload.name,
      position: payload.position,
    };
  }
}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PasswordService } from 'libs/security/password.service';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
import { JwtTokenService } from './jwt/jwt.service';
import { RedisService } from './redis/redis.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.HOST,
          port: Number(process.env.USER_SERVICE_PORT),
        },
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecret',
    }),
  ],
  controllers: [AuthServiceController],
  providers: [
    AuthServiceService,
    JwtTokenService,
    RedisService,
    PasswordService,
  ],
})
export class AuthServiceModule {}

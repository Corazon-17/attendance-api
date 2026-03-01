import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from 'apps/api-gateway/src/auth/jwt/jwt.guard';
import { JwtStrategy } from 'apps/api-gateway/src/auth/jwt/jwt.strategy';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationServiceService } from './notification-service.service';
import { NotificationServiceListener } from './notification.listener';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecret',
    }),
  ],
  controllers: [NotificationServiceController, NotificationServiceListener],
  providers: [
    NotificationServiceService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class NotificationServiceModule {}

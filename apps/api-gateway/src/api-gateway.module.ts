import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PassportModule } from '@nestjs/passport';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { AttendanceController } from './attendance/attendance.controller';
import { AuthController } from './auth/auth.controller';
import { JwtAuthGuard } from './auth/jwt/jwt.guard';
import { JwtStrategy } from './auth/jwt/jwt.strategy';
import { UsersController } from './users/user.controller';

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
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.HOST,
          port: Number(process.env.AUTH_SERVICE_PORT),
        },
      },
    ]),
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
    ClientsModule.register([
      {
        name: 'ATTENDANCE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.HOST,
          port: Number(process.env.ATTENDANCE_SERVICE_PORT),
        },
      },
    ]),
  ],
  controllers: [
    ApiGatewayController,
    UsersController,
    AuthController,
    AttendanceController,
  ],
  providers: [
    ApiGatewayService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class ApiGatewayModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AttendanceServiceController } from './attendance-service.controller';
import { AttendanceService } from './attendance-service.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
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
  ],
  controllers: [AttendanceServiceController],
  providers: [AttendanceService],
})
export class AttendanceServiceModule {}

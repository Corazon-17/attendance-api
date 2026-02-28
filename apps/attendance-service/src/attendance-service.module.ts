import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
  ],
  controllers: [AttendanceServiceController],
  providers: [AttendanceService],
})
export class AttendanceServiceModule {}

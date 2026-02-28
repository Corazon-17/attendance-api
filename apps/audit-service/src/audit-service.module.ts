import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuditServiceController } from './audit-service.controller';
import { AuditServiceService } from './audit-service.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
  ],
  controllers: [AuditServiceController],
  providers: [AuditServiceService],
})
export class AuditServiceModule {}

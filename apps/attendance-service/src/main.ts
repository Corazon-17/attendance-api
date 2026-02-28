import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AttendanceServiceModule } from './attendance-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AttendanceServiceModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.HOST,
      port: process.env.ATTENDANCE_SERVICE_PORT,
    },
  });

  await app.listen();
}
bootstrap();

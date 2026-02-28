import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { UserServiceModule } from './user-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(UserServiceModule, {
    transport: Transport.TCP,
    options: { host: process.env.HOST, port: process.env.USER_SERVICE_PORT },
  });
  await app.listen();
}
bootstrap();

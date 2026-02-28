import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AuthServiceModule } from './auth-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AuthServiceModule, {
    transport: Transport.TCP,
    options: { host: process.env.HOST, port: process.env.AUTH_SERVICE_PORT },
  });
  await app.listen();
}
bootstrap();

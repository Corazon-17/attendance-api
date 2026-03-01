import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import cookieParser from 'cookie-parser';
import { NotificationServiceModule } from './notification-service.module';

async function bootstrap() {
  const amqpUrl = `amqp://${process.env.HOST}:${process.env.AMQP_PORT}`;
  const app = await NestFactory.create(NotificationServiceModule);

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [amqpUrl],
      queue: 'notification_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(Number(process.env.NOTIFICATION_SERVICE_PORT));
}
bootstrap();

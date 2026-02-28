import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AuditServiceModule } from './audit-service.module';

async function bootstrap() {
  const amqpUrl = `amqp://${process.env.HOST}:${process.env.AMQP_PORT}`;
  const app = await NestFactory.createMicroservice(AuditServiceModule, {
    transport: Transport.RMQ,
    options: {
      urls: [amqpUrl],
      queue: 'audit_queue',
      queueOptions: { durable: true },
    },
  });
  await app.listen();
}
bootstrap();

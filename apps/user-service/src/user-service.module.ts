import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PasswordService } from 'libs/security/password.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserServiceController } from './user-service.controller';
import { UsersService } from './user-service.service';

const amqpUrl = `amqp://${process.env.HOST}:${process.env.AMQP_PORT}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    ClientsModule.register([
      {
        name: 'AUDIT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [amqpUrl],
          queue: 'audit_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [amqpUrl],
          queue: 'notification_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [UserServiceController],
  providers: [UsersService, PasswordService],
})
export class UserServiceModule {}

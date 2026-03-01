import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.use(cookieParser());

  app.enableCors({
    origin: process.env.CORS_ORIGIN, // Frontend URL
    credentials: true,
  });

  await app.listen(Number(process.env.API_GATEWAY_PORT));
}
bootstrap();

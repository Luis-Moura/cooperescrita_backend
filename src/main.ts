import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não definidas nos DTOs
      forbidNonWhitelisted: true, // Retorna erro se propriedades não definidas nos DTOs forem enviadas
      stopAtFirstError: true, // Retorna erro se a primeira propriedade não for válida
      transform: true, // Transforma os dados recebidos para o tipo esperado
    }),
  );

  app.enableCors(); // Habilita o CORS globalmente

  await app.listen(process.env.PORT);
}
bootstrap();

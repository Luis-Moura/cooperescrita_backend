import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('aplicação cooperescrita backend')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(process.env.PORT);
}
bootstrap();

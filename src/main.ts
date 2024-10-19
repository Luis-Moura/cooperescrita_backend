import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as hbs from 'hbs';
import { ValidationPipe } from '@nestjs/common';

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

  app.setBaseViewsDir(join(__dirname, './', 'views'));
  app.setViewEngine('hbs');
  hbs.registerPartials(join(__dirname, './', 'views/partials'));

  await app.listen(3000);
}
bootstrap();

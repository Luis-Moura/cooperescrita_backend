import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
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

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", 'trusted-scripts.com'],
          styleSrc: ["'self'", 'trusted-styles.com'],
        },
      },
      referrerPolicy: { policy: 'no-referrer' },
      frameguard: { action: 'deny' }, // Bloqueia iframes externos
    }),
  );

  app.useLogger(new Logger());

  // Substituir o app.enableCors() por:
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? [process.env.BASE_URL_FRONTEND, process.env.BASE_URL_FRONTEND_2]
        : true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

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

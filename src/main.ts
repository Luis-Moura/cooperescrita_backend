import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ====================
  // 🚀 Middlewares Globais
  // ====================

  // 🔍 Validações Globais
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
      transform: true,
    }),
  );

  // 🛡️ Segurança com Helmet
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
      frameguard: { action: 'deny' },
    }),
  );

  // 📦 Compressão para performance
  app.use(
    compression({
      level: 6,
      threshold: 1024,
      filter: (req, res) => {
        if (req.headers['x-no-compression']) return false;
        return compression.filter(req, res);
      },
    }),
  );

  // ====================
  // 🔥 Configurações Essenciais
  // ====================

  // 🎯 Logger
  app.useLogger(new Logger());

  // 🌍 CORS (Cross-Origin Resource Sharing)
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? [process.env.BASE_URL_FRONTEND, process.env.BASE_URL_FRONTEND_2]
        : true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // ====================
  // 🛠️ Swagger (Documentação)
  // ====================
  if (process.env.NODE_ENV === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Aplicação Cooperescrita Backend')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  // 🚀 Inicializa o servidor
  await app.listen(process.env.PORT);
  Logger.log(
    `\n\n🚀 Server rodando em http://localhost:${process.env.PORT}\n\n`,
  );
}

bootstrap();

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import * as express from 'express';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
//import './utils/backup.cron';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });
  const logger = new Logger('Bootstrap');
  app.use(cookieParser());
  app.use(express.json());

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? [
      'http://localhost:5173',
      'http://localhost:8000',
    ],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Genigma API')
    .setDescription(
      `
      # RiddleMind API Documentation

      Інтелектуальна платформа для генерації логічних загадок (Данеток) за допомогою Gemini AI.

      ## Ключові особливості:
      - 🧠 **AI Riddle Generation**: Генерація загадок з дивними ситуаціями та логічними розв'язками.
      - 👤 **Seamless Auth**: Автоматичне створення анонімного профілю при першому запиті (через Cookies).
      - 🌍 **Multi-language**: Підтримка генерації на різних мовах.
      - 💬 **Social Interactions**: Можливість коментувати та лайкати загадки.
      - 📜 **Prompt Management**: Гнучке керування шаблонами промптів для ШІ.

      ## Аутентифікація:
      Система використовує **HttpOnly Cookies** для автоматичної авторизації.
      Для ручного тестування можна використовувати JWT токен у заголовку:
      \`Authorization: Bearer <token>\`
    `,
    )
    .setVersion('1.0.0')
    .setContact('RiddleMind Support', 'https://riddlemind.app', 'support@riddlemind.app')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Введіть JWT токен (якщо не використовуєте Cookies)',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Керування доступом та анонімні сесії')
    .addTag('Riddles', 'Генерація, перегляд та управління загадками')
    .addTag('Feed', 'Публічна стрічка та discovery')
    .addTag('Interactions', 'Лайки та коментарі користувачів')
    .addTag('Prompts', 'Адміністрування AI шаблонів')
    .addTag('Users', 'Профілі та налаштування користувачів')
    .addServer(`http://localhost:${process.env.PORT ?? 8000}`, 'Local Development')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory, {
    customSiteTitle: 'Genigma API Documentation',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: ['https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 8000);
  logger.log(`🚀 Server is running on http://localhost:${process.env.PORT ?? 8000}`);
  logger.log(
    `📚 Swagger documentation available at http://localhost:${process.env.PORT ?? 8000}/api-docs`,
  );
}

void bootstrap();

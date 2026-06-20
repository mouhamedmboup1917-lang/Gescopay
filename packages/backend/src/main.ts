import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3001);
  const isDev = configService.get<string>('NODE_ENV') !== 'production';

  // Security
  app.use(helmet({
    crossOriginEmbedderPolicy: false,
  }));

  // Compression
  app.use(compression());

  // CORS
  app.enableCors({
    origin: configService.get<string>('ALLOWED_ORIGINS', 'http://localhost:8081').split(','),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger (dev only)
  if (isDev) {
    const config = new DocumentBuilder()
      .setTitle('GescoPay API')
      .setDescription('GescoPay – One App. One QR. Every Wallet. REST API Documentation')
      .setVersion('1.0.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'JWT', in: 'header' },
        'JWT-auth',
      )
      .addTag('auth', 'Authentication & Authorization')
      .addTag('users', 'User Management')
      .addTag('wallets', 'Wallet Aggregation')
      .addTag('transactions', 'Transaction Management')
      .addTag('cards', 'Virtual Card Management')
      .addTag('qr', 'QR Code Operations')
      .addTag('merchants', 'Merchant Platform')
      .addTag('invoices', 'Invoice Management')
      .addTag('settlements', 'Settlement Management')
      .addTag('notifications', 'Notification System')
      .addTag('support', 'Support Center')
      .addTag('admin', 'Admin Operations')
      .addServer(`http://localhost:${port}`, 'Local Development')
      .addServer('https://api.gescopay.com', 'Production')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
    logger.log(`📚 Swagger docs available at http://localhost:${port}/api/docs`);
  }

  await app.listen(port);
  logger.log(`🚀 GescoPay API running on http://localhost:${port}/api/v1`);
  logger.log(`🌍 Environment: ${configService.get('NODE_ENV', 'development')}`);
}

bootstrap().catch((err) => {
  console.error('Failed to start GescoPay API:', err);
  process.exit(1);
});

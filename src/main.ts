import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { readFile } from 'fs/promises';
import { SwaggerModule } from '@nestjs/swagger';
import { resolve } from 'path';
import { parse } from 'yaml';
import { ValidationPipe } from '@nestjs/common';
import { LoggingService } from 'src/logging.service';
import { AllExceptionsFilter } from 'src/exception.filter';
import { LoggingInterceptor } from 'src/logging.intercepter';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(LoggingService);

  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.useGlobalFilters(new AllExceptionsFilter(logger));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const swaggerPath = resolve('doc', 'api.yaml');
  const swaggerFile = await readFile(swaggerPath, 'utf-8');
  SwaggerModule.setup('doc', app, parse(swaggerFile));

  const configService = app.get(ConfigService);
  let port = parseInt(configService.get('APP_PORT'), 10);
  const alternativePort = 4000;

  if (!port) {
    port = alternativePort;
    logger.error(
      `Cannot start app with the port from .env file.
      Port ${port} was used`,
    );
  }

  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}\n${err.stack}`);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Rejection: ${reason}`);
  });

  logger.log('Starting app on port: ' + port);
  await app.listen(port);
}
bootstrap();

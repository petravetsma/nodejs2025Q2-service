import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { readFile } from 'fs/promises';
import { SwaggerModule } from '@nestjs/swagger';
import { resolve } from 'path';
import { parse } from 'yaml';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { LoggingService } from 'src/logging.service';
import { IncomingMessage, ServerResponse } from 'http';
import { AllExceptionsFilter } from 'src/exception.filter';
import { parse as parseUrl } from 'url';
import { parse as parseQuery } from 'querystring';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(LoggingService);

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
    console.error(
      `Cannot start app with the port from .env file.
      Port ${port} was used`,
    );
  }
  console.log('Starting app on port: ' + port);

  const httpAdapter = app.getHttpAdapter();

  httpAdapter
    .getInstance()
    .on('request', (req: IncomingMessage, res: ServerResponse) => {
      console.log('request pn')
      const chunks: Buffer[] = [];
      req.on('data', (chunk) => chunks.push(chunk));

      req.on('end', () => {
        const method = req.method;
        const url = req.url || '';

        // Парсим query параметры
        const { query } = parseUrl(url);
        const queryParams = parseQuery(query || '');

        const body = Buffer.concat(chunks).toString();

        logger.log(
          `Incoming Request: ${method} ${url} | Query: ${JSON.stringify(
            queryParams,
          )} | Body: ${body || 'EMPTY'}`,
        );
      });

      const originalEnd = res.end;
      res.end = function (...args: any[]) {
        logger.log(
          `Response: ${req.method} ${req.url} | Status: ${res.statusCode}`,
        );
        return originalEnd.apply(res, args);
      };
    });

  // Uncaught errors
  process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}\n${err.stack}`);
  });

  process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Rejection: ${reason}`);
  });

  await app.listen(port);
}
bootstrap();

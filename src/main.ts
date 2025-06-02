import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { readFile } from 'fs/promises';
import { SwaggerModule } from '@nestjs/swagger';
import { resolve } from 'path';
import { parse } from 'yaml';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const swaggerPath = resolve(__dirname, '..', 'doc', 'api.yaml');
  const swaggerFile = await readFile(swaggerPath, 'utf-8');
  SwaggerModule.setup('doc', app, parse(swaggerFile));

  const configService = app.get(ConfigService);
  let port = parseInt(configService.get('PORT'), 10);
  const alternativePort = 4000;
  if (!port) {
    port = alternativePort;
    console.error(
      `Cannot start app with the port from .env file.
      Port ${port} was used`,
    );
  }
  console.log('Starting app on port: ' + port);
  await app.listen(port);
}
bootstrap();

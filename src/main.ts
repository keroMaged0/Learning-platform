import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, { abortOnError: false });
  const port = parseInt(process.env.PORT) || 3100
  await app.listen(port)

  const logger = new Logger('Bootstrap');
  logger.log(`Application is running on: ${await app.getUrl()}`);

}

bootstrap()
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {

  const app = await NestFactory.create(AppModule, { abortOnError: false });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  const port = parseInt(process.env.PORT) || 3100
  await app.listen(port)
}

bootstrap()
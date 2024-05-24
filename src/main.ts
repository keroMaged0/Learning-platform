import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/Filters/all-exceptions.filter';


async function bootstrap() {

  const app = await NestFactory.create(AppModule, { abortOnError: false });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }))

  const  httpAdapter  = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

   
  const port = parseInt(process.env.PORT) || 3100
  await app.listen(port)

}

bootstrap()
import { commentsGrpcClient, commentsNatsClient } from '@mallowigi/common';
import { ValidationPipe }                         from '@nestjs/common';
import { NestFactory }                            from '@nestjs/core';
import { AppModule }                              from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(commentsGrpcClient);
  app.connectMicroservice(commentsNatsClient);
  app.useGlobalPipes(
    new ValidationPipe({
      transform:            true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.startAllMicroservicesAsync();
  await app.listen(3005);
}

bootstrap();

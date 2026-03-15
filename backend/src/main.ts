import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useWebSocketAdapter(new IoAdapter(app));
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // чтобы @Transform работал
      whitelist: true, // удаляет лишние поля
    }),
  );
  const port = app.get(ConfigService).get<number>('PORT');
  await app.listen(port ?? 3001);
}

bootstrap()
  .then(() => console.log('Server Started'))
  .catch((err) => console.log(err));

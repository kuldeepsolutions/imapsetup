import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'verbose'],
  });
  await app.listen(4000, () => {
    console.log('server is running on port 4000');
  });
}
bootstrap();

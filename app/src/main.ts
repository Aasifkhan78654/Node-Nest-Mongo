import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get("PORT");
  console.log("------------", port);
  app.setGlobalPrefix('api'); // Set a global prefix for all routes (e.g., `/api/auth/signup`)
  await app.listen(port);
  console.log(`Application is running on http://localhost:${port}/api`);
}
bootstrap();

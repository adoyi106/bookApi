import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true, //There are some properties that are not defined in the DTO, but they are being sent into the request body.
    forbidNonWhitelisted:true
  }))
  const config = new DocumentBuilder().setTitle('Books API')
  .setDescription('API for managing books')
  .setVersion('1.0')
  .addTag('books')
  .build()
  const documentFactory= ()=>SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

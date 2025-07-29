import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './books/entity/books.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import * as Joi from 'joi';
import { User } from './users/user.entity';
import { AuthService } from './auth/auth.service';


@Module({
  imports: [
    
    ConfigModule.forRoot({
    isGlobal: true,
    envFilePath:'.env',
    validationSchema: Joi.object({
      DATABASE_HOST:Joi.string().required(),
      DATABASE_PORT:Joi.number().default(5432),
      DATABASE_USER:Joi.string().required(),
      DATABASE_PASSWORD:Joi.string().required(),
      DATABASE_NAME:Joi.string().required(),
      DATABASE_SYNCHRONIZES:Joi.boolean().default(true),
      PORT:Joi.number().default(3000),
      JWT_SECRET:Joi.string().required(),
      JWT_EXPIRES_IN:Joi.string().default("90d")
    }),

    }),
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(configService:ConfigService)=>({

        type:'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username:configService.get<string>('DATABASE_USER'),
        password:configService.get<string>('DATABASE_PASSWORD'),
        database:configService.get<string>('DATABASE_NAME'),

        entities:[Book, User],
        synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZES'),
      })
    }),
    BooksModule,
    AuthModule,
    UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

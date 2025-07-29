import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';


@Module({
  imports:[ConfigModule,TypeOrmModule.forFeature([User]), 
  TypeOrmModule.forFeature([User]),
JwtModule.registerAsync({
  imports:[ConfigModule],
  inject:[ConfigService],
  useFactory:async (config:ConfigService)=>({
    secret:config.get<string>('JWT_SECRET'),
    signOptions:{expiresIn:config.get<string>('JWT_EXPIRES_IN')|| "90d"}
  })
})],
  controllers:[AuthController],
  providers: [AuthService, AuthGuard],
  exports:[AuthGuard, JwtModule, AuthService]
})
export class AuthModule {}

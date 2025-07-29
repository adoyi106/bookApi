import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from 'src/users/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';


// import * as jwt from "jsonwebtoken"

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name)
    constructor(
        @InjectRepository(User) private readonly useRepository:Repository<User>,
        private config: ConfigService,
        private jwtService:JwtService
    ){}

    async signUp(body:SignUpDto){
        const {email, password, role} = body

        this.logger.log("attempting signup by user")
        const existingUser = await this.useRepository.findOne({where:{email}})
        if(existingUser){
            throw new BadRequestException("User with this email already exists")
        }
        const user = this.useRepository.create({email, password, role: role as UserRole})
        await this.useRepository.save(user)
        const token = await this.generateToken(user)
          const {password:_, ...userWithoutPassword}= user
        return {
            status: "Successful",
            token,
            data:{
                user:userWithoutPassword
            }
        }
        
        
    }

    //Sign In Service
  async signIn(body:SignInDto){

        const {email, password}= body

        this.logger.log(`Attempting login ${email}`)
        if (!email || !password){
            throw new UnauthorizedException("email and password are required!")
        }
        const user = await this.useRepository.findOne({where:{email}})
        const isMatched = await user?.comparePassword(password)
        if (!user || !isMatched){
            throw new UnauthorizedException("Invalid email or pasword!")
        }

        const token = await this.generateToken(user);
        const {password:_, ...userWithoutPassword}= user
         return {
            status: "Successful",
            token,
            data:{
                user:userWithoutPassword
            }
        }

    }

    async generateToken(user:User){
    //     const payload={id}
    //     const secret = this.config.get<string>('JWT_SECRET');
    //   if (!secret) throw new Error('JWT_SECRET is not defined');

    //     const expiresIn = this.config.get<string>("JWT_EXPIRES_IN") || "90d";

        // return (payload, secret, {expiresIn})
        return await this.jwtService.signAsync({id:user.id, role:user.role,},
            {
            secret:this.config.get<string>("JWT_SECRET"),
            expiresIn:this.config.get<string>("JWT_EXOIRES_IN") || "90d"
        }
    )
    }
}
 
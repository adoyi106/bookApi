import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService:JwtService,
    private config:ConfigService
  ){}
  async canActivate(
    context: ExecutionContext,
  // ): boolean | Promise<boolean> | Observable<boolean> {
  ): Promise<boolean>  {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request)
    if (!token){
      throw new UnauthorizedException("Token not found in request header")
    }
    try{
      const payload = await this.jwtService.verifyAsync(token, {
        secret:this.config.get<string>("JWT_SECRET")
      })
      request.user =payload;
      return true;
    }catch{
      throw new UnauthorizedException("Invalid token")
    }

  }

  private extractTokenFromHeader(request: Request): string | undefined{
    const [type, token] = request.headers.authorization?.split(" ") ?? []
return type === 'Bearer' ? token : undefined;
  }
}
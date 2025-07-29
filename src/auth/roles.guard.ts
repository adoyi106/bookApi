import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector:Reflector){}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [context.getHandler(), context.getClass()])

    if(!requiredRoles){
      return true //no roles required, allow access
    }

    const {user} = context.switchToHttp().getRequest()
    console.log(user.role)

    if (!user || !requiredRoles.includes(user.role)){
      throw new ForbiddenException("You do not have permission to access this resources")
    }
    
    return true;
  }
}

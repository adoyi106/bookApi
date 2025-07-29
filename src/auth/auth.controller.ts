import { Body, Controller, HttpCode, Post} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

  @Post('signUp')
//   @HttpCode(201)
     signUp(@Body() body: SignUpDto){
        return  this.authService.signUp(body)
    }
    
 @Post('login')
 login(@Body() body:SignInDto){
    return this.authService.signIn(body)
 }
    
}

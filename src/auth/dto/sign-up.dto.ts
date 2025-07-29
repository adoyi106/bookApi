import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { UserRole } from "src/users/user.entity";

export class SignUpDto{
    @IsString()
    @IsNotEmpty()
    email:string;

    @IsString()
    @IsNotEmpty()
    password:string

    @IsEnum(UserRole,{message:'Role must be either admin or user'})
    role:UserRole
}
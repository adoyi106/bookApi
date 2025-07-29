import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Language } from "../entity/books.entity";


export class CreateBookDto{
    @IsString()
    @IsNotEmpty()
    title:string;

    @IsString()
    @IsNotEmpty()
    author:string;


    @IsDateString()
    @IsNotEmpty()
     publicationDate: string;

    @IsNotEmpty()
    @IsNumber()
    numberOfPages:number;

    @IsNotEmpty()
    @IsEnum(Language)
     language:Language;
}
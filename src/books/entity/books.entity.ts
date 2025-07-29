import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Language{
    ENGLISH='en',
    FRENCH='fr'
}

@Entity()
export class Book{
 @PrimaryGeneratedColumn()
 id: number;

 @Column()
 title:string;
 @Column()
 author:string;
 @Column()
 publicationDate: string;
 @Column()
 numberOfPages:number;
 @Column()
 language:Language;
}

export class GetBookFilterDto{
    @IsString()
    @IsOptional()
    search?:string;

    @IsString()
    @IsOptional()
    author?: string;

    @IsDateString()
    @IsOptional()
    publicationDate?:string;

   
    @IsOptional()
    @IsEnum(Language)
    language?: Language;
}
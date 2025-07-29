import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcryptjs'

export enum UserRole{
    ADMIN='admin',
    USER='user'
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    email:string

    @Column()
    password:string

    @Column()
    role:UserRole

    @BeforeInsert()
    async hashPassword(){
        this.password = await bcrypt.hash(this.password, 10)
    }

    async comparePassword(password:string): Promise<boolean>{
        return await bcrypt.compare(password, this.password)
    }
}
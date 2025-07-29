import { SetMetadata } from "@nestjs/common";


export const ROLES_KEY = 'roles';
export const Roles = (...Roles:string[])=>SetMetadata(ROLES_KEY, Roles)
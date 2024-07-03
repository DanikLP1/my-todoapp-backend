import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AuthDto {
    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    username?: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
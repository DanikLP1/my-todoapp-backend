import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Tokens } from './types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async signUpLocal(dto: AuthDto): Promise<Tokens> {
        const hash = await this.hashData(dto.password);

        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            }
        })

        if(user) throw new BadRequestException('Пользователь с такой электронной почтой уже существует')

        const newUser = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash: hash,
                username: dto.username,
            }
        });

        const tokens = await this.getTokens(newUser.id, newUser.email);
        await this.updateRtHash(newUser.id, tokens.refresh_token);
        return tokens;
    }

    async signInLocal(dto: AuthDto): Promise<Tokens> {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: dto.email },
                    { username: dto.username },
                ],
            },
        });
        if(!user) throw new ForbiddenException("Пользователя не существует");

        const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
        if(!passwordMatches) throw new ForbiddenException("Неверный пароль");

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refresh_token);
        return tokens;
    }

    async logout(userId: string) {
        await this.prisma.user.updateMany({
            where: {
                id: userId,
                hashedRt: {
                    not: null,
                }
            }, 
            data: {
                hashedRt: null,
            }
        });
    }

    async refreshTokens(userId: string, rt: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
                hashedRt: {
                    not: null
                }
            }
        });
        if(!user) throw new ForbiddenException("Пользователя не существует");

        const rtMathces = await bcrypt.compare(rt, user.hashedRt);
        if(!rtMathces) throw new ForbiddenException("Доступ запрещен");

        const tokens = await this.getTokens(user.id, user.email);
        await this.updateRtHash(user.id, tokens.refresh_token);
        return tokens;
    }

    async updateRtHash(userId: string, rt: string) {
        const hash = await this.hashData(rt);
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                hashedRt: hash,
            }
        })
    }

    hashData(data: string) {
        return bcrypt.hash(data, 10);
    }

    async getTokens(userId: string, email: string) {
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                email: email,
            }, {
                secret: process.env.AT_SECRET,
                expiresIn: 60 * 15,
            }),
            this.jwtService.signAsync({
                sub: userId,
                email: email,
            }, {
                secret: process.env.RT_SECRET,
                expiresIn: 60 * 60 * 24 * 7,
            }),
        ]);
        
        return {
            access_token: at,
            refresh_token: rt,
        }
    }
}

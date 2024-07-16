import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User as UserModel } from '@prisma/client'
import { UpdateUserDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        private prisma: PrismaService
    ) {}

    async getUser(userId: number): Promise<UserModel> {
        return this.prisma.user.findUnique({
            where: {
                id: userId,
            }
        });
    }

    async updateUser(userId: number, dto: UpdateUserDto) {
        if (dto.email) {
            const existingUserByEmail = await this.prisma.user.findUnique({
                where: {
                    email: dto.email,
                },
            });

            if (existingUserByEmail && existingUserByEmail.id !== userId) {
                throw new BadRequestException('Пользователь с такой электронной почтой уже существует');
            }
        }

        if (dto.username) {
            const existingUserByUsername = await this.prisma.user.findUnique({
                where: {
                    username: dto.username,
                },
            });

            if (existingUserByUsername && existingUserByUsername.id !== userId) {
                throw new BadRequestException('Пользователь с таким имененм уже существует');
            }
        }

        if (dto.passwordHash) {
            const hashPassword = await bcrypt.hash(dto.passwordHash, 10);
            dto.passwordHash = hashPassword;
        }

        return await this.prisma.user.update({
            data: {
                ...dto,
                passwordHash: dto.passwordHash,
            },
            where: {
                id: userId,
            },
        });
    }

    async deleteUser(userId: number) {
        return await this.prisma.user.delete({
            where: {
                id: userId
            }
        })
    }

}

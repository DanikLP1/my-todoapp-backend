export class UserDto {
    email?: string;
    username?: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
    hashedRt: string | undefined;
}
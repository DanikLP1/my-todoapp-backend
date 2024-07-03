import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorators';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';

@Controller('users')
export class UsersController {

    constructor(
        private userService: UsersService,
    ) {}

    @Get('')
    getUser(@GetCurrentUserId() userId: number) {
        return this.userService.getUser(userId);
    }

    @Patch('')
    updateUser(@GetCurrentUserId() userId: number, @Body()dto: UpdateUserDto) {
        return this.userService.updateUser(userId, dto);
    }

    @Delete('') 
    deleteUser(@GetCurrentUserId() userId: number) {
        return this.userService.deleteUser(userId);
    }
}

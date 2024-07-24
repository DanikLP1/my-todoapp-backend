import { Body, Controller, Delete, Get, Patch, Put } from '@nestjs/common';
import { GetCurrentUserId } from 'src/common/decorators';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';

@Controller('users')
export class UsersController {

    constructor(
        private userService: UsersService,
    ) {}

    @Get('')
    getUser(@GetCurrentUserId() userId: string) {
        return this.userService.getUser(userId);
    }

    @Put('')
    updateUser(@GetCurrentUserId() userId: string, @Body()dto: UpdateUserDto) {
        return this.userService.updateUser(userId, dto);
    }

    @Delete('') 
    deleteUser(@GetCurrentUserId() userId: string) {
        return this.userService.deleteUser(userId);
    }
}

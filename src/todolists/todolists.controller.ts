import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { TodoListsService } from './todolists.service';
import { CreateTodoListDto, UpdateTodoListDto } from './dto';
import { GetCurrentUserId } from 'src/common/decorators';

@Controller('todolists')
export class TodoListsController {
    constructor(private readonly todoListService: TodoListsService) {}
  
    @Post()
    create(@GetCurrentUserId() userId: number, @Body() createTodoListDto: CreateTodoListDto) {
      return this.todoListService.create(userId, createTodoListDto);
    }
  
    @Get()
    findAll(@GetCurrentUserId() userId: number) {
      return this.todoListService.findAll(userId);
    }
  
    @Get(':id')
    findOne(@GetCurrentUserId() userId: number, @Param('id') id: string) {
      return this.todoListService.findOne(userId, +id);
    }
  
    @Put(':id')
    update(@GetCurrentUserId() userId: number, @Param('id') id: string, @Body() updateTodoListDto: UpdateTodoListDto) {
      return this.todoListService.update(userId, +id, updateTodoListDto);
    }
  
    @Delete(':id')
    remove(@GetCurrentUserId() userId: number, @Param('id') id: string) {
      return this.todoListService.remove(userId, +id);
    }
  }
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';

@Controller('todolists/:listId/tasks')
export class TasksController {
    constructor(private readonly taskService: TasksService) {}
  
    @Post()
    create(@Param('listId') listId: string, @Body() createTaskDto: CreateTaskDto) {
      return this.taskService.create(+listId, createTaskDto);
    }
  
    @Get()
    findAll(@Param('listId') listId: string) {
      return this.taskService.findAll(+listId);
    }
  
    @Get(':id')
    findOne(@Param('listId') listId: string, @Param('id') id: string) {
      return this.taskService.findOne(+listId, +id);
    }
  
    @Put(':id')
    update(@Param('listId') listId: string, @Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
      return this.taskService.update(+listId, +id, updateTaskDto);
    }
  
    @Delete(':id')
    remove(@Param('listId') listId: string, @Param('id') id: string) {
      return this.taskService.remove(+listId, +id);
    }
  }

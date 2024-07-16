import { Module } from '@nestjs/common';
import { TodoListsService } from './todolists.service';
import { TodoListsController } from './todolists.controller';

@Module({
  providers: [TodoListsService],
  controllers: [TodoListsController]
})
export class TodolistsModule {}

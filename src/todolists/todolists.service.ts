import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTodoListDto, UpdateTodoListDto } from './dto';

@Injectable()
export class TodoListsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createTodoListDto: CreateTodoListDto) {
    return this.prisma.todoList.create({
      data: {
        ...createTodoListDto,
        user: { connect: { id: userId } },
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.todoList.findMany({
      where: { userId: userId },
    });
  }

  async findOne(userId: number, id: number) {
    const todoList = await this.prisma.todoList.findFirst({
      where: { id, userId },
    });

    if (!todoList) {
      throw new NotFoundException(`Список задач с айди ${id} не найден`);
    }

    return todoList;
  }

  async update(userId: number, id: number, updateTodoListDto: UpdateTodoListDto) {
    await this.findOne(userId, id);

    return this.prisma.todoList.update({
      where: { id },
      data: { ...updateTodoListDto },
    });
  }

  async remove(userId: number, id: number) {
    await this.findOne(userId, id);

    return this.prisma.todoList.delete({
      where: { id },
    });
  }
}
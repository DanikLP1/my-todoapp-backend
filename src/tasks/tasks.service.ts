import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTaskDto, UpdateTaskDto } from "./dto";


@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(listId: number, createTaskDto: CreateTaskDto) {
    if(!this.findTodoLists) throw new NotFoundException("Такого списка задач не существует");

    return this.prisma.task.create({
      data: {
        ...createTaskDto,
        todoList: { connect: { id: listId } },
      },
    });
  }

  async findAll(listId: number) {
    if(!this.findTodoLists) throw new NotFoundException("Такого списка задач не существует");
    return this.prisma.task.findMany({
      where: { listId },
    });
  }

  async findOne(listId: number, id: number) {
    if(!this.findTodoLists) throw new NotFoundException("Такого списка задач не существует");
    const task = await this.prisma.task.findFirst({
      where: { id, listId },
    });

    if (!task) {
      throw new NotFoundException(`Задача с айди ${id} не найдена`);
    }

    return task;
  }

  async update(listId: number, id: number, updateTaskDto: UpdateTaskDto) {
    await this.findOne(listId, id);

    return this.prisma.task.update({
      where: { id },
      data: { ...updateTaskDto },
    });
  }

  async remove(listId: number, id: number) {
    await this.findOne(listId, id);

    return this.prisma.task.delete({
      where: { id },
    });
  }

  async findTodoLists(listId: number) {
    return await this.prisma.todoList.findUnique({where: {id: listId}}) ? true : false
  } 

}
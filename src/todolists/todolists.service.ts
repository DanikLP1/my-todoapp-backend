import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTodoListDto, UpdateTodoListDto } from './dto';

@Injectable()
export class TodoListsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createToDoListDto: CreateTodoListDto) {
    const { tasks, date, ...listData } = createToDoListDto;

    // Преобразование строки даты в объект Date
    const dateObj = new Date(date);
    const dueDateUTC = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), dateObj.getHours(), dateObj.getMinutes(), dateObj.getSeconds(), dateObj.getMilliseconds()));

    // Создание списка дел
    const todoList = await this.prisma.todoList.create({
      data: {
        id: listData.id,
        title: createToDoListDto.title,
        date: dueDateUTC,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { connect: { id: userId } },
      },
    });

    // Если задачи присутствуют, создаем их и связываем с новым списком дел
    if (tasks && tasks.length > 0) {
      const taskPromises = tasks.map(task => this.prisma.task.create({
        data: {
          id: task.id,
          title: task.title,
          dueDate: dueDateUTC,
          description: task.description,
          listId: todoList.id,
        },
      }));
      await Promise.all(taskPromises);
    }

    return this.prisma.todoList.findUnique({
      where: { id: todoList.id },
      include: { tasks: true },
    });
  }

  async findAll(userId: string) {
    return this.prisma.todoList.findMany({
      where: { userId: userId },
      include: {
        tasks: true,
      }
    });
  }

  async findOne(userId: string, id: string) {
    const todoList = await this.prisma.todoList.findFirst({
      where: { id, userId },
      include: {
        tasks: true,
      }
    });

    if (!todoList) {
      throw new NotFoundException(`Список задач с айди ${id} не найден`);
    }

    return todoList;
  }

  async update(userId: string, id: string, updateTodoListDto: UpdateTodoListDto) {
    await this.findOne(userId, id);

    return this.prisma.todoList.update({
      where: { id },
      data: { ...updateTodoListDto },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    return this.prisma.todoList.delete({
      where: { id },
    });
  }
}
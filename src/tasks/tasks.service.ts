import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateTaskDto, UpdateTaskDto } from "./dto";

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createTaskDto: CreateTaskDto) {
    const { dueDate, ...rest } = createTaskDto;
    console.log(`Original dueDate: ${dueDate}`);
  
    // Преобразование строки даты в объект Date
    const dueDateObj = new Date(dueDate);
    console.log(`Parsed dueDateObj: ${dueDateObj}`);
  
    // Преобразование даты в начало и конец дня в локальном часовом поясе
    const startOfDay = new Date(dueDateObj.getFullYear(), dueDateObj.getMonth(), dueDateObj.getDate());
    const endOfDay = new Date(dueDateObj.getFullYear(), dueDateObj.getMonth(), dueDateObj.getDate(), 23, 59, 59, 999);
  
    // Преобразование в UTC
    const startOfDayUTC = new Date(Date.UTC(startOfDay.getFullYear(), startOfDay.getMonth(), startOfDay.getDate()));
    const endOfDayUTC = new Date(Date.UTC(endOfDay.getFullYear(), endOfDay.getMonth(), endOfDay.getDate(), 23, 59, 59, 999));
    const dueDateUTC = new Date(Date.UTC(dueDateObj.getFullYear(), dueDateObj.getMonth(), dueDateObj.getDate(), dueDateObj.getHours(), dueDateObj.getMinutes(), dueDateObj.getSeconds(), dueDateObj.getMilliseconds()));
  
    // Проверка наличия списка дел с указанной датой
    let todoList = await this.prisma.todoList.findFirst({
      where: {
        userId: userId,
        date: {
          gte: startOfDayUTC,
          lte: endOfDayUTC,
        },
      },
    });
  
    // Если список дел не найден, создаем новый
    if (!todoList) {
      todoList = await this.prisma.todoList.create({
        data: {
          title: `Список дел на ${startOfDayUTC.toISOString().split('T')[0]}`,
          date: startOfDayUTC,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: { connect: { id: userId } },
        },
      });
    }
  
    // Создание задачи в найденном или новом списке дел
    return this.prisma.task.create({
      data: {
        ...rest,
        listId: todoList.id,
        dueDate: dueDateUTC, // Используем UTC для сохранения времени
        completed: rest.completed || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async findAll(listId: string) {
    if(!this.findTodoLists) throw new NotFoundException("Такого списка задач не существует");
    return this.prisma.task.findMany({
      where: { listId },
    });
  }

  async findOne(listId: string, id: string) {
    if(!this.findTodoLists) throw new NotFoundException("Такого списка задач не существует");
    const task = await this.prisma.task.findFirst({
      where: { id, listId },
    });

    if (!task) {
      throw new NotFoundException(`Задача с айди ${id} не найдена`);
    }

    return task;
  }

  async update(listId: string, id: string, updateTaskDto: UpdateTaskDto) {
    const findedTask = await this.findOne(listId, id);
    const { dueDate, ...rest } = updateTaskDto;
    console.log(`Original dueDate: ${dueDate}`);
  
    // Преобразование строки даты в объект Date
    const dueDateObj = new Date(dueDate);
    console.log(`Parsed dueDateObj: ${dueDateObj}`);

    return this.prisma.task.update({
      where: { id },
      data: { ...rest, dueDate: dueDateObj , updatedAt: new Date(), createdAt: findedTask.createdAt},
    });
  }

  async remove(listId: string, id: string) {
    await this.findOne(listId, id);

    return this.prisma.task.delete({
      where: { id },
    });
  }

  async findTodoLists(listId: string) {
    return await this.prisma.todoList.findUnique({where: {id: listId}}) ? true : false
  } 

}
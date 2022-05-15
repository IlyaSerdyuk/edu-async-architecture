import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, IsNull, Repository } from 'typeorm';

import { UserService } from '../user/user.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskBroker } from './task.broker';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly userService: UserService,
    private readonly taskBroker: TaskBroker,
  ) {}

  /**
   * Найти задачи
   * @param user Если указан параметр, то только задачи конкретного исполнителя
   */
  async findAll(user?: string): Promise<Task[]> {
    const options: FindManyOptions<Task> = {
      where: {
        completed: IsNull(),
      },
    };
    if (user) {
      options.where['user'] = user;
    }
    return this.taskRepository.find(options);
  }

  /** Добавить задачу */
  async add(createTaskDto: CreateTaskDto): Promise<Task> {
    const user = await this.userService.findRandom();
    const task = await this.taskRepository.save({
      ...createTaskDto,
      user: user.public_id,
    });

    this.taskBroker.added(task);
    this.taskBroker.assigned(task);

    return task;
  }

  /** Переназначить исполнителей открытых задач */
  async shuffle(): Promise<number> {
    const tasks = await this.taskRepository.find({
      where: {
        completed: IsNull(),
      },
    });

    // Для упрощения кода учебного проекта, определяю пользователей по одному
    // В боевом проекте я бы оптимизировал выборку/назначение пользователей
    await Promise.all(
      tasks.map(async (task) => {
        const user = await this.userService.findRandom();
        task.user = user.public_id;
        await this.taskRepository.save(task);
      }),
    );

    this.taskBroker.assignedGroup(tasks);

    return tasks.length;
  }

  /** Отметить выполненной */
  async markCompleted({ taskId, userId }): Promise<0 | 1> {
    const task = await this.taskRepository.findOne(taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    if (task.user !== userId) {
      throw new Error('Forbidden');
    }

    if (task.completed) {
      // Возможно, стоит как-то особенно обрабатывать задвоение
      return 0;
    }

    task.completed = new Date();

    await this.taskRepository.save(task);
    this.taskBroker.completed(task);

    return 1;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserService } from '../user/user.service';
import { TaskAssignedDto_v2 } from './dto/task-assigned-v2.dto';
import { TaskCompletedDto } from './dto/task-completed.dto';
import { TaskCreatedDto } from './dto/task-created.dto';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    private readonly userService: UserService,
  ) {}

  /** Добавить задачу */
  async create(dto: TaskCreatedDto): Promise<Task> {
    const task = await this.getByPublicId(dto.public_id);
    task.title = dto.title;
    task.cost_assign = Math.floor(Math.random() * 10 + 10); // rand(10..20)
    task.cost_complete = Math.floor(Math.random() * 20 + 20); // rand(20..40)
    return this.taskRepository.save(task);
  }

  /** Назначить исполнителя на задачу */
  async assign(dto: TaskAssignedDto_v2): Promise<Task> {
    const task = await this.getByPublicId(dto.task_public_id);
    task.user = await this.userService.getByPublicId(dto.user_public_id);

    /** @todo Стоит завернуть в транзакцию */
    await this.taskRepository.save(task);
    await this.userService.assign(task);

    return task;
  }

  /** Отметить задачу закрытой */
  async complete(dto: TaskCompletedDto): Promise<Task> {
    const task = await this.getByPublicId(dto.task_public_id);
    task.completed_at = dto.completed_at;

    /** @todo Стоит завернуть в транзакцию */
    await this.taskRepository.save(task);
    await this.userService.complete(task);

    return task;
  }

  /** Найти или создать задачу по публичному идентификатору */
  async getByPublicId(public_id: string): Promise<Task> {
    const task = this.taskRepository.findOne({ public_id });
    return task || this.taskRepository.save({ public_id });
  }
}

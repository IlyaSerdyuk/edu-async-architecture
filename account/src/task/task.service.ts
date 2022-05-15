import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserService } from '../user/user.service';
import { TaskAssignedDto } from './dto/task-assigned.dto';
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
    const task = await this.getByPublicId(dto.id);
    task.title = dto.title;
    return this.taskRepository.save(task);
  }

  /** Назначить исполнителя на задачу */
  async assign(dto: TaskAssignedDto): Promise<Task> {
    const task = await this.getByPublicId(dto.task_id);
    task.user = await this.userService.getByPublicId(dto.user_id);
    return this.taskRepository.save(task);
  }

  /** Отметить задачу закрытой */
  async complete(dto: TaskCompletedDto): Promise<Task> {
    const task = await this.getByPublicId(dto.task_id);
    task.completed_at = dto.completed_at;
    return this.taskRepository.save(task);
  }

  /** Найти или создать задачу по публичному идентификатору */
  async getByPublicId(public_id: string): Promise<Task> {
    const task = this.taskRepository.findOne({ public_id });
    return task || this.taskRepository.save({ public_id });
  }
}

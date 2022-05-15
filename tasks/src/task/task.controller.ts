import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { User } from '../auth/auth-user.decorator';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { Roles } from 'src/auth/auth-roles.decorator';
import { UserRoles } from 'src/user/roles.enum';

@Controller('')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  /** Web API: Получить (все открытые) задачи */
  @Get()
  findAll(@User() user): Promise<Task[]> {
    const options = user.role !== UserRoles.Admin ? user.id : undefined;
    return this.taskService.findAll(options);
  }

  /** Web API: Добавить задачу */
  @Post('add')
  add(@Body() addTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.add(addTaskDto);
  }

  /** Web API: Переназначить все задачи */
  @Post('shuffle')
  @Roles(UserRoles.Admin)
  async shuffle(): Promise<{ complete: number }> {
    const complete = await this.taskService.shuffle();
    return { complete };
  }

  /** Web API: Отметить выполненной */
  @Get('mark-completed/:id')
  @Roles(UserRoles.Worker)
  markCompleted(
    @User() user,
    @Param('id') taskId: number,
  ) {
    return this.taskService.markCompleted({ taskId, userId: user.id });
  }
}

import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { TaskService } from './task.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';

type SuccessResponse = { status: 'ok' };

@Controller('')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  /** Web API: Получить (все открытые) задачи */
  @Get()
  findAll(): Promise<Task[]> {
    // @todo проверять роль и если исполнитель,
    // то подставлять в запрос его публичный идентификатор
    return this.taskService.findAll();
  }

  /** Web API: Добавить задачу */
  @Post('add')
  add(@Body() addTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.add(addTaskDto);
  }

  /** Web API: Переназначить все задачи */
  @Post('shuffle')
  async shuffle(): Promise<SuccessResponse> {
    await this.taskService.shuffle();
    return { status: 'ok' };
  }

  /** Web API: Отметить выполненной */
  @Get('mark-completed/:id')
  markCompleted(@Param('id') taskId: number) {
    // пока сессии нет использую заранее выбранного пользователя
    const userId = '1eb400a8-ffb3-4976-8160-825eaceb82aa';
    return this.taskService.markCompleted({ taskId, userId });
  }
}

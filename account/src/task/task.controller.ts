import { Controller } from '@nestjs/common';
import { Ctx, KafkaContext, MessagePattern } from '@nestjs/microservices';

import { TaskAssignedDto } from './dto/task-assigned.dto';
import { TaskCompletedDto } from './dto/task-completed.dto';
import { TaskCreatedDto } from './dto/task-created.dto';
import { TaskService } from './task.service';

@Controller()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  /** Обработчик перехватываемых событий из очереди CUD-событий изменения задач */
  @MessagePattern('tasks-stream')
  async handlerTaskStream(@Ctx() context: KafkaContext) {
    const message = context.getMessage();
    switch (`${message.key}`) {
      case 'TaskCreated':
        this.taskService.create(message.value as unknown as TaskCreatedDto);
        break;
      default:
        console.log(`Unknown key ${message.key} in topic tasks-stream`);
        break;
    }
  }

  /** Обработчик перехватываемых событий из очереди BL-событий изменения задач */
  @MessagePattern('tasks-lifecycle')
  async handlerTaskLifecycle(@Ctx() context: KafkaContext) {
    const message = context.getMessage();
    switch (`${message.key}`) {
      case 'TaskAssigned':
        this.taskService.assign(message.value as unknown as TaskAssignedDto);
        break;
      case 'TaskCompleted':
        this.taskService.complete(message.value as unknown as TaskCompletedDto);
        break;
      default:
        console.log(`Unknown key ${message.key} in topic tasks-lifecycle`);
        break;
    }
  }
}

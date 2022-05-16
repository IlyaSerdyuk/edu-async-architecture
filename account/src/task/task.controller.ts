import { Controller } from '@nestjs/common';
import { Ctx, KafkaContext, MessagePattern } from '@nestjs/microservices';

import { TaskAssignedDto_v2 } from './dto/task-assigned-v2.dto';
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
        if (message.headers?.event_version === '2') {
          this.taskService.assign(
            message.value as unknown as TaskAssignedDto_v2,
          );
        } else {
          const { task_id, user_id, ...value } =
            message.value as unknown as TaskAssignedDto;
          this.taskService.assign({
            ...value,
            task_public_id: task_id,
            user_public_id: user_id,
          } as unknown as TaskAssignedDto_v2);
        }
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

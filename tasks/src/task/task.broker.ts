import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { Task } from './task.entity';

/**
 * Брокер для взаимодействия к Kafka.
 */
@Injectable()
export class TaskBroker {
  constructor(
    @Inject('message-broker') private readonly messageBroker: ClientKafka,
  ) {}

  /** Отправить CUD-событие «Добавлена задача» */
  added(task: Task) {
    this.messageBroker.emit('task-stream', {
      key: 'TaskCreated',
      value: {
        public_id: task.public_id,
        title: task.title,
      },
    });
  }

  /** Отправить BL-событие «Задача назначена» */
  assigned(task: Task) {
    this.messageBroker.emit('task-lifecycle', {
      key: 'TaskAssigned',
      value: {
        task_public_id: task.public_id,
        user_public_id: task.user.public_id,
      },
    });
  }

  /** Отправить пакет BL-событий «Задача назначена» */
  assignedGroup(tasks: Task[]) {
    this.messageBroker.emit(
      'task-lifecycle',
      tasks.map((task) => ({
        key: 'TaskAssigned',
        value: {
          task_public_id: task.public_id,
          user_public_id: task.user.public_id,
        },
      })),
    );
  }

  /** Отправить BL-событие «Задача закрыта */
  completed(task: Task) {
    return this.messageBroker.emit('task-lifecycle', {
      key: 'TaskCompleted',
      value: {
        task_public_id: task.public_id,
        user_public_id: task.user.public_id,
      },
    });
  }
}

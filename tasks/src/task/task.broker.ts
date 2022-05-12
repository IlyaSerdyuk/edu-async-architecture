import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { Task } from './task.entity';

@Injectable()
export class TaskBroker {
  constructor(
    @Inject('message-broker') private readonly messageBroker: ClientKafka,
  ) {}

  added(task: Task) {
    this.messageBroker.emit('task-stream', {
      key: 'TaskAdded',
      value: {
        id: task.public_id,
        title: task.title,
      },
    });
  }

  assigned(task: Task) {
    this.messageBroker.emit('task-lifecycle', {
      key: 'TaskAssigned',
      value: {
        id: task.public_id,
        user: task.user,
      },
    });
  }

  assignedGroup(tasks: Task[]) {
    this.messageBroker.emit(
      'task-lifecycle',
      tasks.map((task) => ({
        key: 'TaskAssigned',
        value: {
          id: task.public_id,
          user: task.user,
        },
      })),
    );
  }

  completed(task: Task) {
    return this.messageBroker.emit('task-lifecycle', {
      key: 'TaskCompleted',
      value: {
        id: task.public_id,
        user: task.user,
      },
    });
  }
}

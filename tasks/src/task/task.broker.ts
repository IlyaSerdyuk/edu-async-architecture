import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { nanoid } from 'nanoid';

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
        id: task.public_id,
        title: task.title,
        jira_id: task.jira_id,
      },
      headers: {
        event_id: task.id,
        event_version: 2,
        event_producer: 'tasks',
        event_time: new Date(),
      },
    });
  }

  /** Отправить BL-событие «Задача назначена» */
  assigned(task: Task) {
    this.messageBroker.emit('task-lifecycle', {
      key: 'TaskAssigned',
      value: {
        task_id: task.public_id,
        user_id: task.user.public_id,
      },
      headers: {
        event_id: `${task.id}-${nanoid()}`,
        event_version: 1,
        event_producer: 'tasks',
        event_time: new Date(),
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
          task_id: task.public_id,
          user_id: task.user.public_id,
        },
        headers: {
          event_id: `${task.id}-${nanoid()}`,
          event_version: 1,
          event_producer: 'tasks',
          event_time: new Date(),
        },
      })),
    );
  }

  /** Отправить BL-событие «Задача закрыта */
  completed(task: Task) {
    return this.messageBroker.emit('task-lifecycle', {
      key: 'TaskCompleted',
      value: {
        task_id: task.public_id,
        user_id: task.user.public_id,
      },
      headers: {
        event_id: `${task.id}-${nanoid()}`,
        event_version: 1,
        event_producer: 'tasks',
        event_time: new Date(),
      },
    });
  }
}

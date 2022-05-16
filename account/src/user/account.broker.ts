import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { Transaction } from './transaction.entity';

/**
 * Брокер для взаимодействия к Kafka.
 */
@Injectable()
export class AccountBroker {
  constructor(
    @Inject('message-broker') private readonly messageBroker: ClientKafka,
  ) {}

  /** Отправить BL-событие о списании средств на счета пользователя */
  debit(transaction: Transaction) {
    this.messageBroker.emit('account-stream', {
      key: 'AccountDebit',
      value: {
        user_public_id: transaction.user.public_id,
        task_public_id: transaction.task.public_id,
        amount: transaction.debit,
      },
      headers: {
        event_id: transaction.id,
        event_version: 1,
        event_producer: 'accounts',
        event_time: new Date(),
      },
    });
  }

  /** Отправить BL-событие о зачисление средств на счет пользователя */
  credit(transaction: Transaction) {
    this.messageBroker.emit('account-stream', {
      key: 'AccountCredit',
      value: {
        user_public_id: transaction.user.public_id,
        task_public_id: transaction.task.public_id,
        amount: transaction.credit,
      },
      headers: {
        event_id: transaction.id,
        event_version: 1,
        event_producer: 'accounts',
        event_time: new Date(),
      },
    });
  }

  /** Отправить BL-событие о выплате средств пользователю */
  paid(transaction: Transaction) {
    this.messageBroker.emit('account-stream', {
      key: 'AccountPaid',
      value: {
        user_public_id: transaction.user.public_id,
        amount: transaction.credit,
      },
      headers: {
        event_id: transaction.id,
        event_version: 1,
        event_producer: 'accounts',
        event_time: new Date(),
      },
    });
  }
}

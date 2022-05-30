import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { Transaction } from './transaction/transaction.entity';

/**
 * Брокер для взаимодействия к Kafka.
 */
@Injectable()
export class AccountBroker {
  constructor(
    @Inject('message-broker') private readonly messageBroker: ClientKafka,
  ) {}

  /** Отправить BL-событие о списании средств на счета пользователя */
  withdraw(transaction: Transaction) {
    this.messageBroker.emit('account-stream', {
      key: 'WithdrawTransactionApplied',
      value: {
        transaction_public_id: transaction.public_id,
        transaction_at: transaction.created_at,
        user_public_id: transaction.user.public_id,
        task_public_id: transaction.task.public_id,
        debit: transaction.debit,
        description: transaction.description,
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
  deposit(transaction: Transaction) {
    this.messageBroker.emit('account-stream', {
      key: 'DepositTransactionApplied',
      value: {
        transaction_public_id: transaction.public_id,
        transaction_at: transaction.created_at,
        user_public_id: transaction.user.public_id,
        task_public_id: transaction.task.public_id,
        credit: transaction.credit,
        description: transaction.description,
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
      key: 'PaymentTransactionApplied',
      value: {
        transaction_public_id: transaction.public_id,
        transaction_at: transaction.created_at,
        user_public_id: transaction.user.public_id,
        amount: transaction.credit,
        description: transaction.description,
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

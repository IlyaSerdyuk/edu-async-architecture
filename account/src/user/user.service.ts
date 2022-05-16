import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from '../task/task.entity';
import { AccountBroker } from './account.broker';
import { UserCreatedDto } from './dto/user-created.dto';
import { Payment } from './payment/payment.entity';
import { Transaction } from './transaction.entity';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly accountBroker: AccountBroker,
  ) {}

  /** Добавить пользователя */
  async create(dto: UserCreatedDto): Promise<User> {
    const user = await this.getByPublicId(dto.public_id);
    user.name = dto.name;
    user.role = dto.role;
    user.email = dto.email;
    return this.userRepository.save(user);
  }

  /** Найти или создать пользователя по публичному идентификатору */
  async getByPublicId(public_id: string): Promise<User> {
    const user = this.userRepository.findOne({ public_id });
    return user || this.userRepository.save({ public_id });
  }

  /** Провести назначение исполнителя на задачу */
  async assign(task: Task) {
    const debit = task.cost_assign;
    const user = task.user;
    const after_balance = user.balance - debit;

    const transaction = await this.transactionRepository.save({
      user,
      task,
      debit,
      after_balance,
    });

    user.balance = after_balance;
    await this.userRepository.save(user);

    this.accountBroker.debit(transaction);
  }

  /** Провести закрытие задачи исполнителем */
  async complete(task: Task) {
    const credit = task.cost_complete;
    const user = task.user;
    const after_balance = user.balance + credit;

    const transaction = await this.transactionRepository.save({
      user,
      task,
      credit,
      after_balance,
    });

    user.balance = after_balance;
    this.userRepository.save(user);

    this.accountBroker.credit(transaction);
  }

  /** Заказать выплату пользователю */
  async orderPayout(user: User) {
    const amount = user.balance;
    if (amount <= 0) {
      return;
    }

    await this.paymentRepository.save({ user, amount });

    /** @todo Заменить на запрос типа SET balance = balance - $amount */
    user.balance -= amount;
    await this.userRepository.save(user);
  }
}

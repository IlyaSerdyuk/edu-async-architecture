import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from '../task/task.entity';
import { AccountBroker } from './account.broker';
import { UserCreatedDto } from './dto/user-created.dto';
import { Payment } from './payment/payment.entity';
import { TransactionService } from './transaction/transaction.service';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly accountBroker: AccountBroker,
    private readonly transactionService: TransactionService,
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
    const user = task.assignee;
    const transaction = await this.transactionService.applyDeposit({
      user,
      task,
      cost: task.cost_assign,
      description: `Task ${task.public_id} assigned to worker ${user.public_id}`,
    });

    this.accountBroker.withdraw(transaction);
  }

  /** Провести закрытие задачи исполнителем */
  async complete(task: Task) {
    const user = task.assignee;
    const transaction = await this.transactionService.applyWithdraw({
      user,
      task,
      cost: task.cost_complete,
      description: `Task ${task.public_id} completed worker ${user.public_id}`,
    });
    this.accountBroker.deposit(transaction);
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

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Task } from '../../task/task.entity';
import { User } from '../user.entity';
import { Transaction } from './transaction.entity';

interface Props {
  user: User;
  task: Task;
  cost: number;
  description: string;
}

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  applyDeposit({ user, task, cost, description }: Props): Promise<Transaction> {
    const after_balance = user.balance - cost;
    this.userRepository.save({
      ...user,
      balance: after_balance,
    });
    return this.transactionRepository.save({
      user,
      task,
      debit: cost,
      after_balance,
      description,
    });
  }

  applyWithdraw({
    user,
    task,
    cost,
    description,
  }: Props): Promise<Transaction> {
    const after_balance = user.balance + cost;
    this.userRepository.save({
      ...user,
      balance: after_balance,
    });
    return this.transactionRepository.save({
      user,
      task,
      credit: cost,
      after_balance,
      description,
    });
  }

  applyPayout({
    user,
    amount,
    description,
  }: {
    user: User;
    amount: number;
    description: string;
  }) {
    const after_balance = user.balance - amount;
    this.userRepository.save({
      ...user,
      balance: after_balance,
    });
    return this.transactionRepository.save({
      user,
      credit: amount,
      after_balance,
      description,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import { Repository } from 'typeorm';

import { Payment } from '../user/payment/payment.entity';
import { Transaction } from '../user/transaction/transaction.entity';
import { User } from '../user/user.entity';

/** Сервис для просмотра данных по начислениям и выплатам */
@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  getAuditLog(options: { user: User; from?: Date; till?: Date }) {
    /** @todo Причесать ответ */
    return this.transactionRepository.find(options);
  }

  /** Получить статистику по дням за последнее время */
  getStat(dateFrom: Date) {
    const from = dayjs(dateFrom).format('YYYY-MM-DD 00:00:00');
    return this.transactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(debit)', 'sum_debit')
      .select('SUM(credit)', 'sum_credit')
      .select('DATE(created_at)', 'date')
      .groupBy('DATE(created_at)')
      .where('created_at > :from', { from })
      .getRawMany();
  }

  /** Количество заработанных топ-менеджментом денег по дням */
  getDaysProfit(dateFrom: Date) {
    const from = dayjs(dateFrom).format('YYYY-MM-DD 00:00:00');
    return this.transactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(debit) + SUM(credit)', 'income')
      .select('DATE(created_at)', 'date')
      .groupBy('DATE(created_at)')
      .where('created_at > :from', { from })
      .getRawMany();
  }
}

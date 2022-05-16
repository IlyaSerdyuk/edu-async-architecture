import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';

import { Task } from '../task/task.entity';
import { User } from './user.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @ManyToOne(() => Task, (task) => task.transactions)
  task: Task;

  @Column({ unsigned: true })
  debit: number;

  @Column({ unsigned: true })
  credit: number;

  @Column()
  after_balance: number;
}

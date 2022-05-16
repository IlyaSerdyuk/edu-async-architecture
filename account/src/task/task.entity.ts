import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Generated,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Transaction } from '../user/transaction.entity';
import { User } from '../user/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  public_id: string;

  @Column()
  jira_id: string | null;

  @Column()
  title: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @Column()
  cost_assign: number;

  @Column()
  cost_complete: number;

  @OneToMany(() => Transaction, (transaction) => transaction.task)
  transactions: Transaction[];
}

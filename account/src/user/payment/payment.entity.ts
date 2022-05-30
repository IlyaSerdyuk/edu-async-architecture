import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';

import { User } from '../user.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @Column()
  email: string;

  @Column({ unsigned: true })
  amount: number;

  @Column({ type: 'timestamp', nullable: true })
  sent_at: Date;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Generated,
  ManyToOne,
} from 'typeorm';

import { User } from '../user/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  public_id: string;

  @Column() // я бы назвал code, но раз в задании jira_id придерживаюсь бизнес-требований
  jira_id: string | null;

  @Column()
  title: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  completed: Date;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;
}

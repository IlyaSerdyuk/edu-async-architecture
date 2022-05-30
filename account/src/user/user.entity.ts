import { AuthUser } from 'src/auth/auth.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  OneToMany,
} from 'typeorm';

import { Task } from '../task/task.entity';
import { UserRoles } from './roles.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  public_id: string;

  @Column()
  name: string;

  @Column()
  role: UserRoles | string;

  @Column()
  email: string;

  @Column({ default: 0 })
  balance: number;

  @OneToMany(() => Task, (task) => task.assignee)
  tasks: Task[];

  @OneToMany(() => AuthUser, (session) => session.user)
  sessions: AuthUser[];
}

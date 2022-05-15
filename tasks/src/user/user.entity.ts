import { Task } from 'src/task/task.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  OneToMany,
} from 'typeorm';

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

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}

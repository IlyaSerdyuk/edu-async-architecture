import { Entity, Column, PrimaryGeneratedColumn, Generated } from 'typeorm';

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

  @Column({
    type: 'enum',
    enum: UserRoles,
  })
  role: string;
}

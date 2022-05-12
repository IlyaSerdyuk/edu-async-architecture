import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Generated,
} from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  public_id: string;

  @Column()
  title: string;

  @Column()
  user: string;

  @CreateDateColumn({ type: 'timestamp' })
  created: Date;

  @Column({ type: 'timestamp', nullable: true })
  completed: Date;
}

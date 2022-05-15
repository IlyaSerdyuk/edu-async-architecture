import { IsNotEmpty, IsUUID } from 'class-validator';

export class TaskCompletedDto {
  @IsNotEmpty()
  @IsUUID()
  task_id: string;

  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @IsNotEmpty()
  completed_at: Date;
}

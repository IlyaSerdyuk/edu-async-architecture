import { IsNotEmpty, IsUUID } from 'class-validator';

export class TaskCompletedDto {
  @IsNotEmpty()
  @IsUUID()
  task_public_id: string;

  @IsNotEmpty()
  @IsUUID()
  completed_by_public_id: string;

  @IsNotEmpty()
  completed_at: Date;
}

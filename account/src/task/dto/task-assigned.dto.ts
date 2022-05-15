import { IsNotEmpty, IsUUID } from 'class-validator';

export class TaskAssignedDto {
  @IsNotEmpty()
  @IsUUID()
  task_id: string;

  @IsNotEmpty()
  @IsUUID()
  user_id: string;
}

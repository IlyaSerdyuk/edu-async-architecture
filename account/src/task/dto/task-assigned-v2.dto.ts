import { IsNotEmpty, IsUUID } from 'class-validator';

export class TaskAssignedDto_v2 {
  @IsNotEmpty()
  @IsUUID()
  task_public_id: string;

  @IsNotEmpty()
  @IsUUID()
  user_public_id: string;
}

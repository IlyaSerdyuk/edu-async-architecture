import { IsNotEmpty, IsUUID } from 'class-validator';

export class TaskAssignedDto {
  @IsNotEmpty()
  @IsUUID()
  task_id: string;

  @IsNotEmpty()
  @IsUUID()
  assignee_id: string;
}

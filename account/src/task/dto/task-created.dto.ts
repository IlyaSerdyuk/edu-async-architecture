import { IsNotEmpty, IsUUID } from 'class-validator';

export class TaskCreatedDto {
  @IsNotEmpty()
  @IsUUID()
  public_id: string;

  jira_id: string;

  @IsNotEmpty()
  title: string;
}

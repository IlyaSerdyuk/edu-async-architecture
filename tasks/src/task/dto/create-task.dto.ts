import { IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  jira_id: string;

  @IsNotEmpty()
  title: string;
}

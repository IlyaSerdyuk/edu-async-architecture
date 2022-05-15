import { IsNotEmpty, IsUUID } from 'class-validator';

export class TaskCreatedDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  title: string;
}

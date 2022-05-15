import { IsNotEmpty, IsUUID } from 'class-validator';

export class UserCreatedDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  role: string;
}

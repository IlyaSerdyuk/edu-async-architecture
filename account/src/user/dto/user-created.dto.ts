import { IsNotEmpty, IsUUID } from 'class-validator';

export class UserCreatedDto {
  @IsNotEmpty()
  @IsUUID()
  public_id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  role: string;

  @IsNotEmpty()
  email: string;
}

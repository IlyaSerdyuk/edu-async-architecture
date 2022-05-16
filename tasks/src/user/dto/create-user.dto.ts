import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsUUID()
  public_id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  role: string;
}

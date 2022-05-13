import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /** Добавить пользователя */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Пока пользователи могут создаваться только одним событием,
    // по этому нет смысла делать InsertOrUpdate
    return this.userRepository.save({
      public_id: createUserDto.id,
      name: createUserDto.name,
      role: createUserDto.role,
    });
  }
}

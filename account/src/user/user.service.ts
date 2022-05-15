import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserCreatedDto } from './dto/user-created.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  /** Добавить пользователя */
  async create(dto: UserCreatedDto): Promise<User> {
    const user = await this.getByPublicId(dto.id);
    user.name = dto.name;
    user.role = dto.role;
    return this.userRepository.save(user);
  }

  /** Найти или создать пользователя по публичному идентификатору */
  async getByPublicId(public_id: string): Promise<User> {
    const user = this.userRepository.findOne({ public_id });
    return user || this.userRepository.save({ public_id });
  }
}

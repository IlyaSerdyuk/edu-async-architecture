import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';

import { User } from './user.entity';
import { TaskModule } from 'src/task/task.module';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), TaskModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

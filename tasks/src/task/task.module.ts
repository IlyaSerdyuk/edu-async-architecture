import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task } from './task.entity';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { TaskBroker } from './task.broker';
import { MessageBroker } from '../message-broker.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User]),
    MessageBroker,
  ],
  providers: [TaskService, TaskBroker, UserService],
  controllers: [TaskController],
})
export class TaskModule {}

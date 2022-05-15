import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessageBroker } from '../message-broker.module';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { TaskBroker } from './task.broker';
import { TaskController } from './task.controller';
import { Task } from './task.entity';
import { TaskService } from './task.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User]), MessageBroker],
  providers: [TaskService, TaskBroker, UserService],
  controllers: [TaskController],
})
export class TaskModule {}

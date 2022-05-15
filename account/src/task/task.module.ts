import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

import { MessageBroker } from '../message-broker.module';
import { TaskController } from './task.controller';
import { Task } from './task.entity';
import { TaskService } from './task.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), MessageBroker, UserModule],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}

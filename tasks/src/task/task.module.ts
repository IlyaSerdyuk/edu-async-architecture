import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task } from './task.entity';
import { User } from '../user/user.entity';
import { UserService } from 'src/user/user.service';
import { TaskBroker } from './task.broker';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, User]),
    ClientsModule.register([
      {
        name: 'message-broker',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'tasks',
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: 'tasks-users',
          },
        },
      },
    ]),
  ],
  providers: [TaskService, TaskBroker, UserService],
  controllers: [TaskController],
})
export class TaskModule {}

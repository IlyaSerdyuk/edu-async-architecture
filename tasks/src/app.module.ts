import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Task } from './task/task.entity';
import { TaskModule } from './task/task.module';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3308,
      username: 'edu_tasks',
      password: 'edu_tasks',
      database: 'edu_tasks',
      entities: [Task, User],
      synchronize: true,
    }),
    TaskModule,
    UserModule,
  ],
})
export class AppModule {}

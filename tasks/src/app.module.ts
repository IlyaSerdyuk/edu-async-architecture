import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { Task } from './task/task.entity';
import { User } from './user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
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

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Task } from './task/task.entity';
import { Transaction } from './user/transaction.entity';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'edu_accounts',
      password: 'edu_accounts',
      database: 'edu_accounts',
      entities: [Task, Transaction, User],
      synchronize: true,
    }),
    UserModule,
  ],
})
export class AppModule {}

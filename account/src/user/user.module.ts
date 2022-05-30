import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessageBroker } from '../message-broker.module';
import { AccountBroker } from './account.broker';
import { TransactionService } from './transaction/transaction.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MessageBroker],
  controllers: [UserController],
  providers: [UserService, TransactionService, AccountBroker],
  exports: [UserService],
})
export class UserModule {}

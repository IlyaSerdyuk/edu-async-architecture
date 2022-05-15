import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessageBroker } from '../message-broker.module';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MessageBroker],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';

import { User } from './user.entity';
import { UserController } from './user.controller';
import { MessageBroker } from '../message-broker.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MessageBroker,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

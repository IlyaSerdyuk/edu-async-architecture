import { ClientKafka, EventPattern } from '@nestjs/microservices';
import { UserService } from './user.service';
import {
  Controller,
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

@Controller()
@Injectable()
export class UserController implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject('message-broker') private readonly messageBroker: ClientKafka,
    private readonly userService: UserService,
  ) {}

  onModuleInit() {
    this.messageBroker.subscribeToResponseOf('user-stream');
  }

  onModuleDestroy() {
    this.messageBroker.close();
  }

  @EventPattern('user-stream')
  async handlerUsers(payload: any) {
    console.log(JSON.stringify(payload));
    this.userService.register(payload.value);
  }
}

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

  /**
   * Обработчик перехватываемых событий из очереди CUD-событий
   * изменения пользователей (в нашем случае только регистрации)
   */
  @EventPattern('user-stream')
  async handlerUsers(payload: any) {
    console.log(JSON.stringify(payload));
    this.userService.create(payload.value);
  }
}

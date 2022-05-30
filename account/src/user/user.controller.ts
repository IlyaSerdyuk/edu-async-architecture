import { Controller } from '@nestjs/common';
import { Ctx, KafkaContext, MessagePattern } from '@nestjs/microservices';

import { UserCreatedDto } from './dto/user-created.dto';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Обработчик перехватываемых событий из очереди CUD-событий
   * изменения пользователей (в нашем случае только регистрации)
   */
  @MessagePattern('users-stream')
  async handlerUserStream(@Ctx() context: KafkaContext) {
    const message = context.getMessage();
    switch (`${message.key}`) {
      case 'UserCreated':
        this.userService.create(message.value as unknown as UserCreatedDto);
        break;
      default:
        console.log(`Unknown key ${message.key} in topic users-stream`);
        break;
    }
  }
}

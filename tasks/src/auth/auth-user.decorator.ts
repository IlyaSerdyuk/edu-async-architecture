import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UserRoles } from '../user/roles.enum';
import { AuthUser } from './auth.entity';

const getTestWorker = () => {
  const user = new AuthUser();
  user.id = 1;
  user.public_id = '8c04ada8-0d7f-4d37-b69b-cb6227c83dc2';
  user.role = UserRoles.Worker;
  return user;
};

const getTestAdmin = () => {
  const user = new AuthUser();
  user.id = 5;
  user.public_id = '03fdbf02-7b6f-4668-846e-062f06c92573';
  user.role = UserRoles.Worker;
  return user;
};

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    console.log(request.user);
    return getTestAdmin();
    return request.user as AuthUser;
  },
);

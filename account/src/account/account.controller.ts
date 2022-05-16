import { Controller, Get, Param } from '@nestjs/common';
import dayjs from 'dayjs';

import { Roles } from '../auth/auth-roles.decorator';
import { User } from '../auth/auth-user.decorator';
import { AuthUser } from '../auth/auth.entity';
import { UserRoles } from '../user/roles.enum';
import { AccountService } from './acount.service';

@Controller('')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  /** Профиль пользователя */
  @Get('/profile')
  @Roles(UserRoles.Worker)
  async profile(
    @User() { user }: AuthUser,
    @Param('from') from: Date,
    @Param('from') till: Date,
  ) {
    const auditLog = await this.accountService.getAuditLog({
      user,
      from,
      till,
    });
    return {
      balance: user.balance,
      auditLog,
    };
  }

  /** Статистика по движению средств в день */
  @Get('/dashboard')
  @Roles(UserRoles.Admin, UserRoles.Accounter)
  async dashboard() {
    const from = dayjs().subtract(3, 'month').startOf('day').toDate();
    const [statistics, daysProfit] = await Promise.all([
      this.accountService.getStat(from),
      this.accountService.getDaysProfit(from),
    ]);
    return {
      statistics,
      daysProfit,
    };
  }
}

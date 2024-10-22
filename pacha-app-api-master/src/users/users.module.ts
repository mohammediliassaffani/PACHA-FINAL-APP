import { Module } from '@nestjs/common';
import { Services } from 'src/utils/constants';
import { UsersService } from 'src/auth/users.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [
    { provide: Services.USERS, useClass: UsersService },
    PrismaService,
  ],

  exports: [{ provide: Services.USERS, useClass: UsersService }],
})
export class UsersModule {}

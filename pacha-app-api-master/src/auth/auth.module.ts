import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AtStrategy } from './strategies/at.strategy';
import { RtStrategy } from './strategies/rt.strategy';
import { Services } from 'src/utils/constants';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),

    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    { provide: Services.AUTH, useClass: AuthService },
    AtStrategy,
    RtStrategy,
    PrismaService,
  ],
  exports: [{ provide: Services.AUTH, useClass: AuthService }],
})
export class AuthModule {}

import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../utils/types';
import { AuthService } from '../services/auth.service';
import { Role, User } from '@prisma/client';
import { UsersModule } from '../../users/users.module';
import { EmailModule } from '../../email/email.module';
import { PrismaService } from '../../prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as argon2 from 'argon2';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let prismaService: PrismaService;

  function createUser({
    id = 1,
    email = 'test@example.com',
    password = 'securePassword123',
    lastname = 'Test',
    firstname = 'User',
    refreshToken = 'RandomToken',
    role = Role.USER as Role,
    isBlocked = false,
    isVerified = false,
    avatarUrl = 'https://github.com/shadcn.png',
    phone = '+212677890-2',
    deletedAt = null,
  }): User {
    return {
      id,
      isVerified,
      email,
      phone,
      password,
      lastname,
      firstname,
      role,
      isBlocked,
      avatarUrl,
      deletedAt,
      refreshToken,
      createdAt: new Date('2023-01-01T00:00:00.000Z'),
      updatedAt: new Date('2023-01-01T00:00:00.000Z'),
    };
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, EmailModule],
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              findFirst: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    prismaService = module.get<PrismaService>(PrismaService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTokens', () => {
    it('should generate access and refresh tokens', async () => {
      // Mock jwtService.signAsync to return tokens
      const accessToken = 'access_token';
      const refreshToken = 'refresh_token';
      jest
        .spyOn(jwtService, 'signAsync')
        .mockImplementationOnce(async () => accessToken);
      jest
        .spyOn(jwtService, 'signAsync')
        .mockImplementationOnce(async () => refreshToken);

      // Mock JwtPayload
      const jwtPayload: JwtPayload = {
        email: 'test@example.com',
        role: Role.USER,
        avatarUrl: 'https://example.com/avatar.png',
        sub: 12345,
        isVerified: true,
        phone: '+1234567890',
      };

      // Call the method
      const result = await service.getTokens(jwtPayload);

      // Assertions
      expect(result).toEqual({
        access_token: accessToken,
        refresh_token: refreshToken,
        expiresIn: expect.any(Number), // Checking if expiresIn is a number
      });
      expect(jwtService.signAsync).toHaveBeenNthCalledWith(1, jwtPayload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      });
      expect(jwtService.signAsync).toHaveBeenNthCalledWith(2, jwtPayload, {
        secret: process.env.JWT_SECRET_REFRESH,
        expiresIn: '45d',
      });
    });
  });

  describe('validateUser', () => {
    it('should return the user if credentials are correct', async () => {
      const user = createUser({});
      const userCredentials = {
        email: user.email,
        password: user.password,
      };
      // Mock Prisma response with user data
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(user);
      // Mock argon2.verify to return true for password validation
      jest.spyOn(argon2, 'verify').mockResolvedValue(true);
      // Call the method
      const result = await service.validateUser(userCredentials);
      // Call the method and expect it to throw HttpException
      await expect(result).rejects.toThrow(
        new HttpException(
          'Your password or email is invalid. Please try again!!',
          HttpStatus.UNAUTHORIZED,
        ),
      );
      // Assertions
      expect(result).toEqual(user);
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { email: userCredentials.email.toLowerCase() },
      });
      expect(argon2.verify).toHaveBeenCalledWith(
        user.password,
        userCredentials.password,
      );
    });
    it('should throw HttpException if user does not exist', async () => {
      const userCredentials = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };
      // Mock Prisma response with null user
      jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);
      // Call the method and expect it to throw HttpException
      await expect(service.validateUser(userCredentials)).rejects.toThrow(
        new HttpException(
          'Your password or email is invalid. Please try again!!',
          HttpStatus.UNAUTHORIZED,
        ),
      );
      // Ensure that argon2.verify is not called since the user does not exist
      expect(argon2.verify).not.toHaveBeenCalled();
    });
  });
});

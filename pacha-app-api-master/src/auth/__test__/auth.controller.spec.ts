import { Test } from '@nestjs/testing';
import { AuthController } from '../controllers/auth.controller';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login-user.dto';
import { AuthService } from '../services/auth.service';
import { Role, User } from '@prisma/client';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: AuthService;
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
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    mockAuthService = moduleRef.get<AuthService>(AuthService);
    controller = moduleRef.get<AuthController>(AuthController);
  });

  describe('registerUser', () => {
    it('should register a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'example@example.com',
        firstname: 'John',
        lastname: 'Doe',
        phone: '+2126567890',
        avatarUrl: 'https://example.com/avatar.jpg',
        password: 'Password123',
      };
      let registerMock;

      jest
        .spyOn(mockAuthService, 'register')
        .mockImplementation(() => registerMock);

      const result = await controller.registerUser(createUserDto);

      expect(result).toEqual(registerMock);
      expect(mockAuthService.register).toHaveBeenCalledWith(createUserDto);
    });
    // Add more test cases for registerUser as needed
  });

  describe('login', () => {
    it('should log in the user', async () => {
      const loginDto: LoginDto = {
        email: 'example@example.com',
        password: 'Password123',
      };
      const expectedToken = 'mockedToken';

      let registerMock;

      jest
        .spyOn(mockAuthService, 'login')
        .mockImplementation(() => registerMock);
      const result = await controller.login(loginDto);

      expect(result).toEqual(expectedToken);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });
    // Add more test cases for login as needed
  });

  // Add similar tests for logout and refreshTokens endpoints
});

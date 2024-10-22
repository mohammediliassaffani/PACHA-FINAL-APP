import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Services } from '../../utils/constants';
import { IUsersService } from '../../users/interfaces/users.interface';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import * as argon from 'argon2';
import { LoginDto } from '../dto/login-user.dto';
import {
  CredentialsParams,
  JwtPayload,
  Tokens,
  rfTokenParam,
} from '../../utils/types';
import { IAuthService } from '../interfaces/auth.interface';

import * as argon2 from 'argon2';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(Services.USERS) private readonly userService: IUsersService,

    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  /**
   * Validates the user credentials by checking if the provided email and password match a user in the database.
   * @param userCredentialsParams The user credentials containing the email and password.
   * @returns The validated user if the credentials are correct, otherwise null.
   * @throws {HttpException} If the provided email or password is incorrect.
   */
  async validateUser(userCredentialsParams: LoginDto): Promise<Users> {
    // Extract the email from the user credentials
    const userAuth = userCredentialsParams.email.toLowerCase();

    // Find the user based on the email using Prisma
    const user = await this.prisma.users.findFirst({
      where: {
        email: userAuth,
      },
    });

    // If no user is found, throw an HttpException with an unauthorized status
    if (!user) {
      throw new HttpException(
        'Uw wachtwoord of e-mail is ongeldig. Probeer het opnieuw!',
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Verify if the provided password matches the user's password using argon
    const isPasswordValid = await argon.verify(
      user.password,
      userCredentialsParams.password,
    );

    // Return the validated user if the password is correct, otherwise return null
    return isPasswordValid ? user : null;
  }

  /**
   * Validates the user's refresh token to check if the user is authenticated.
   * @param {number} userId - The ID of the user to validate the token for.
   * @returns {Promise<void>} - A promise that resolves if the user is authenticated, otherwise throws an HttpException.
   * @throws {HttpException} - If the user is not authenticated (no refresh token found).
   */
  async validateUserToken(userId: number): Promise<void> {
    // Find the user based on the _id using the userService
    const user = await this.userService.retrieveUserDetails(
      { id: userId },
      { selectAll: true },
    );

    // Check if the user has a refresh token
    if (!user?.refreshToken) {
      // If the user does not have a refresh token, throw an HttpException with unauthorized status
      throw new HttpException(
        'User Is not authenticated!',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  /**
   * Generates access and refresh tokens for the provided JWT payload.
   * @param {JwtPayload} jwtPayload - The JWT payload containing user information.
   * @returns {Promise<Tokens>} - A promise that resolves to an object containing access and refresh tokens.
   */ async getTokens({ sub, email }: JwtPayload): Promise<Tokens> {
    // Create the JWT payload
    const jwtPayload: JwtPayload = {
      email,
      sub,
    };

    // Generate the access token
    const access_token = await this.jwtService.signAsync(jwtPayload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    // Generate the refresh token
    const refresh_token = await this.jwtService.signAsync(jwtPayload, {
      secret: process.env.JWT_SECRET_REFRESH,
      expiresIn: '45d',
    });

    // Return the generated access and refresh tokens
    return {
      access_token,
      refresh_token,
    };
  }
  /**
   * Refresh access and refresh tokens for the provided user ID and refresh token.
   * @param {rfTokenParam} param - Parameters containing user ID and refresh token.
   * @returns {Promise<{ tokens: Tokens }>} - A promise that resolves to an object containing new access and refresh tokens.
   */
  async refreshTokens({
    userId,
    rt,
  }: rfTokenParam): Promise<{ tokens: Tokens; user: Partial<Users> }> {
    // Convert the userId string to an ObjectId

    // Find the user based on the _id using the userService
    const user = await this.userService.retrieveUserDetails(
      { id: userId },
      { selectAll: true },
    );

    // Check if the user and refresh token exist
    if (!user || !user.refreshToken) {
      // If the user or refresh token is invalid, throw a ForbiddenException
      throw new HttpException('Access Denied', HttpStatus.FORBIDDEN);
    }

    // Verify if the provided refresh token matches the stored refresh token
    const rtMatches = await argon.verify(user.refreshToken, rt);

    // Check if the refresh token matches
    if (!rtMatches) {
      // If the refresh token does not match, throw a ForbiddenException
      throw new HttpException('Access Denied', HttpStatus.FORBIDDEN);
    }

    // Create new access and refresh tokens
    const tokens = await this.getTokens({
      sub: user.id,
      email: user.email,
    });
    const { email, firstname, id, lastname, password } = user;

    // Update the refresh token hash in the userService
    await this.userService.updateRtHash(user.id, tokens.refresh_token);

    // Return the new access and refresh tokens and User
    return { tokens, user: { email, firstname, id, lastname, password } };
  }
  /**
   * Logout the user with the provided ID.
   * @param {number} id - The ID of the user to logout.
   * @returns {Promise<{ message: string }>} - A promise that resolves when the user is successfully logged out.
   */
  async logout(id: number): Promise<{ message: string }> {
    return this.userService.removeRT(id);
  }
  /**
   * Authenticate user credentials and generate access and refresh tokens.
   * @param {CredentialsParams} userCredentials - The user credentials for authentication.
   * @returns {Promise<{ tokens: Tokens; user: Partial<User> }>} - A promise that resolves to an object containing generated tokens and user information.
   */
  async login(
    userCredentials: CredentialsParams,
  ): Promise<{ tokens: Tokens; user: Partial<Users> }> {
    // Validate user credentials
    const user = await this.validateUser(userCredentials);

    // Check if user credentials are valid
    if (!user) {
      // If the user credentials are invalid, throw an HttpException with unauthorized status
      throw new HttpException(
        'Uw wachtwoord of e-mail is ongeldig. Probeer het opnieuw!',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const { email, id, firstname, lastname } = user;

    // Create the payload for generating tokens
    const payload: JwtPayload = {
      email,
      sub: id,
    };

    // Generate tokens for the authenticated user
    const tokens = await this.getTokens(payload);

    // Update the refresh token hash in the userService
    await this.userService.updateRtHash(payload.sub, tokens.refresh_token);

    // Return the generated tokens and user
    return {
      tokens,
      user: {
        email,
        firstname,
        lastname,
        id,
      },
    };
  }

  /**
   * Resets the user's password using the provided reset token.
   * @param resetToken The password reset token received from the user.
   * @param newPassword The new password to be set for the user.
   * @returns A success message indicating that the password has been reset.
   * @throws {HttpException} If the reset token is invalid or expired.
   */
  async resetPassword(
    email: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const user = await this.prisma.users.findFirst({
      where: { email },
    });

    if (!user || user.password !== 'non-password') {
      throw new HttpException('Invalid invite', HttpStatus.BAD_REQUEST);
    }

    // Hash the new password
    const passwordHash = await argon2.hash(newPassword);

    // Update the user's password in the database
    await this.prisma.users.update({
      where: { id: user.id },
      data: {
        password: passwordHash,
      },
    });

    return { message: 'Your password has been successfully reset.' };
  }
  async allHasPasswords(): Promise<boolean> {
    const user = await this.prisma.users.findFirst({
      where: { password: 'non-password' },
    });
    return !!user;
  }
}

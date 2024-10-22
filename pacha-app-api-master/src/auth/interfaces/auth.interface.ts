import { Users } from '@prisma/client';
import {
  Tokens,
  JwtPayload,
  rfTokenParam,
  CredentialsParams,
} from 'src/utils/types';
import { LoginDto } from '../dto/login-user.dto';

/**
 * Interface for AuthService providing authentication and authorization functionality.
 */
export interface IAuthService {
  /**
   * Validates user credentials by checking if the provided email and password match a user in the database.
   * @param {LoginDto} userCredentialsParams - The user credentials containing the email and password.
   * @returns {Promise<User>} - A promise that resolves to the validated user if the credentials are correct, otherwise null.
   * @throws {HttpException} - If the provided email or password is incorrect.
   */
  validateUser(userCredentialsParams: LoginDto): Promise<Users>;

  /**
   * Validates the user's refresh token to check if the user is authenticated.
   * @param {number} userId - The ID of the user to validate the token for.
   * @returns {Promise<void>} - A promise that resolves if the user is authenticated, otherwise throws an HttpException.
   * @throws {HttpException} - If the user is not authenticated (no refresh token found).
   */
  validateUserToken(userId: number): Promise<void>;

  /**
   * Generates access and refresh tokens for the provided JWT payload.
   * @param {JwtPayload} jwtPayload - The JWT payload containing user information.
   * @returns {Promise<Tokens>} - A promise that resolves to an object containing access and refresh tokens.
   */
  getTokens(jwtPayload: JwtPayload): Promise<Tokens>;

  /**
   * Refreshes access and refresh tokens for the provided user ID and refresh token.
   * @param {rfTokenParam} param - Parameters containing user ID and refresh token.
   * @returns {Promise<{ tokens: Tokens }>} - A promise that resolves to an object containing new access and refresh tokens.
   */
  refreshTokens(param: rfTokenParam): Promise<{ tokens: Tokens }>;

  /**
   * Logs out the user with the provided ID.
   * @param {number} id - The ID of the user to logout.
   * @returns {Promise<{ message: string }>} - A promise that resolves when the user is successfully logged out.
   */
  logout(id: number): Promise<{ message: string }>;

  /**
   * Authenticates user credentials and generates access and refresh tokens.
   * @param {CredentialsParams} userCredentials - The user credentials for authentication.
   * @returns {Promise<{ tokens: Tokens; user: Partial<User> }>} - A promise that resolves to an object containing generated tokens and user information.
   */
  login(
    userCredentials: CredentialsParams,
  ): Promise<{ tokens: Tokens; user: Partial<Users> }>;

  /**
   * Resets the user's password using the provided reset token.
   * @param resetToken The password reset token received from the user.
   * @param newPassword The new password to be set for the user.
   * @returns A success message indicating that the password has been reset.
   * @throws {HttpException} If the reset token is invalid or expired.
   */
  resetPassword(
    email: string,
    newPassword: string,
  ): Promise<{ message: string }>;

  allHasPasswords(): Promise<boolean>;
}

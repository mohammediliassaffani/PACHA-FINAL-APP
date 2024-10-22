import { Controller, Get, Post, Inject, Body, UseGuards } from '@nestjs/common';
import { Routes, Services } from '../../utils/constants';
import { IAuthService } from '../interfaces/auth.interface';
import { LoginDto } from '../dto/login-user.dto';
import { JwtPayload } from '../../utils/types';
import { RtGuard } from 'src/utils/guards';
import { GetCurrentUser, GetCurrentUserId } from 'src/utils/decorators';
import { ResetPasswordDto } from '../dto/reset-password.dto';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private readonly authService: IAuthService,
  ) {}

  // This endpoint is responsible for handling user login requests.
  // The client must provide a 'LoginDto' object in the request body, containing the user's credentials.
  // If the provided credentials are valid, the server responds with a JSON Web Token (JWT) for the authenticated user.
  // This token should be used by the client to make authenticated requests to other protected endpoints.
  @Post('sign-in')
  login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials);
  }

  // Endpoint for Logging Out
  // It accepts a GET request at the 'logout' route.
  // It requires a valid access token.
  // It returns the result of the logout operation.
  @UseGuards(RtGuard)
  @Get('logout')
  logout(@GetCurrentUser() { sub }: JwtPayload) {
    return this.authService.logout(+sub);
  }

  // Endpoint for Refreshing Tokens
  // It accepts a GET request at the 'refresh' route.
  // It requires a valid refresh token.
  // It returns a new set of access and refresh tokens.
  @UseGuards(RtGuard)
  @Get('refresh')
  async refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') rt: string,
  ) {
    return await this.authService.refreshTokens({ userId: +userId, rt });
  }
  @Get('has-rest-password')
  async checkAllHasPassword() {
    return await this.authService.allHasPasswords();
  }
  @Post('rest-password')
  async restPassword(@Body() { email, newPassword }: ResetPasswordDto) {
    return await this.authService.resetPassword(email, newPassword);
  }
}

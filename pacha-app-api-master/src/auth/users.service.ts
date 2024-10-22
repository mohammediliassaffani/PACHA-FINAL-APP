import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { IUsersService } from 'src/users/interfaces/users.interface';

@Injectable()
export class UsersService implements IUsersService {
  constructor(private prisma: PrismaService) {}

  private async findUser(userId: number) {
    return this.prisma.users.findUnique({
      where: { id: userId },
    });
  }

  private async updateUserFields(userId: number, updateData: Partial<Users>) {
    return this.prisma.users.update({
      where: { id: userId },
      data: updateData,
    });
  }

  /**
   * Retrieves user details from the database based on the provided parameters and options.
   * @param params The parameters to search for a user (e.g., id, email, username)
   * @param options The options for retrieving user details (e.g., include sensitive data)
   * @returns The found user or null if no user matches the criteria
   */
  async retrieveUserDetails(
    params: { id?: number; email?: string },
    options?: { selectAll?: boolean },
  ): Promise<Partial<Users> | null> {
    const selectFields = {
      id: true,
      email: true,
      firstname: true,
      lastname: true,
      password: false,
      refreshToken: false,
    };

    if (options?.selectAll) {
      selectFields.password = true;
      selectFields.refreshToken = true;
    }

    return this.prisma.users.findFirst({
      where: params,
      select: selectFields,
    });
  }

  async updatePassword(
    id: number,
    newPassword: string,
    oldPassword: string,
  ): Promise<void> {
    try {
      const user = await this.findUser(id);
      if (!user) {
        throw new HttpException(
          'Gebruiker niet gevonden',
          HttpStatus.NOT_FOUND,
        );
      }

      const isOldPasswordValid = await argon2.verify(
        user.password,
        oldPassword,
      );
      if (!isOldPasswordValid) {
        throw new HttpException(
          'Oud wachtwoord komt niet overeen',
          HttpStatus.BAD_REQUEST,
        );
      }

      const isNewPasswordSameAsOld = await argon2.verify(
        user.password,
        newPassword,
      );
      if (isNewPasswordSameAsOld) {
        throw new HttpException(
          'Nieuw wachtwoord komt overeen met oud wachtwoord',
          HttpStatus.BAD_REQUEST,
        );
      }

      const hash = await argon2.hash(newPassword);
      await this.prisma.users.update({
        where: { id },
        data: { password: hash },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Wachtwoordupdate mislukt',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeRT(id: number): Promise<{ message: string }> {
    const user = await this.retrieveUserDetails({ id }, { selectAll: true });

    if (!user || !user.refreshToken) {
      throw new HttpException(
        'User does not exist or is not logged in.',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.updateUserFields(user.id, { refreshToken: null });

    return { message: 'User has been logged out successfully!' };
  }

  async updateRtHash(id: number, rt: string): Promise<void> {
    const hashRt = await argon2.hash(rt);
    await this.updateUserFields(id, { refreshToken: hashRt });
  }
}

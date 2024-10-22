import { Users } from '@prisma/client';

/**
 * Parameters for retrieving user details.
 */
interface UserDetailsParams {
  id?: number;
  email?: string;
  name?: string;
}

/**
 * Options for retrieving user details.
 */
interface UserDetailsOptions {
  selectAll?: boolean;
}

/**
 * Interface for the UsersService class.
 */
export interface IUsersService {
  /**
   * Retrieves user details from the database based on the provided parameters and options.
   * @param params The parameters to search for a user (e.g., id, email, username)
   * @param options The options for retrieving user details (e.g., include sensitive data)
   * @returns The found user or null if no user matches the criteria
   */
  retrieveUserDetails(
    params: UserDetailsParams,
    options?: UserDetailsOptions,
  ): Promise<Partial<Users> | null>;

  /**
   * Removes the refresh token of a user.
   * @param name The name of the user
   * @returns A message indicating the success of the operation
   */
  removeRT(name: number): Promise<{ message: string }>;

  /**
   * Updates the refresh token hash of a user.
   * @param id The ID of the user
   * @param rt The refresh token
   */
  updateRtHash(id: number, rt: string): Promise<void>;
}

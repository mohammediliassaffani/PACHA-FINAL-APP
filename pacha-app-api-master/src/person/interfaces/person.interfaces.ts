import { Person } from '@prisma/client';
import { CreatePersonDto } from '../dto/create-person.dto';

export interface IPersonService {
  create(createPerson: CreatePersonDto & { docs: string[] }): Promise<Person>;
  /**
   * Retrieves filtered and paginated persons with sorting.
   * @param page - The current page number (1-based).
   * @param filters - The filter parameters for the query.
   * @param orderBy - The field to order the results by.
   * @param orderDirection - 'asc' or 'desc' to specify sort direction.
   * @param perPage - Number of records per page (default: 10).
   * @returns An object containing filtered persons and total pages.
   */
  find(
    page: number,
    filters: {
      search?: string;
      CNIMan?: string | string[];
      CNIWoman?: string | string[];
    },
    orderBy: string,
    orderDirection: 'asc' | 'desc',
    perPage: number,
  ): Promise<{ persons: Partial<Person>[]; totalPages: number }>;

  /**
   * Deletes multiple persons by their IDs.
   * @param input - An object containing the array of person IDs to delete.
   * @returns An object with data and error fields.
   * @throws HttpException if something goes wrong.
   */
  deletePersons(input: {
    ids: number[];
  }): Promise<{ data: null; error: string | null }>;
}

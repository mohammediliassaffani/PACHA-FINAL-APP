import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { IPersonService } from './interfaces/person.interfaces';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from '@prisma/client';

@Injectable()
export class PersonService implements IPersonService {
  constructor(private prisma: PrismaService) {}
  /**
   * Creates a new Person record in the database.
   * First, it checks if a person with the same CNIMan or CNIWoman exists,
   * and if found, throws a ConflictException.
   *
   * @param createPerson - Data for creating the new person, including docs (optional)
   * @returns The newly created Person object.
   * @throws ConflictException if a person with the same CNIMan or CNIWoman already exists.
   * @throws InternalServerErrorException for other errors.
   */
  async create(
    createPerson: CreatePersonDto & { docs?: string[] },
  ): Promise<Person> {
    try {
      // Check if the CNIMan or CNIWoman already exists
      const existingPerson = await this.prisma.person.findFirst({
        where: {
          OR: [
            { CNIMan: createPerson.CNIMan },
            { CNIWoman: createPerson.CNIWoman },
          ],
        },
      });

      if (existingPerson) {
        throw new HttpException(
          "Une personne avec cette carte d'identité nationale existe déjà. " +
            existingPerson.firstName +
            ' ' +
            existingPerson.lastName,
          HttpStatus.CONFLICT,
        );
      }
      const newPerson = await this.prisma.person.create({
        data: {
          CNIMan: createPerson.CNIMan,
          CNIWoman: createPerson.CNIWoman,
          firstName: createPerson.firstName,
          lastName: createPerson.lastName,
          docs: createPerson.docs,
        },
      });

      return newPerson;
    } catch (error) {
      if (error instanceof HttpException) error;
      throw new InternalServerErrorException(
        'Erreur lors de la création de la personne.',
      );
    }
  }

  /**
   * Retrieves filtered and paginated persons with sorting.
   * @param page - The current page number (1-based).
   * @param filters - The filter parameters for the query.
   * @param orderBy - The field to order the results by.
   * @param orderDirection - 'asc' or 'desc' to specify sort direction.
   * @param perPage - Number of records per page (default: 10).
   * @returns An object containing filtered persons and total pages.
   */
  async find(
    page: number = 1,
    filters: {
      search?: string;
      CNIMan?: string | string[];
      CNIWoman?: string | string[];
    },
    orderBy: string = 'updatedAt',
    orderDirection: 'asc' | 'desc' = 'desc',
    perPage: number = 10,
  ): Promise<{ persons: Partial<Person>[]; totalPages: number }> {
    try {
      const skip = (page - 1) * perPage;
      const query: any = {};

      // Add search filters
      if (filters.search) {
        query.OR = [
          { firstName: { contains: filters.search, mode: 'insensitive' } },
          { lastName: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      // Filter by CNIMan (case-insensitive)
      if (filters?.CNIMan) {
        query.CNIMan = { contains: filters.CNIMan, mode: 'insensitive' };
      }

      // Filter by CNIWoman (case-insensitive)
      if (filters?.CNIWoman) {
        query.CNIWoman = { contains: filters.CNIWoman, mode: 'insensitive' };
      }

      // Sorting
      const orderByOption: any = {};
      if (orderBy) {
        orderByOption[orderBy] = orderDirection;
      } else {
        // Default sorting by updatedAt in descending order
        orderByOption.updatedAt = 'desc';
      }

      // Fetch persons with filters, sorting, and pagination
      const persons = await this.prisma.person.findMany({
        where: query,
        orderBy: orderByOption,
        skip,
        take: perPage,
        select: {
          firstName: true,
          lastName: true,
          CNIMan: true,
          CNIWoman: true,
          docs: true,
          id: true,
        },
      });

      // Count total persons matching the filters
      const total = await this.prisma.person.count({ where: query });
      const totalPages = Math.ceil(total / perPage);

      return { persons, totalPages };
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la récupération des personnes.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // Update the person
  async update(id: number, updatePersonDto: UpdatePersonDto): Promise<Person> {
    try {
      // Check if the person exists
      const existingPerson = await this.prisma.person.findUnique({
        where: { id },
      });

      if (!existingPerson) {
        throw new HttpException('Person not found', HttpStatus.NOT_FOUND);
      }
      // Update the person with the provided data
      const updatedPerson = await this.prisma.person.update({
        where: { id },
        data: {
          ...updatePersonDto,
        },
      });

      return updatedPerson;
    } catch (error) {
      throw new InternalServerErrorException('Error updating the person');
    }
  }

  /**
   * Deletes multiple persons by their IDs.
   * @param input - An object containing the array of person IDs to delete.
   * @returns An object with data and error fields.
   * @throws HttpException if something goes wrong.
   */
  async deletePersons(input: {
    ids: number[];
  }): Promise<{ data: null; error: string | null }> {
    try {
      // Start the transaction
      await this.prisma.person.deleteMany({
        where: {
          id: { in: input.ids },
        },
      });

      return {
        data: null,
        error: null,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la suppression des personnes.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

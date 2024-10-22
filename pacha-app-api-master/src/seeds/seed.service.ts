import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeedService {
  constructor(private readonly prisma: PrismaService) {}

  async seed() {
    const users = [
      {
        email: 'john.doe@example.com',
        firstname: 'John',
        lastname: 'Doe',
      },
      {
        email: 'jane.doe@example.com',
        firstname: 'Jane',
        lastname: 'Doe',
      },
    ];

    // Seed users
    for (const user of users) {
      await this.prisma.users.create({
        data: user,
      });
    }

    console.log('Seeding completed');
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeedService {
  constructor(private readonly prisma: PrismaService) {}

  async seed() {
    const users = [
      {
        email: 'iliass@example.com',
        firstname: 'iliass',
        lastname: 'aff',
      },
      {
        email: 'med@example.com',
        firstname: 'ilia',
        lastname: 'med',
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

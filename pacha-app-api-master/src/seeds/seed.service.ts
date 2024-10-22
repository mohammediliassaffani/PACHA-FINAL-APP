import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeedService {
  constructor(private readonly prisma: PrismaService) {}

  async seed() {
    const users = [
      {
        email: 'hicham@pacha.com',
        firstname: 'hicham',
        lastname: 'pacha',
      },
      {
        email: 'wafae@pacha.com',
        firstname: 'wafae',
        lastname: 'aux',
      },
      {
        email: 'abdilah@pacha.com',
        firstname: 'abdilah',
        lastname: 'auxx',
      },
      {
        email: 'iliass@pacha.com',
        firstname: 'iliass',
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

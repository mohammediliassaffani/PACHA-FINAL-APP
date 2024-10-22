import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { Services } from 'src/utils/constants';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PersonController],
  providers: [
    { useClass: PersonService, provide: Services.PERSON },
    PrismaService,
  ],
  exports: [{ useClass: PersonService, provide: Services.PERSON }],
})
export class PersonModule {}

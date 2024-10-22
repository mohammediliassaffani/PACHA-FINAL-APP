import { NestFactory } from '@nestjs/core';
import { SeedService } from './seed.service';
import { SeedModule } from './seed.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);
  const seedService = app.get(SeedService);

  await seedService.seed();

  await app.close();
}

bootstrap()
  .then(() => {
    console.log('Seeding finished successfully');
  })
  .catch((err) => {
    console.error('Seeding failed', err);
  });

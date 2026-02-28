#!/usr/bin/env tsx

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.USER_DB_URL,
});

const prisma = new PrismaClient({
  adapter: adapter,
});

async function main() {
  await prisma.userPosition.upsert({
    where: { id: '5917613f-f6f3-4ff1-820d-8a8eb828701d' },
    update: {},
    create: { id: '5917613f-f6f3-4ff1-820d-8a8eb828701d', name: 'HRD' },
  });

  await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      id: '2aa36d04-ef8e-40e9-a782-62546bb77452',
      name: 'Admin HRD',
      email: 'admin@gmail.com',
      phone: '082656126835',
      password: '$2a$10$OETRK7fV/Cg3nIsXONHGnO.g0eiKrHl9M0YdPp.jIfvgimRphUIse',
      positionId: '5917613f-f6f3-4ff1-820d-8a8eb828701d',
    },
  });
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());

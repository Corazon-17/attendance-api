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

  await prisma.userPosition.upsert({
    where: { id: '8f6b6f5e-9a6d-4c2e-b8f1-3d9e6a1c4b21' },
    update: {},
    create: { id: '8f6b6f5e-9a6d-4c2e-b8f1-3d9e6a1c4b21', name: 'IT' },
  });

  await prisma.userPosition.upsert({
    where: { id: '3c1d7a92-5f4e-4a8b-9c12-6e2f1b7d8a34' },
    update: {},
    create: { id: '3c1d7a92-5f4e-4a8b-9c12-6e2f1b7d8a34', name: 'Operations' },
  });

  await prisma.userPosition.upsert({
    where: { id: '9c7d2e4f-6a8b-4c1d-b325-4f6a8b2e7d91' },
    update: {},
    create: { id: '9c7d2e4f-6a8b-4c1d-b325-4f6a8b2e7d91', name: 'Sales' },
  });

  await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      id: '2aa36d04-ef8e-40e9-a782-62546bb77452',
      name: 'Admin HRD',
      email: 'admin@gmail.com',
      phone: '082656126835',
      password: '$2b$10$X3bdFHkNMM4C4jP4aydCWeGlAOoMVc01t94iZYFbC9xD.wTLw7HiS',
      positionId: '5917613f-f6f3-4ff1-820d-8a8eb828701d',
    },
  });
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());

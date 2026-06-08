import prismaModule from '@prisma/client'; // Import the whole module
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// Destructure PrismaClient from the default export
const { PrismaClient } = prismaModule;

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
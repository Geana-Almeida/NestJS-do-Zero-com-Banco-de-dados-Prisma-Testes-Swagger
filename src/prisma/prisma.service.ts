import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../generated/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const adapter = new PrismaBetterSqlite3({ url : process.env.DATABASE_URL  || 'file:./dev.db' });
    super({ adapter })
  }
}


// npx prisma migrate dev 
// npx prisma generate
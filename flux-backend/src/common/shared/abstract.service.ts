import { Injectable } from '@nestjs/common';
import { PrismaService } from '../persistence/prisma.service';

@Injectable()
export abstract class AbstractService<T> {
  constructor(protected readonly prismaService: PrismaService) {}

  abstract create(data: any): Promise<T>;

  abstract list(user_id?: string): Promise<T[]>;

  abstract update(id: string, data: any, user_id?: string): Promise<T>;

  abstract delete(id: string, user_id?: string): Promise<void>;

  abstract findOne(id: string, user_id?: string): Promise<T>;
}

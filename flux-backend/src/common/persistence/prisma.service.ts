import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly loggerService: LoggerService) {
    super();
    loggerService.contextName = PrismaService.name;
  }

  async onModuleInit() {
    await this.$connect();
    this.loggerService.info('connection established with database! 🚀');
  }
}

import { Global, Module } from '@nestjs/common';
import { LoggerModule } from './logger/logger.module';
import { PersistenceModule } from './persistence/persistence.module';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    LoggerModule,
    PersistenceModule,
  ],
  exports: [LoggerModule, PersistenceModule],
})
export class CommonModule {}

import { Injectable } from '@nestjs/common';

import { typeOrmAsyncConfig } from 'config/typeorm.config';

@Injectable()
export class MigrationsService {
  async runMigrations() {
    if (!typeOrmAsyncConfig.dataSourceFactory) {
      throw new Error('dataSourceFactory is undefined in typeOrmAsyncConfig');
    }
    const dataSource = await typeOrmAsyncConfig.dataSourceFactory();
    const conncetion = await dataSource.initialize();
    await conncetion.runMigrations();
  }
}

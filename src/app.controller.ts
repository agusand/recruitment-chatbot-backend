import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';
import { MigrationsService } from 'services/migrations/migrations.service';

@Controller()
export class AppController {
  constructor(
    private readonly _appService: AppService,
    private readonly _migrationsService: MigrationsService,
  ) {
    this.runMigrations();
  }

  @ApiTags('Hello!')
  @Get()
  getHello(): string {
    return this._appService.getHello();
  }

  async runMigrations() {
    try {
      return await this._migrationsService.runMigrations();
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
      }
    }
  }
}

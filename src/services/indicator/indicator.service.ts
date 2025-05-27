import { InsertResult, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateIndicatorDto } from 'dtos/indicator/create-indicator.dto';

import Indicator from 'entities/indicator.entity';

@Injectable()
export class IndicatorService {
  constructor(@InjectRepository(Indicator) private _indicatorRepository: Repository<Indicator>) {}

  createIndicators(indicatorList: CreateIndicatorDto[]): Promise<InsertResult> {
    return this._indicatorRepository.insert(indicatorList);
  }

  getIndicatorsByEmail(email: string): Promise<Indicator[]> {
    return this._indicatorRepository.find({ where: { profile: email } });
  }
}

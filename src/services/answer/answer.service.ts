import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';

import { CreateAnswerDto } from 'dtos/answer/create-answer.dto';

import Answer from 'entities/answer.entity';
import { GetAnswerDto } from 'dtos/answer/get-answers.dto';

@Injectable()
export class AnswerService {
  constructor(@InjectRepository(Answer) private _answerRepository: Repository<Answer>) {}

  createAnswer(answer: CreateAnswerDto): Promise<InsertResult> {
    return this._answerRepository.insert(answer);
  }

  getAnswersByEmail(email: string): Promise<Answer[]> {
    return this._answerRepository.find({ where: { profile: email } });
  }

  async getAnswersWithQuestion(email: string, position?: number): Promise<GetAnswerDto[]> {
    const result = (await this._answerRepository.find({ where: { profile: email }, relations: ['questionId'] })) as unknown as GetAnswerDto[];
    return position ? result.filter((answer) => answer.questionId.position === 1) : result;
  }
}

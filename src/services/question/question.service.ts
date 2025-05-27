import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';

import { CreateQuestionDto } from 'dtos/question/create-question.dto';

import Question from 'entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(@InjectRepository(Question) private _questionRepository: Repository<Question>) {}

  createQuestion(question: CreateQuestionDto): Promise<InsertResult> {
    return this._questionRepository.insert(question);
  }

  getQuestions(): Promise<Question[]> {
    return this._questionRepository.find();
  }
}

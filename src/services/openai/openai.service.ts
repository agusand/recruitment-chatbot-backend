import OpenAI from 'openai';
import { Injectable } from '@nestjs/common';

import { ParsedResponse, QuestionAnswerPair } from './types';

import { AnswerService } from 'services/answer/answer.service';
import { IndicatorService } from 'services/indicator/indicator.service';
import { PositionService } from 'services/position/position.service';
import { AppLogger } from '../../utils/logger.service';

@Injectable()
export class OpenaiService {
  private readonly openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  constructor(
    private readonly _answerService: AnswerService,
    private readonly _indicatorsService: IndicatorService,
    private readonly _positionService: PositionService,
    private readonly _logger: AppLogger,
  ) {
    this._logger.setContext('OpenaiService');
  }

  async processAnswer(qaPair: QuestionAnswerPair, position: string, temperature = 0.1) {
    this._logger.log(
      `processAnswer called with: ${JSON.stringify({
        question: qaPair.question.question,
        answer: qaPair.answer,
        cryteria: qaPair.question.cryteria,
        position,
        temperature,
      })}`,
    );
    try {
      const completion = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an assistant that only responds with a number from 00 to 99.' },
          { role: 'user', content: this.generatePrompt(qaPair.question.question, qaPair.answer, qaPair.question.cryteria, position) },
        ],
        temperature,
      });
      this._logger.log(`OpenAI completion response: ${JSON.stringify(completion)}`);
      const choiceText =
        completion.choices && completion.choices[0]?.message?.content ? completion.choices[0].message.content.replace(/\D/g, '').slice(0, 2) : '';
      this._logger.log(`Extracted choiceText: ${choiceText}`);
      return { cryteria: qaPair.question.cryteria, result: choiceText };
    } catch (error) {
      this._logger.error(`Error in processAnswer: ${error.message}`);
    }
  }

  generatePrompt(question: string, answer: string, cryteria: string, position: string) {
    const prompt = `Based on the following question asked to a user: "${question}",\nand the respective user's answer: "${answer}",\ngive me a number from 00 to 99 that represents a score indicating ${cryteria} about the user's profile for the position ${position}.\nIt is important that your answer only includes the requested number.`;
    this._logger.log(`Generated prompt: ${prompt}`);
    return prompt;
  }

  async processEveryAnswer(email: string, position: number) {
    this._logger.log(`processEveryAnswer called with: ${JSON.stringify({ email, position })}`);
    const currentIndicators = (await this._indicatorsService.getIndicatorsByEmail(email)).map((indicator) => indicator.indicator);
    this._logger.log(`Current indicators: ${JSON.stringify(currentIndicators)}`);
    const answers = await this._answerService.getAnswersWithQuestion(email, position);
    this._logger.log(`Answers: ${JSON.stringify(answers)}`);
    const positionElement = await this._positionService.getPositionById(position);
    this._logger.log(`Position element: ${JSON.stringify(positionElement)}`);

    const validAnswers = answers.filter((answer) => answer.questionId.cryteria !== '' && !currentIndicators.includes(answer.questionId.cryteria));
    this._logger.log(`Valid answers: ${JSON.stringify(validAnswers)}`);

    const response = await Promise.all(
      validAnswers.map((answer) =>
        this.processAnswer(
          { question: { question: answer.questionId.question, cryteria: answer.questionId.cryteria }, answer: answer.answer },
          positionElement ? positionElement.name : '',
        ),
      ),
    );
    this._logger.log(`Responses from processAnswer: ${JSON.stringify(response)}`);

    if (response.some((r) => r === undefined)) {
      this._logger.error('OpenAI responses failed. Aborting processEveryAnswer, nothing will be saved to the database.');
      return [];
    }

    const parsedResponse: ParsedResponse[] = response.map((response) => {
      const value = parseInt(response?.result ?? '') + 1;
      return { indicator: response?.cryteria ?? '', value: isNaN(value) ? 1 : value };
    });
    this._logger.log(`Parsed responses: ${JSON.stringify(parsedResponse)}`);

    const result = parsedResponse.reduce(
      (prevValue: { [key: string]: { value: number; count: number } }, currentValue) => {
        const auxValue = { ...prevValue };

        if (Object.keys(auxValue).includes(currentValue.indicator)) {
          auxValue[currentValue.indicator].value += currentValue.value;
          auxValue[currentValue.indicator].count++;
        } else {
          auxValue[currentValue.indicator] = { value: currentValue.value, count: 1 };
        }

        return auxValue;
      },
      {} as { [key: string]: { value: number; count: number } },
    );
    this._logger.log(`Aggregated result: ${JSON.stringify(result)}`);

    const averageImplementedResponse: ParsedResponse[] = Object.keys(result).map((key) => {
      const newValue = { indicator: key, value: result[key].value / result[key].count };
      return newValue;
    });
    this._logger.log(`Average implemented response: ${JSON.stringify(averageImplementedResponse)}`);

    if (positionElement) {
      const recommendation = await this.askForRecommendation(averageImplementedResponse, positionElement.name);
      this._logger.log(`Recommendation: ${JSON.stringify(recommendation)}`);
    }

    return averageImplementedResponse;
  }

  async askForRecommendation(averageImplementedResponse: ParsedResponse[], position: string) {
    const prompt = `Given the following list of values with their respective criteria:\n${averageImplementedResponse.reduce(
      (acumulatedValue, currentResponse) => {
        return acumulatedValue + `${currentResponse.indicator}: ${currentResponse.value}\n`;
      },
      '',
    )}\nand considering that they come from a list of answers from a user applying for the position ${position}, based on a list of questions asked to them,\ngive me a summary about the applicant's profile.`;
    this._logger.log(`askForRecommendation prompt: ${prompt}`);
    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are an assistant that responds with a professional summary.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0,
        max_tokens: 500,
      });
      this._logger.log(`Recommendation completion response: ${JSON.stringify(completion)}`);
      return completion.choices[0].message.content;
    } catch (error) {
      this._logger.error(`Error in askForRecommendation: ${error.message}`);
    }
  }
}

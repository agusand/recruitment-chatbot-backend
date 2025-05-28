import { Injectable, LoggerService as NestLoggerService, Logger } from '@nestjs/common';

@Injectable()
export class AppLogger implements NestLoggerService {
  private readonly logger = new Logger();
  private context?: string;

  log(message: string) {
    this.logger.log(`${this.context ? `[${this.context}] ` : ''}${message}`);
  }

  error(message: string, trace?: string) {
    this.logger.error(`${this.context ? `[${this.context}] ` : ''}${message}`, trace);
  }

  warn(message: string) {
    this.logger.warn(`${this.context ? `[${this.context}] ` : ''}${message}`);
  }

  debug?(message: string) {
    this.logger.debug?.(`${this.context ? `[${this.context}] ` : ''}${message}`);
  }

  verbose?(message: string) {
    this.logger.verbose?.(`${this.context ? `[${this.context}] ` : ''}${message}`);
  }

  setContext(newContext: string) {
    this.context = newContext;
  }
}

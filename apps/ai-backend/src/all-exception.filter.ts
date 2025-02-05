import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionFilter<T> implements ExceptionFilter {
  private logger = new Logger('Exception');
  catch(exception: T, host: ArgumentsHost) {
    const response: Response = host.switchToHttp().getResponse();

    this.logger.error(exception);

    let httpExceptionResponse: Record<string, any> = {};
    let status;
    let result;

    if (exception instanceof HttpException) {
      httpExceptionResponse = exception.getResponse() as Record<string, any>;
      status = exception.getStatus();
      result = Array.isArray(httpExceptionResponse?.message)
        ? httpExceptionResponse?.message.join(',')
        : httpExceptionResponse?.message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      result = 'internal server error';
    }

    response.json({
      code: status,
      data: null,
      success: false,
      message: result,
    });
  }
}

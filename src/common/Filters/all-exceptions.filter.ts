import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
  
  @Catch()
  export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  
    catch(exception: HttpException, host: ArgumentsHost): void {
        // to get path 
      const { httpAdapter } = this.httpAdapterHost;

      // to get http data 
      const ctx = host.switchToHttp();
      const req = ctx.getRequest<Request>();        
      
      // to get http status
      const httpStatus =exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
        
      
      // create exception object
      const responseBody = {
        statusCode: httpStatus,
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
        method: req.method,
        message: exception.message,
      };
  
      httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);

    }
  }






// import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
// import { Request, Response } from 'express';

// @Catch(HttpException)
// export class AllExceptionsFilter implements ExceptionFilter {
//     catch(exception: HttpException, host: ArgumentsHost) {
//         const ctx = host.switchToHttp()
//         const res = ctx.getResponse<Response>()
//         const req = ctx.getRequest<Request>()
//         const status = exception.getStatus()
//         const exceptionRes = exception.getResponse()


//         const errResponse = {
//             statusCode: status,
//             timestamp: new Date().toISOString(),
//             path: req.url,
//             method: req.method,
//             message: exception.message,
//             ...(typeof exceptionRes === 'object' ? exceptionRes : { error: exceptionRes }),
//         }

//         if (process.env.NODE_ENV === 'development' && exception.stack) {
//             errResponse['stack'] = exception.stack;
//           }
      

//         res.status(status).json(errResponse);

//     }
// }



// import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
// import { Request, Response } from 'express';

// @Catch(HttpException)
// export class AllExertionsFilter implements ExceptionFilter {
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



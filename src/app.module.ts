import { SendEmailService } from './common/Services/sendEmail/send_email.service';
// import { HttpExceptionFilter } from './common/Filters/all-exceptions.filter';
import { AuthModule, SendEmailModule, UserModel } from './Modules';
import { AuthController } from './Modules/Auth/auth.controller';
import { AuthService } from './Modules/Auth/auth.service';
import { Model } from './DB/models-generation';

import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
// import { APP_FILTER } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';



@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/3lamny-API'),
    Model,
    AuthModule,
    UserModel,
    SendEmailModule,


    ConfigModule.forRoot({
      envFilePath: 'src/config/.env',
      isGlobal: true,
    }),
  ],
  controllers: [
    AuthController
  ],
  providers: [
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
    AuthService,
    JwtService,
    SendEmailService
  ],
})
export class AppModule {


}

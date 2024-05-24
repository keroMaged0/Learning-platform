import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { Model } from './DB/models-generation';
import { AuthModule, SendEmailModule ,UserModel} from './Modules';
import { SendEmailService } from './common/Services/sendEmail/send_email.service';
import { AuthService } from './Modules/Auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './Modules/Auth/auth.controller';


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
    AuthService,
    JwtService,
    SendEmailService
  ],
})
export class AppModule {

  
}

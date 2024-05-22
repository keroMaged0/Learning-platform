
import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { AuthController } from "./auth.controller";
import { Model } from "src/DB/models-generation";
import { AuthService } from "./auth.service";
import { SendEmailService } from "src/common/Services/sendEmail/send_email.service";


@Module({
    imports: [
        Model,
    ],
    controllers: [
        AuthController
    ],
    providers: [
        AuthService,
        JwtService,
        SendEmailService,   
    ],
})

export class AuthModule {

}
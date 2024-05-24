import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { Model } from "src/DB/models-generation";
import { UserService } from "./user.service";
import { JwtService } from "@nestjs/jwt";
import { SendEmailService } from "src/common/Services/sendEmail/send_email.service";


@Module({
    imports: [Model],
    controllers: [UserController],
    providers: [
        UserService,
        SendEmailService,
        JwtService
    ],
})
export class UserModel {

}
import { SendEmailService } from "./send_email.service";
import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";


@Module({
    imports: [],
    controllers: [],
    providers: [
        SendEmailService,
        JwtService
    ],
})
export class SendEmailModule {

}
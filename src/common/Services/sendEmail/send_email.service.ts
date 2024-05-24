import * as nodemailer from 'nodemailer';
import { HttpException, Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { ChangePassTemplate, verifyEmailTemplate } from './send-email-template';


@Injectable()
export class SendEmailService {

    constructor(
        private jwtService: JwtService,

    ) { }
    async sendEmail(
        email: string,
        type: any
    ) {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            tls: {
                rejectUnauthorized: false,
            },
            auth: {
                user: process.env.USER_GMAIL,
                pass: process.env.PASSWORD_GMAIL,
            },
        });


        const token = this.jwtService.sign({ email },
            { secret: process.env.CHANGE_PASS_SECRET, expiresIn: '1d' }
        )
        if (!token) throw new HttpException('fail token', 404)



        let test = verifyEmailTemplate(token)
        if (type == 'forgetPassword') test = ChangePassTemplate(token)

        // send mail with defined transport object
        await transporter.sendMail({
            from: `"3alamny App" <${process.env.USER_GMAIL}>`, // sender address
            to: email, // list of receivers
            subject: "can you verify email now", // Subject line
            html: test, // html body
        });

        return true;
    }

}

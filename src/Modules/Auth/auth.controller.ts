import {
    Controller,
    Get, Param, Patch, Post,
    Req, Res
} from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";


@Controller('Auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    //========================= Register Controller =========================//
    @Post('Register')
    async registerController(
        @Req() req: Request,
        @Res() res: Response
    ) {
        let token = await this.authService.registerService(req)
        res.status(200).json({ message: 'Register SuccessFully', data: token })

    }

    //========================= Verify Email Controller =========================//
    @Get('VerifyEmail/:token')
    async verifyEmailController(
        @Param('token') token: string,
        @Req() req: Request,
        @Res() res: Response
    ) {
        let user = await this.authService.verifyEmailService(token)
        res.status(200).json({ message: 'Verify Email SuccessFully', user })
    }

    //========================= Login Controller =========================//
    @Post('/Login')
    async loginController(
        @Req() req: Request,
        @Res() res: Response
    ) {
        let user = await this.authService.loginService(req)

        res.status(200).json({ message: 'Login SuccessFully', data: user })
    }
}
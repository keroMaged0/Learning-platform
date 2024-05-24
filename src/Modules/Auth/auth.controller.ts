import {
    Body,
    Controller,
    Get, Param, Patch, Post,
    Req, Res,
    UseGuards,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { VerifyEmailDto } from "./dto/verify-email.dto";


@Controller('Auth')
@UsePipes(ValidationPipe)
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    //========================= Register Controller =========================//
    @Post('Register')
    async registerController(
        @Res() res: Response,
        @Body() registerDto: RegisterDto
    ) {
        let user = await this.authService.registerService(registerDto)
        res.status(200).json({ message: 'Register SuccessFully', data: user })

    }

    //========================= Verify Email Controller =========================//
    @Get('VerifyEmail/:token')
    async verifyEmailController(
        @Param('token') verifyEmailDto: VerifyEmailDto,
        @Req() req: Request,
        @Res() res: Response
    ) {
        
        let user = await this.authService.verifyEmailService(verifyEmailDto)
        res.status(200).json({ message: 'Verify Email SuccessFully', user })
    }

    //========================= Login Controller =========================//
    @Post('/Login')
    async loginController(
        @Body() loginDto: LoginDto,
        @Res() res: Response
    ) {
        let token = await this.authService.loginService(loginDto)

        res.status(200).json({ message: 'Login SuccessFully', data: token })
    }
}


import {
    Body, Controller,
    Delete, Get, Param, Patch,
    Post, Put, Req, Res, UseGuards
} from "@nestjs/common";

import { Request, Response } from "express";

import { UserService } from "./user.service";
import { AuthGuard } from "../Auth/guards/jwt-auth.guard";
import { UpdateUserDto } from "./dto/update_user.dto";
import { GetUserByIdDto } from "./dto/get-user-by-id.dto";
import { UpdateUserPasswordDto } from "./dto/update-user-password.dto";
import { UpdateUserEmailDto } from "./dto/update-user-email.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";


@Controller('User')
@UseGuards(AuthGuard)
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    //========================= Get All Users Controller =========================//
    @Get('')
    async getAllUserController(
        @Res() res: Response,
        @Req() req: Request
    ) {
        let users = await this.userService.getAllUsersService()
        res.status(200).json({ message: 'SuccessFully', data: users })
    }

    //========================= Get User By Id Controller =========================//
    @Get(':id')
    async getUserByIdController(
        @Res() res: Response,
        @Req() req: Request,
        @Param('id') id: GetUserByIdDto,
    ) {
        let user = await this.userService.getUserByIdService(id, req)
        res.status(200).json({ message: 'SuccessFully', data: user })
    }

    //========================= Update User Controller =========================//
    @Put('Update/:id')
    async updateUserController(
        @Res() res: Response,
        @Req() req: Request,
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto
    ) {

        const user = await this.userService.updateUserProfileService(req, res, id, updateUserDto)
        res.status(200).json({ message: 'Updated SuccessFully', data: user })
    }

    //========================= Update User Email Controller =========================//
    @Patch('Update/Email')
    async updateUserEmailController(
        @Res() res: Response,
        @Req() req: Request,

        @Body() data: UpdateUserEmailDto
    ) {
        await this.userService.updateUserEmailService(data, req)
        res.status(200).json({ message: 'Updated email SuccessFully , please verify email' })
    }

    //========================= Update User Password Controller =========================//
    @Patch('Update/Password/:id')
    async updateUserPasswordController(
        @Res() res: Response,
        @Req() req: Request,
        @Param('id') id: string,
        @Body() data: UpdateUserPasswordDto
    ) {
        await this.userService.updateUserPasswordService(data, id, req)
        res.status(200).json({ message: 'Updated Password SuccessFully , please verify email' })
    }

    //========================= Delete User Account By Admin Controller =========================//
    @Delete('Delete/:id')
    async deleteUserByAdminController(
        @Param('id') id: string,
        @Res() res: Response
    ) {
        let user = await this.userService.deleteUserByAdminServices(id)
        res.status(200).json({ message: "deleted user successfully", data: user })
    }

    //========================= Forget Password Controller =========================//
    @Post('Password/Forget')
    async forgetPasswordController(
        @Res() res: Response,
        @Req() req: Request,
        @Body('email') email: any
    ) {

        await this.userService.forgetPasswordService(email, req)
        res.status(200).json({ message: 'Successfully check email to update password' })
    }

    //========================= Reset Password Service =========================//
    @Post('Password/Reset/:token')
    async resetPasswordController(
        @Res() res: Response,
        @Req() req: Request,
        @Param('token') token: string,
        @Body() data: ResetPasswordDto
    ) {
        await this.userService.resetPasswordService(token, data, req)
        res.status(200).json({ message: 'Successfully reset password' })
    }


    //========================= Log Out Controller =========================//
    @Patch('Logout/:id')
    async logOutController(
        @Req() req: Request,
        @Res() res: Response
    ) {
        let user = await this.userService.logOutServices(req)
        res.status(200).json({ message: "Logout successfully", data: user })
    }

}
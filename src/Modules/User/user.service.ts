import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";

import { SendEmailService } from "src/common/Services/sendEmail/send_email.service";
import { User } from "src/DB/Schemas/user.schema";
import { UpdateUserPasswordDto } from "./dto/update-user-password.dto";
import { UpdateUserDto } from "./dto/update_user.dto";
import { GetUserByIdDto } from "./dto/get-user-by-id.dto";

import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { UpdateUserEmailDto } from "./dto/update-user-email.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";


@Injectable()

export class UserService {

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly jwtService: JwtService,
        private readonly sendEmailService: SendEmailService,
    ) { }

    //========================= Get All Users Service =========================//
    async getAllUsersService() {
        const users = await this.userModel.find({ isDeleted: false })

        if (users.length === 0) throw new HttpException('No Users Found', 404)

        return users
    }

    //========================= Get User By Id Service =========================//
    async getUserByIdService(id: GetUserByIdDto, req: any) {
        // destruct required data
        const { _id } = req.authUser

        // check if user found
        const user = await this.userModel.findById(id)
        if (!user) throw new HttpException('No User Found', 404)

        // if user Logout
        if (user.isDeleted) throw new HttpException('user logout not found', 302)


        if (user._id.toString() !== _id.toString()) throw new HttpException('Unauthorized', 401)

        return user
    }

    //========================= Update User Profile Data Service =========================//
    async updateUserProfileService(req: any, res: any, id: any, data: UpdateUserDto) {
        // destruct required data 
        const { _id } = req.authUser

        // check if the user is not found
        const user = await this.userModel.findById(id)
        if (!user) throw new HttpException('No User Found', 404)

        // if user Logout
        if (user.isDeleted) throw new HttpException('user logout not found', 302)

        // check if the user is not authorized
        if (user._id.toString() !== _id.toString()) throw new HttpException('Unauthorized', 401)

        // check if the user update in name 
        if (data.name) user.name = data.name

        // check if update in phone number
        if (data.phoneNumber) user.phoneNumber = data.phoneNumber

        // check if update in age
        if (data.age) user.age = data.age

        // check if update in gender
        if (data.gender) user.gender = data.gender

        await user.save()
        return user

    }

    //========================= Update User Email Service =========================//
    async updateUserEmailService(data: UpdateUserEmailDto, req: any) {
        // destruct required data 
        const { _id } = req.authUser
        const { oldEmail, newEmail } = data

        // check if the user is not found
        const user = await this.userModel.findOne({ email: oldEmail })
        if (!user) throw new HttpException('No User Found', 404)

        // if user Logout
        if (user.isDeleted) throw new HttpException('user logout not found', 302)

        // check if the user is not authorized
        if (user._id.toString() !== _id.toString()) throw new HttpException('Unauthorized', 401)

        // check if email unique 
        let uniqueEmail = await this.userModel.findOne({ email: newEmail })
        if (uniqueEmail) throw new HttpException('Email already exists', 400)

        // verify email
        const sendEmail = await this.sendEmailService.sendEmail(newEmail, 'verify Email')
        if (!sendEmail) throw new HttpException('invalid data', 400)

            user.verifyEmail = false
        user.email = newEmail

        await user.save()

        return user
    }

    //========================= Update User Password Service =========================//
    async updateUserPasswordService(data: UpdateUserPasswordDto, id: string, req: any) {
        // destruct user id from token
        const { _id } = req.authUser

        // check if the user is not found
        const user = await this.userModel.findById(id)
        if (!user) throw new HttpException('No User Found', 404)

        // if user Logout
        if (user.isDeleted) throw new HttpException('user logout not found', 302)

        // check if the user is not authorized
        if (user._id.toString() !== _id.toString()) throw new HttpException('Unauthorized', 401)

        // check valid password
        let encrypted = bcrypt.compareSync(data.oldPassword, user.password)
        if (encrypted) throw new HttpException('Invalid Password', 400)

        // verify email and send email
        this.sendEmailService.sendEmail(user.email, 'verify Email')

        // update password
        user.password = bcrypt.hashSync(data.newPassword, +process.env.SALT_AROUND)
        user.changePassword = true
        user.changePasswordTime = new Date()
        user.verifyEmail = false

        await user.save()

        return user
    }

    //========================= Delete User Account Service =========================//
    async deleteUserByAdminServices(id: string) {

        // check if user found
        const user = await this.userModel.findOneAndDelete({ _id: id, isDeleted: false })
        if (!user) throw new HttpException('not found user', 404)

        return user


    }

    //========================= Delete User Account Service =========================//
    async logOutServices(req: any) {
        // destruct required data
        const { _id } = req.authUser
        const { id } = req.params

        // check if user found
        const user = await this.userModel.findById(id)
        if (!user) throw new HttpException('not found user', 404)


        // check if authorized 
        if (user._id.toString() != _id.toString()) throw new HttpException('unAuthorize', 401)

        // delete user soft deleted
        user.isDeleted = true

        await user.save()
        return user


    }

    //========================= Forget Password Service =========================//
    async forgetPasswordService(email: string, req: any) {
        // destruct required data
        const { _id } = req.authUser

        // check if user found
        const user = await this.userModel.findOne({ email: email })
        if (!user) throw new HttpException('not found user', 404)

        // if user Logout
        if (user.isDeleted) throw new HttpException('user logout not found', 302)

        // check if authorized
        if (user._id.toString() !== _id.toString()) throw new HttpException('unAuthorize', 401)

        // verify email and send email
        await this.sendEmailService.sendEmail(user.email, 'forgetPassword')


        return user

    }

    //========================= Reset Password Service =========================//
    async resetPasswordService(token: any, data: ResetPasswordDto, req: any) {
        // destruct required data
        const { _id } = req.authUser
        const { newPassword, confirmPassword } = data

        // decoded token and check if valid
        const decoded = await this.jwtService.verify(token, { secret: process.env.CHANGE_PASS_SECRET })

        // check if user found
        const user = await this.userModel.findOne({ email: decoded.email })
        if (!user) throw new HttpException('not found user', 404)

        // if user Logout
        if (user.isDeleted) throw new HttpException('user logout not found', 302)

        // check if authorized
        if (user._id.toString() !== _id.toString()) throw new HttpException('unAuthorize', 401)


        // check if password and confirm password match
        if (newPassword !== confirmPassword) throw new HttpException('password and confirmPassword not match', 400)

        // update password
        user.password = bcrypt.hashSync(newPassword, +process.env.SALT_AROUND)
        user.changePassword = true
        user.changePasswordTime = new Date()

        await user.save()

        return user

    }


}

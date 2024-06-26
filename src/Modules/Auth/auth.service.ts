import { SendEmailService } from './../../common/Services/sendEmail/send_email.service';
import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { JwtService } from '@nestjs/jwt';

import { Model } from "mongoose";
import * as bcrypt from "bcrypt";

import { User } from "src/DB/Schemas/user.schema";


@Injectable()
export class AuthService {

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly jwtService: JwtService,
        private readonly sendEmailService: SendEmailService
    ) { }

    //========================= Register Service =========================//
    async registerService(body: any) {
        // destruct required data from body
        const { name, email, password, age, gender, phoneNumber, role } = body;

        // check if unique email 
        const uniqueEmail = await this.userModel.findOne({ email: email });
        if (uniqueEmail) throw new HttpException('Email already exists', 400);


        // hash password
        const hashPassword = bcrypt.hashSync(password, +process.env.SALT_AROUND)

        // create user object
        const userObj = new this.userModel({
            name,
            email,
            password: hashPassword,
            age,
            gender,
            phoneNumber,
            changePasswordTime: 0,
            role,
        })

        // verify email
        await this.sendEmailService.sendEmail(email, 'verifyEmail')

        // save user in database
        const user = await userObj.save();

        return user;
    }

    //========================= Verify Email Service =========================//
    async verifyEmailService(token: any) {
        try {
            if (token.JsonWebTokenError) throw new HttpException('token.err', 400);
            // verify token 
            let decodedToken = await this.jwtService.verify(token, { secret: process.env.CHANGE_PASS_SECRET })
            if (!decodedToken) throw new HttpException('token not valid', 400);

            // check if found user
            const user = await this.userModel.findOne({ email: decodedToken?.email })
            if (!user) throw new HttpException('Not found this user', 400);

            // verifyEmail success
            user.verifyEmail = true;
            await user.save();

            return user;
        } catch (err) {
            throw new HttpException(err, 400);
        }


    }

    //========================= Login Service =========================//
    async loginService(body: any) {
        // destruct required data from body
        const { email, password } = body;

        // check if user exists
        const user = await this.userModel.findOne({ email: email });
        if (!user) throw new HttpException('Not found this user', 400);

        // if user Logout
        if (user.isDeleted) throw new HttpException('user logout not found', 302)

        // check if verify email
        if (!user.verifyEmail) throw new HttpException('Please verify your email', 400);

        // check if password is valid
        const validPassword = bcrypt.compareSync(password, user.password)
        if (!validPassword) throw new HttpException('Invalid password', 400);

        if (user && validPassword) {
            let token = this.jwtService.signAsync({ email, role: user.role, id: user._id },
                { secret: process.env.REGISTER_SECRET_KEY }
            )
            if (!token) throw new HttpException('fail token', 400);

            return token
        }

    }
}



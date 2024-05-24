import { decode } from 'punycode';
import { CanActivate, ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/DB/Schemas/user.schema';
import { Model } from 'mongoose';



@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly jwtService: JwtService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<object> {
        //  Get the request object from the context
        const req = context.switchToHttp().getRequest();

        // destruct required data headers
        const { accesstoken } = req.headers

        // check if the token is not provided
        if (!accesstoken) throw new HttpException('!not found token', 400);

        // check if token starts with 
        if (!accesstoken.startsWith('accesstoken_')) throw new HttpException('!wrong prefix', 400);

        const token = accesstoken.split('accesstoken_')[1];

        // verify the token
        const decode = this.jwtService.verify(token, {
            secret: process.env.REGISTER_SECRET_KEY,
        });

        // check if the token is not valid
        if (!decode) throw new HttpException('!not valid token', 400);

        // check if found user
        const user = await this.userModel.findOne({ _id: decode.id });
        if (!user) throw new HttpException('!not found user', 400);

        // check if user is deleted
        if (user.isDeleted) throw new HttpException('!user is deleted', 400);

        // // authorization
        // if (!accessRoles.includes(user.role)) return next(new appError('unauthorized', 401));

        // if change password    
        if (user?.changePasswordTime) {
            let time = user?.changePasswordTime.getTime() / 1000
            let timeParse = parseInt(JSON.stringify(time))
            if (timeParse > decode.iat) throw new HttpException('!change password', 400);
        }

        req.authUser = user

        return req;
    }
}
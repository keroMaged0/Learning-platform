import { CanActivate, ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { ROLES_KEY } from "src/common/Decorators/roles.decorator";
import { Role } from "src/common/Utils/enums/role.enum";


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,   // to get metadata RolesKey 
        private readonly jwtService: JwtService,  // to get token from request headers
    ) { }

    canActivate(context: ExecutionContext): boolean {

        // get metadata from ROLES_KEY
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ])
        if (!requiredRoles) {
            return true;
        }

        // get token from request headers
        const { headers: { accesstoken: tokenHeader } } = context.switchToHttp().getRequest();

        let token = tokenHeader.split('accesstoken_')[1]

        // verify the token
        const decode = this.jwtService.verify(token, {
            secret: process.env.REGISTER_SECRET_KEY,
        }); 

        if (!decode) throw new HttpException('!not valid token', 400);
        if (decode.length > 0) throw new HttpException('!token not found', 400);

        if (!requiredRoles.includes(decode.role)) throw new HttpException('!not authorized ', 401)


        return true;

    }

}
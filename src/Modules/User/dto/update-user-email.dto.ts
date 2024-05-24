import { IsEmail, IsNotEmpty } from "class-validator"

export class UpdateUserEmailDto {

    @IsNotEmpty()
    @IsEmail()
    oldEmail: string

    @IsEmail()
    @IsNotEmpty()
    newEmail: string

}
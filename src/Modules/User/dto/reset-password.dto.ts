import { IsNotEmpty, Matches } from "class-validator"
export class ResetPasswordDto {

    @IsNotEmpty()
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
    {message:'Password Should Be At Least 8 Characters Long, Contain At Least 1 Uppercase Letter, 1 Lowercase Letter, 1 Number, And 1 Special Character'})
    newPassword: string
    
    @IsNotEmpty()
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
    {message:'Password Should Be At Least 8 Characters Long, Contain At Least 1 Uppercase Letter, 1 Lowercase Letter, 1 Number, And 1 Special Character'})
    confirmPassword: string
}
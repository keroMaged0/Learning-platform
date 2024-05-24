import {
  IsString, IsNotEmpty,
  IsEmail, Length, Min,
  Max, IsNumber,
  Matches
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
  {message:'Password Should Be At Least 8 Characters Long, Contain At Least 1 Uppercase Letter, 1 Lowercase Letter, 1 Number, And 1 Special Character'})
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @Min(10)
  @Max(80)
  @IsNumber()
  age: number;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{11}$/, { message: 'phoneNumber must be a valid 11-digit number' })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  role: string;
}
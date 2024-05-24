import { IsNumber, IsOptional, IsString, Length, Max, Min } from "class-validator";





export class UpdateUserDto {
    @IsOptional()
    @Length(2, 50)
    @IsString()
    name: string;

    @IsOptional()
    phoneNumber: string;

    @IsOptional()
    @Min(10)
    @Max(80)
    @IsNumber()
    age: number;

    @IsOptional()
    @IsString()
    gender: string;
    
}
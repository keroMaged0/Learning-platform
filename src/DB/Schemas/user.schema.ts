import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";


@Schema()
export class User {
    @Prop({
        required: true,
        trim: true,
        maxlength: 50,
        minlength: 2,
        lowercase: true,
    })
    name: string;

    @Prop({
        required: true,
        unique: true,
    })
    email: string;

    @Prop({
        required: true,
    })
    password: string;

    @Prop({

    })
    phoneNumber: string;

    @Prop({
        min: [10, 'Age must be greater than 10'],
        max: [80, 'Age must be greater than 80'],
        default: 0,
    })
    age: number;

    @Prop({
        enum: ['male', 'female'],
        default: 'male',
    })
    gender: string;

    @Prop({
        default: false,
    })
    isDeleted: boolean;


    @Prop({
        default: false,
    })
    loggedUser: boolean;

    @Prop({
        enum: ['user', 'teacher', 'admin'],
        default: 'user'
    })
    role: string;

    @Prop({
        default: false,
    })
    changePassword: boolean;

    @Prop({
        type: Date,
        default: 1 / 12 / 1999,
    })
    changePasswordTime: Date;

    @Prop({
        default: false,
    })
    verifyEmail: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User)
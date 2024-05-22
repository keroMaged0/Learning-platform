import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./Schemas/user.schema";


export const Model = MongooseModule.forFeature([
    { name: User.name, schema: UserSchema }
])
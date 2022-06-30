import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {User, UserDocument} from "./user.schema";

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

    _getUserDetail(user: UserDocument): IUserDetail {
        return {
            id: user._id,
            name: user.name,
            email: user.email
        }
    }

    async findByEmail(email: string): Promise<UserDocument | null>{
        return this.userModel.findOne({email}).exec()
    }

    async findById(id: string): Promise<IUserDetail | null>{
        const user = await this.userModel.findById(id).exec();
        if (!user) return null;
        return this._getUserDetail(user);
    }

    async create(name: string, email: string, hashedPassword: string): Promise<UserDocument>{
        const newUser = new this.userModel({
            name,
            email,
            password: hashedPassword
        });
        return newUser.save();
    }
}


export interface IUserDetail {
    id: string;
    name: string;
    email: string;
}
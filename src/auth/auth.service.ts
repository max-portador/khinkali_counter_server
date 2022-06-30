import {Injectable} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {IUserDetail, UserService} from "../user/user.service";
import {NewUserDTO} from "../user/dto/new-user.dto";
import {ExistingUserDTO} from "../user/dto/existing-user.dto";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService) {
    }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 12)
    }

    async register(user: Readonly<NewUserDTO>): Promise<IUserDetail | string | null> {
        const {name, password, email} = user;

        const existingUser = await this.userService.findByEmail(email);
        if (existingUser) return 'Email занят!';

        const hashedPassword = await this.hashPassword(password);
        const newUser = await this.userService.create(name, email, hashedPassword);
        return this.userService._getUserDetail(newUser);
    }

    async doesPasswordMatch(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword)
    }

    async validateUser(email: string, password: string): Promise<IUserDetail | null> {
        const user = await this.userService.findByEmail(email)

        // проверяем, что email есть в базе
        const doesUserExist = !!user;
        if (!doesUserExist) return null;

        // проверяем, что пароль совпадает с тем, что хранится в базе
        const doesPasswordMatch = await this.doesPasswordMatch(password, user.password)
        if (!doesPasswordMatch) return null;

        return this.userService._getUserDetail(user)
    }

    async login(existingUser: ExistingUserDTO): Promise<{ token: string, user: string } | null> {
        const {email, password} = existingUser;
        const user = await this.validateUser(email, password)

        if (!user) return null;

        const jwt = await this.jwtService.signAsync({ user });
        return { token: jwt, user: user.name};
    }
}

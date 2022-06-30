import {Body, Controller, HttpCode, HttpStatus, Post} from '@nestjs/common';
import {AuthService} from "./auth.service";
import {NewUserDTO} from "../user/dto/new-user.dto";
import {IUserDetail} from "../user/user.service";
import {ExistingUserDTO} from "../user/dto/existing-user.dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/register')
    register(@Body() user: NewUserDTO): Promise<IUserDetail | string | null>{
        return this.authService.register(user);
    }

    @Post('/login')
    @HttpCode(HttpStatus.OK)
    login(@Body() user: ExistingUserDTO): Promise<{ token: string } | null>{
        return this.authService.login(user);
    }
}

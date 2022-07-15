import {Controller, Get, Param} from '@nestjs/common';
import {IUserDetail, UserService} from "./user.service";
import { Public } from "../common/decorators";

@Controller('user')
export class UserController {

    constructor(private userService: UserService) {
    }

    @Public()
    @Get(':id')
    getUser(@Param('id') id: string): Promise<IUserDetail | null>{
        return this.userService.findById(id)
    }
}

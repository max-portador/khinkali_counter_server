import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseInterceptors } from "@nestjs/common";
import { Response as ResponseType } from 'express';
import { AuthService } from './auth.service';
import { ExistingUserDTO } from '../user/dto/existing-user.dto';
import { CookiesRt, GetUserId, Public, SetCookieInterceptor } from "../common/decorators";
import { AuthServiceData } from './types';
import { NewUserDTO } from '../user/dto/new-user.dto';
import { IUserDetail } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(SetCookieInterceptor)
  async register(
    @Res({ passthrough: true }) res: ResponseType,
    @Body() userDto: NewUserDTO,
  ): Promise<AuthServiceData> {
    return await this.authService.register(userDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(SetCookieInterceptor)
  async login(@Body() existingUser: ExistingUserDTO): Promise<AuthServiceData> {
    return await this.authService.login(existingUser);
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(
    @GetUserId() userId: string,
    @Res({ passthrough: true }) res,
  ): Promise<boolean> {
    res.cookie('refreshToken', 'logout');
    res.cookie('accessToken', 'logout');
    return this.authService.logout(userId);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(SetCookieInterceptor)
  async refreshTokens(@CookiesRt() rt: string): Promise<AuthServiceData> {
    return await this.authService.refreshTokens(rt);
  }

  @Post('me')
  @HttpCode(HttpStatus.OK)
  async me(@Req() request): Promise<IUserDetail> {
    return this.authService.me(request.user.email);
  }
}

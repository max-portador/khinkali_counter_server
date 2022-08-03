import { Body, Controller, HttpCode, HttpStatus, Get, Post, Res, UseInterceptors } from "@nestjs/common";
import { Response as ResponseType } from "express";
import { AuthService } from "./auth.service";
import { ExistingUserDTO } from "../user/dto/existing-user.dto";
import { CookiesRt, GetUserId, Public, SetCookieInterceptor } from "../common/decorators";
import { AuthServiceData } from "./types";
import { NewUserDTO } from "../user/dto/new-user.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Public()
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(SetCookieInterceptor)
  async register(
    @Res({ passthrough: true }) res: ResponseType,
    @Body() userDto: NewUserDTO
  ): Promise<AuthServiceData> {
    return await this.authService.register(userDto);
  }

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(SetCookieInterceptor)
  async login(
    @Res({ passthrough: true }) res: ResponseType,
    @Body() existingUser: ExistingUserDTO
  ): Promise<AuthServiceData> {
      return await this.authService.login(existingUser);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetUserId() userId: string): Promise<boolean>{
    console.log(userId)
    return this.authService.logout(userId)
  }

  @Public()
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(SetCookieInterceptor)
  async refreshTokens(
    @CookiesRt() rt: string
  ): Promise<AuthServiceData>{
    return  await this.authService.refreshTokens(rt)
  }
}

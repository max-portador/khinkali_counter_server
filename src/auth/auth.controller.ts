import { Body, Controller, HttpCode, HttpStatus, Post, Res, UseInterceptors } from "@nestjs/common";
import { Response as ResponseType } from "express";
import { AuthService } from "./auth.service";
import { ExistingUserDTO } from "../user/dto/existing-user.dto";
import { CookiesRt, GetUserId, Public } from "../common/decorators";
import { AuthServiceData } from "./types";
import { NewUserDTO } from "../user/dto/new-user.dto";
import { SetCookieInterceptor } from "../common/decorators/set-cookie.intercaptor";

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
    return this.authService.logout(userId)
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(SetCookieInterceptor)
  async refreshTokens(
    @Res({ passthrough: true }) res: ResponseType,
    @GetUserId() userId: string,
    @CookiesRt() rt: string
  ): Promise<AuthServiceData>{
    return  await this.authService.refreshTokens(userId, rt)
  }
}

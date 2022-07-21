import { Body, Controller, HttpCode, HttpStatus, Post, Res } from "@nestjs/common";
import { Response as ResponseType } from "express";
import { AuthService } from "./auth.service";
import { ExistingUserDTO } from "../user/dto/existing-user.dto";
import { CookiesRt, GetUserId, Public } from "../common/decorators";
import { UserDataATokenType } from "./types";
import { NewUserDTO } from "../user/dto/new-user.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Public()
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Res({ passthrough: true }) res: ResponseType,
    @Body() userDto: NewUserDTO
  ): Promise<UserDataATokenType> {
    const { refresh_token, ...authPayload} =
      await this.authService.register(userDto);

    res.cookie("refreshToken", refresh_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 3600 * 1000
    });

    return authPayload;
  }

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)

  async login(
    @Res({ passthrough: true }) res: ResponseType,
    @Body() existingUser: ExistingUserDTO
  ): Promise<UserDataATokenType> {
    const { refresh_token, ...authPayload} =
      await this.authService.login(existingUser);

    res.cookie("refreshToken", refresh_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 3600 * 1000
    });

    return authPayload;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetUserId() userId: string): Promise<boolean>{
    return this.authService.logout(userId)
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Res({ passthrough: true }) res: ResponseType,
    @GetUserId() userId: string,
    @CookiesRt() rt: string
  ): Promise<UserDataATokenType>{

    const {refresh_token, ...authPayload} = await this.authService.refreshTokens(userId, rt)

    res.cookie("refreshToken", refresh_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 3600 * 1000
    });

    return authPayload
  }
}

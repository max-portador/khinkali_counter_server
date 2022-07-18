import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response as ResponseType } from 'express';
import { AuthService } from './auth.service';
import { ExistingUserDTO } from '../user/dto/existing-user.dto';
import { Public } from '../common/decorators';
import AuthDto from './dto/auth.dto';
import { RegisterControllerType } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(
    @Res({ passthrough: true }) res: ResponseType,
    @Body() userDto: AuthDto,
  ): Promise<RegisterControllerType> {
    const { access_token, refresh_token, user } =
      await this.authService.register(userDto);

    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      maxAge: 30 * 24 * 3600 * 1000,
    });

    return { user, access_token };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() user: ExistingUserDTO): Promise<{ token: string } | null> {
    return this.authService.login(user);
  }
}

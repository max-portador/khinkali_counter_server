import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUserDetail, UserService } from '../user/user.service';
import { ExistingUserDTO } from '../user/dto/existing-user.dto';
import { JwtService } from '@nestjs/jwt';
import AuthDto from './dto/auth.dto';
import { RegisterServiceData, Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async register(user: AuthDto): Promise<RegisterServiceData> {
    const { name, password, email } = user;

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) throw new ForbiddenException('Email занят!');

    const hashedPassword = await this.hashPassword(password);
    const newUser = await this.userService.create(name, email, hashedPassword);
    const tokens = await this.getTokens(newUser._id, newUser.email);
    const userData = this.userService._getUserDetail(newUser);
    return { ...tokens, user: userData };
  }

  async doesPasswordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<IUserDetail | null> {
    const user = await this.userService.findByEmail(email);

    // проверяем, что email есть в базе
    const doesUserExist = !!user;
    if (!doesUserExist) return null;

    // проверяем, что пароль совпадает с тем, что хранится в базе
    const doesPasswordMatch = await this.doesPasswordMatch(
      password,
      user.password,
    );
    if (!doesPasswordMatch) return null;

    return this.userService._getUserDetail(user);
  }

  async login(
    existingUser: ExistingUserDTO,
  ): Promise<{ token: string; user: string } | null> {
    const { email, password } = existingUser;
    const user = await this.validateUser(email, password);

    if (!user) return null;

    const jwt = await this.jwtService.signAsync({ user });
    return { token: jwt, user: user.name };
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const at = this.jwtService.signAsync(
      { userId, email },
      {
        secret: process.env.AT_SECRET,
        expiresIn: 30,
      },
    );

    const rt = this.jwtService.signAsync(
      { userId, email },
      {
        secret: process.env.RT_SECRET,
        expiresIn: 7 * 24 * 3600,
      },
    );

    const [access_token, refresh_token] = await Promise.all([at, rt]);

    return { access_token, refresh_token };
  }
}

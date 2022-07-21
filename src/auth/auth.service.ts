import { ForbiddenException, Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { UserService } from "../user/user.service";
import { ExistingUserDTO } from "../user/dto/existing-user.dto";
import { JwtService } from "@nestjs/jwt";
import { AuthServiceData, Tokens } from "./types";
import { NewUserDTO } from "../user/dto/new-user.dto";
import { UserDocument } from "../user/user.schema";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async register(user: NewUserDTO): Promise<AuthServiceData> {
    const { name, password, email } = user;

    // Проверяем, есть ли пользователь с таким email
    const candidate = await this.userService.findByEmail(email);
    if (candidate) throw new ForbiddenException('Email занят!');

    const hashedPassword = await this.hashPassword(password);
    const newUser = await this.userService.create(name, email, hashedPassword);
    return this.getUserDataAndTokens(newUser)
  }


  async login(existingUser: ExistingUserDTO ): Promise<AuthServiceData> {

    const { email, password } = existingUser;

    const userFromDb = await this.validateUser(email, password);
    if (!userFromDb) return null;

    return this.getUserDataAndTokens(userFromDb)
  }

  async logout(userId: string): Promise<boolean> {
      const userFromDb = await this.userService.findById(userId);
      userFromDb.rtHash = null
      await userFromDb.save()
      return true
  }

  async refreshTokens(userId: string, rt: string ): Promise<AuthServiceData>{
    const userFromDb = await this.userService.findById(userId)
    if (!userFromDb || !userFromDb.rtHash)
      throw new ForbiddenException('Access Denied')

    const rtMatches = bcrypt.compare(rt, userFromDb.rtHash)
    if (!rtMatches)
      throw new ForbiddenException('Access Denied2')

    return await this.getUserDataAndTokens(userFromDb)
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

  async validateUser( email: string, password: string): Promise<UserDocument> {
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

    return user;
  }

  async doesPasswordMatch(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async getUserDataAndTokens(newUser: UserDocument): Promise<AuthServiceData> {
    const tokens = await this.getTokens(newUser._id, newUser.email);
    const userData = this.userService._getUserDetail(newUser);
    await this.updateRtHash(newUser._id, tokens.refresh_token)
    return { ...tokens, user: userData };
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10)
  }

  async updateRtHash(userId: string, rt: string | null): Promise<void> {
    const hash = await this.hashData(rt)
    const userFromDb = await this.userService.findById(userId)
    userFromDb.rtHash = hash;
    await userFromDb.save()
  }



}

import { IUserDetail } from 'src/user/user.service';
import { Tokens } from './tokens.type';

export type ResponseWithCookies = {
  user: IUserDetail
}

export type AuthServiceData = ResponseWithCookies & Tokens;

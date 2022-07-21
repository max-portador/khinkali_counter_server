import { IUserDetail } from 'src/user/user.service';
import { Tokens } from './tokens.type';

export type AuthServiceData = {
  user: IUserDetail;
} & Tokens;

export type UserDataATokenType = {
  access_token: string;
  user: IUserDetail;
};

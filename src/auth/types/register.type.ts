import { IUserDetail } from 'src/user/user.service';
import { Tokens } from './tokens.type';

export type RegisterServiceData = {
  user: IUserDetail;
} & Tokens;

export type RegisterControllerType = {
  access_token: string;
  user: IUserDetail;
};

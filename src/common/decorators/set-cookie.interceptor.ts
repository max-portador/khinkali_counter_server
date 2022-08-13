import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { Response as ResType } from "express";
import { AuthServiceData, ResponseWithCookies } from "../../auth/types";

@Injectable()
export class SetCookieInterceptor  implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<AuthServiceData>): Observable<ResponseWithCookies> {

    // получаем объект Response, которому запишем куки
    const ctx = context.switchToHttp()
    const res = ctx.getResponse()

    return next
      // основной метод, куда повесили Interceptor (auth/login, auth/register, auth/refresh)
      .handle()
      .pipe(
      // используем метод map из RxJs, чтобы мутировать Response
        map(data => putRtToCookie(res, data))
      );
  }
}

function putRtToCookie (res: ResType, data: AuthServiceData){
  // извлекаем токены
  const { refresh_token, access_token, ...filteredData } = data

  // записываем их в куки
  res.cookie("refreshToken", refresh_token, {
    httpOnly: true,
    maxAge: 30 * 24 * 3600 * 1000
  });

  res.cookie("accessToken", access_token, {
    httpOnly: true,
    maxAge: 5 * 60 * 1000
  });

  return filteredData
}
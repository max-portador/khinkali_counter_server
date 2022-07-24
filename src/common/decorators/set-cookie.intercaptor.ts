import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { AuthServiceData, UserDataATokenType } from "../../auth/types";

@Injectable()
export class SetCookieInterceptor  implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<AuthServiceData>): Observable<UserDataATokenType> {

    // получаем объект Response, которому запишем куки
    const ctx = context.switchToHttp()
    const res = ctx.getResponse()

    return next
      // основной метод, куда повесили Interceptor (auth/login, auth/register, auth/refresh)
      .handle()
      .pipe(
      // используем метод map из RxJs, чтобы мутировать Response
        map(data => {
          // извлекаем refresh_token
          const { refresh_token, ...filteredData } = data

          // записываем его в куки
          res.cookie("refreshToken", refresh_token, {
            httpOnly: true,
            maxAge: 30 * 24 * 3600 * 1000
          });

          return filteredData
        })
      );
  }
}
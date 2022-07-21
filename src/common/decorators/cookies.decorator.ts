import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";

export const CookiesRt = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const rt = request.cookies?.['refreshToken']
    if (!rt)
      throw new UnauthorizedException('Invalid Token. Please Login')

    return rt;
  },
);
import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";

export const GetUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
      const request = context.switchToHttp().getRequest();
      const user = request.body?.user
    if (!user || !user.id)
      throw new UnauthorizedException('Invalid user Id. Please Login')

    return user.id
  }
)
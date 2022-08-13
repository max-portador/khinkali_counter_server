import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request as RequestType } from "express";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([]),
      secretOrKey: process.env.RT_SECRET,
      passReqToCallback: true
    });
  }

  async validate(req: RequestType, payload: any) {
    if (req?.cookies) {
      const refreshToken = req.cookies["refreshToken"];
      return { ...payload, refreshToken };
    }
    else return new UnauthorizedException();
  }
}

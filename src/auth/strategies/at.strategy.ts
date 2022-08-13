import { Injectable, UnauthorizedException } from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import { Request as RequestType } from "express";

type JWTPayload = {
    name: string;
    email: string;
    password: string;
}


@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([cookieJWTExtractor]),
            secretOrKey: process.env.AT_SECRET,
        });
    }

    async validate(payload: JWTPayload) {
            return payload
    //     }
    //     else return new UnauthorizedException();
    }
}


function cookieJWTExtractor(request:RequestType) {
    let accessToken = request?.cookies["accessToken"];
    if (!accessToken) {
        return null;
    }
    return accessToken
}
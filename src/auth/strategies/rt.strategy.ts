import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import { Request as RequestType } from 'express';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh'){
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.RT_SECRET,
            passReqToCallback: true,
        });
    }

    async validate(req: RequestType, payload: any) {
        const refreshToken =  req.cookies['refreshToken']
        return {... payload, refreshToken };
    }
}
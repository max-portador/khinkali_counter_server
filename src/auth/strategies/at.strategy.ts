import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";

type JWTPayload = {
    name: string;
    email: string;
    password: string;
}


@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.AT_SECRET,
        });
    }

    async validate(payload: JWTPayload) {
        return {... payload };
    }
}
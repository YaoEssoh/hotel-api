import { UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

type JWTPayload={
    sub:string
    username:string
}

export class RefeshTokenStrategy extends PassportStrategy(Strategy,'refresh-jwt'){
    constructor(){
       const jwtRefreshSecret=process.env.JWT_refresh_SECRET
       if(!jwtRefreshSecret){
             throw new Error ('JWT_Refresh_SECRET n existe pas')

       }
       super({
             jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
             secretOrKey:jwtRefreshSecret,
             passReqToCallback:true
            })

    }
    validate(req: Request,payload: JWTPayload) {
        const authHeader=request.get('Authorization')
        if(!authHeader){
            throw new UnauthorizedException('Authorization header is missing')
        }
        const refreshToken=authHeader.replace('Bearer','').trim()
        return {...payload,refreshToken}
        
    }

}
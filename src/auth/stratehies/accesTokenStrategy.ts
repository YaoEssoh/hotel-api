import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

type JWTPayload={
    sub:string
    username:string
}

export class AccesTokenStrategy extends PassportStrategy(Strategy,'jwt'){
 constructor(){
       const jwtAccessSecret=process.env.JWT_ACCESS_SECRET
       if(!jwtAccessSecret){
        throw new Error("JWT_ACCESS_SECRET n'existe pas")

       }
       super({
        jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwtAccessSecret
       })

 }
 validate(payload: JWTPayload)  {
    return  payload
 }
 
}

 
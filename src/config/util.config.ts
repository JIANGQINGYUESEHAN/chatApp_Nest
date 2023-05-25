import { HttpException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
//密码加密
export function encryption(password: string) {
    return bcrypt.hashSync(password, 10)
}
//密码解密
export function decrypt(password: string, comparePassword: string) {
    return bcrypt.compareSync(password, comparePassword)
}
//token配置

export interface UserConfigInterface {
    hash: 10,
    TokenConfig: JwtConfig
}
export interface JwtConfig {
    secret: string
    token_expired: number
}
export interface JwtPayload {
    sub: string,
    iat: number
}
export const AccessTokenConfig = (): UserConfigInterface => {
    return {
        hash: 10,
        TokenConfig: {
            secret: 'b9c7183-790f-4897-a2d6-df96df75991c',
            token_expired: 3600,
        }
    }
}

export enum StatusCode {
    Success = 200,
    Error = 403,
    SocketConnectError = 205,
  }
  export default class CommonException extends HttpException {
    constructor(msg: string, statusCode = StatusCode.Error) {
      super({ statusCode, message: msg }, StatusCode.Error);
    }
  }
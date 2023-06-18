import { CanActivate, ExecutionContext, HttpException, Injectable, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";
import { Socket } from "socket.io";
import { errorResp } from "src/config/util.config";
import { TokenService } from "src/service";
import { StatusCode } from '../../config/util.config';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsTokenGuard implements CanActivate {
  constructor(protected tokenService: TokenService) {
  }
  canActivate(context: ExecutionContext) {

    try {
      const client = context.switchToWs().getClient<Socket>()
      let token = client.handshake?.headers?.token;



      if (token == undefined) {

        throw new HttpException({ msg: "jwt must be provided", Status: HttpStatus.UNAUTHORIZED }, HttpStatus.UNAUTHORIZED)

      }
      let IsTrue = this.tokenService.verifyAccessToken(token);

      if (!IsTrue) {

        throw new WsException({ msg: "请重新登录", Status: 401 })
      }


      return IsTrue
    } catch (error) {
      throw new HttpException({ msg: "jwt must be provided", Status: HttpStatus.UNAUTHORIZED }, HttpStatus.UNAUTHORIZED)

    }
  }
}


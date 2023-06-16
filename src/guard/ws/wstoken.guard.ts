import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";
import { Socket } from "socket.io";
import { errorResp } from "src/config/util.config";
import { TokenService } from "src/service";

@Injectable()
export class WsTokenGuard implements CanActivate {
  constructor(protected tokenService: TokenService) {
  }
  canActivate(context: ExecutionContext) {

    const client = context.switchToWs().getClient<Socket>()
    let token = client.handshake?.headers?.token;

    if (!token) {
      client.emit('mistake', errorResp({ msg: "请登录", statusCode: 401 }));
    }
    let IsTrue = this.tokenService.verifyAccessToken(token);

    if (!IsTrue) {
      client.emit('mistake', errorResp({ msg: "请重新登录", statusCode: 401 }));
    }


    return IsTrue
  }
}

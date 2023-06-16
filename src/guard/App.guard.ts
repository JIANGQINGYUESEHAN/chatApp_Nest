import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';
import { TokenService } from 'src/service';
import { isNil } from 'lodash';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(protected tokenService: TokenService) {
    super();
  }
  canActivate(context: ExecutionContext) {
    let request = this.getRequest(context);
    let response = this.getRespond(context);

    //从请求头中获取token
    let token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    // console.log(token);

    //先看是否存在
    if (!token) return false;
    //存在后验证token是否合格

    let IsTrue = this.tokenService.verifyAccessToken(token);
    return IsTrue;
  }
  protected getRespond(context: ExecutionContext) {
    let Response = context.switchToHttp().getResponse();
    return Response;
  }
  protected getRequest(context: ExecutionContext) {
    let Request = context.switchToHttp().getRequest();
    return Request;
  }
}

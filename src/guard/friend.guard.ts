import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import * as jwt from 'jsonwebtoken';
import { AccessTokenConfig } from 'src/config/util.config';
import { FriendService } from 'src/service';
@Injectable()
export class FriendGuard implements CanActivate {
  constructor(protected friendService: FriendService) {}
  async canActivate(context: ExecutionContext) {
    try {
      //跟据接口获取 userid
      let request = this.Request(context);

      let token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
      if (!token) {
        throw new HttpException(
          {
            msg: '请登录',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
      //检验 token 并且返回 userid
      let config = AccessTokenConfig();

      let obj = jwt.verify(token, config.TokenConfig.secret);

      let param = this.GetParam(request, 'id');
      let user = obj.sub;
      let friend = param;

      let { IsFriend } = await this.friendService.checkRelation(user, friend);

      return IsFriend;
      // 验证成功，继续处理逻辑
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        // JWT 验证失败，需要重新登录
        throw new HttpException(
          {
            msg: '请重新登录',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
  }

  protected Request(context: ExecutionContext) {
    let request = context.switchToHttp().getRequest();
    return request;
  }
  protected GetParam(request: any, paramName: string): string {
    const paramValue = request.params[paramName];
    return paramValue;
  }
  protected Response(context: ExecutionContext) {
    let response = context.switchToHttp().getResponse();
    return response;
  }
}

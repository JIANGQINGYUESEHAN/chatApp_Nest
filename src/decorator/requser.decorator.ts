import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';
import { UserEntity } from 'src/entity/user.entity';
import * as jwt from 'jsonwebtoken';
import { AccessTokenConfig } from 'src/config/util.config';
export const ReqUser = createParamDecorator(
  async (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    //获取token
    let token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    let config = AccessTokenConfig();
    //token 进行解析
    let obj = jwt.verify(token, config.TokenConfig.secret);

    return obj.sub;
  },
);

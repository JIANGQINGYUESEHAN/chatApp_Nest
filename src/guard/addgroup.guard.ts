import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ExtractJwt } from 'passport-jwt';

import { CUSTOM_STRING_METADATA_KEY } from 'src/config/decorator.config';
import { AccessTokenConfig } from 'src/config/util.config';
import {
  GroupRelationRepository,
  GroupRepository,
} from 'src/repository/group.repository';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class AddGroupGuard implements CanActivate {
  constructor(
    protected groupRepository: GroupRepository,
    protected groupRelationRepository: GroupRelationRepository,
  ) {}

  async canActivate(context: ExecutionContext) {
    //token 进行解析
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

      const customString = Reflect.getMetadata(
        CUSTOM_STRING_METADATA_KEY,
        context.getHandler(),
      );

      //跟据传回的参数进行查询

      //查看群的守卫

      if (customString == 'userId') {
        let item = await this.groupRelationRepository
          .createQueryBuilder('group')
          .where('group.groupId = :groupId', { groupId: param })
          .leftJoinAndSelect('group.user', 'userId')
          .getMany();
        let userId = obj.sub;
        console.log(userId);

        if (!item) {
          throw new HttpException('无对应', HttpStatus.UNAUTHORIZED);
        }
        console.log(item);

        let isTrue = item.some((item, index) => {
          return userId == item.user.id;
        });

        return !isTrue;
      }
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
    //获取从前端传回的param参数
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

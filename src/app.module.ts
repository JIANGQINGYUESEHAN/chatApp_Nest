import { Global, Module } from '@nestjs/common';
import TypeOrmOptions from './config/databas.option';
import { DatabaseModule } from './module/database.moudle';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { AppPipe } from './pipe/app.pipe';
import { AppFilter } from './filter/httpexception.filter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { AccessTokenConfig } from './config/util.config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt'
import { PassportModule } from "@nestjs/passport";
import { UserRepository } from './repository/user.repository';
import * as services from './service'
import * as controller from './controller'
import { FriendEntity } from './entity/friend.entity';
export const jwtModuleRegister = (): JwtModuleOptions => {
  const config = AccessTokenConfig()
  const isProd = 'production'
  const option: JwtModuleOptions = {
    secret: config.TokenConfig.secret,

    verifyOptions: {
      ignoreExpiration: !isProd
    },

  }
  if (isProd) option.signOptions = { expiresIn: `${config.TokenConfig.token_expired}s` }
  return option
}


@Module({
  imports: [DatabaseModule.forRoot(TypeOrmOptions()), TypeOrmModule.forFeature([UserEntity,FriendEntity]), JwtModule.registerAsync({ useFactory: jwtModuleRegister }), PassportModule, DatabaseModule.forRepository([UserRepository]),],
  controllers: Object.values(controller),
  exports: [...Object.values(services), DatabaseModule.forRepository([UserRepository])],
  providers: [...Object.values(services), {
    provide: APP_INTERCEPTOR,
    useClass: TransformInterceptor,
  }, {
    provide: APP_PIPE,
    useValue: new AppPipe({
      validationError: { target: true },
      forbidUnknownValues: true,
      transform: true,
      whitelist: true
    })
  }, {
    provide: APP_FILTER,
    useClass: AppFilter
  }
  ],
})
export class AppModule { }


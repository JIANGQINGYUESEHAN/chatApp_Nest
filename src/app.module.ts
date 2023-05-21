import { Module } from '@nestjs/common';
import TypeOrmOptions from './config/databas.option';
import { DatabaseModule } from './module/database.moudle';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TransformInterceptor } from './interceptor/transform.interceptor';
import { AppPipe } from './pipe/app.pipe';
import { RegisterModule } from './module/register.module';
import { AppFilter } from './filter/httpexception.filter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';


@Module({
  imports: [DatabaseModule.forRoot(TypeOrmOptions()), RegisterModule,TypeOrmModule.forFeature([UserEntity]),],
  controllers: [],
  providers: [{
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


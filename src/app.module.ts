import { Module } from '@nestjs/common';
import TypeOrmOptions from './config/databas.option';
import { DataBaseModule } from './module/database.moudle';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TransInterceptor } from './interceptor/transform.interceptor';
import { AppPipe } from './pipe/app.pipe';
import { RegisterModule } from './module/register.module';
import { AppFilter } from './filter/httpexception.filter';


@Module({
  imports: [DataBaseModule.forRoot(TypeOrmOptions()), RegisterModule],
  controllers: [],
  providers: [{
    provide: APP_INTERCEPTOR, useClass: TransInterceptor
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


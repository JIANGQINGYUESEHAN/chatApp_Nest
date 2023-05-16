import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import TypeOrmOptions from './config/databas.option';
import { DataBaseModule } from './module/database.moudle';


@Module({
  imports: [DataBaseModule.forRoot(TypeOrmOptions())],
  controllers: [],
  providers: [],
})
export class AppModule {}


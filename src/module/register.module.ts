import { Module } from "@nestjs/common";
import * as services from '../service'
import * as controller from '../controller'
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/entity/user.entity";
import { DataBaseModule } from "./database.moudle";
import { UserRepository } from "src/repository/user.repository";
@Module({
    imports:[TypeOrmModule.forFeature([UserEntity]),DataBaseModule.forRepository([UserRepository])],
    providers:Object.values(services),
    controllers:Object.values(controller),
    exports:[...Object.values(services),DataBaseModule.forRepository([UserRepository])]
})
export class RegisterModule{}
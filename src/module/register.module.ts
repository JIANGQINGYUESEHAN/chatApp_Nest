import { Module } from "@nestjs/common";
import * as services from '../service'
import * as controller from '../controller'
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/entity/user.entity";
import { DatabaseModule } from "./database.moudle";
import { UserRepository } from "src/repository/user.repository";
import TypeOrmOptions from "src/config/databas.option";
@Module({
    imports:[DatabaseModule.forRepository([UserRepository])],
    providers:Object.values(services),
    controllers:Object.values(controller),
    exports:[...Object.values(services),DatabaseModule.forRepository([UserRepository])]
})
export class RegisterModule{}
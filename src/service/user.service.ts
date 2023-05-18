import { Injectable } from "@nestjs/common";
import { UserRepository } from "src/repository/user.repository";

@Injectable()
export class UserService{
    constructor(
        protected userRepository:UserRepository
    ){}
}
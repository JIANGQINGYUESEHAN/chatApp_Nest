import { Controller } from "@nestjs/common";
import { UserService } from "src/service";

@Controller('/user')
export class UserController{
    constructor(
        protected userService:UserService
    ){}
}
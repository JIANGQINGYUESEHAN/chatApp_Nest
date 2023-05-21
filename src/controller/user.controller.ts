import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { RegisterUserDto } from "src/dto/user.dto";
import { UserService } from "src/service";

@Controller('/user')
export class UserController{
    constructor(
        protected userService:UserService
    ){}
    @Post('/register')
    @HttpCode(200)
    register(@Body()registerUserDto:RegisterUserDto){
     return this.userService.register(registerUserDto)
        
    }
}
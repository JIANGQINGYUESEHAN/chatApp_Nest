import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { LoginDto, RegisterUserDto } from "src/dto/user.dto";
import { UserService } from "src/service";

@Controller('/user')
export class UserController {
    constructor(
        protected userService: UserService
    ) { }
    @Post('/register')
    @HttpCode(200)
    register(@Body() registerUserDto: RegisterUserDto) {
        return this.userService.register(registerUserDto)

    }
    @Post('/login')
    @HttpCode(200)
    login(@Body() loginDto: LoginDto) {
        console.log(loginDto);

        return this.userService.login(loginDto)

    }
}
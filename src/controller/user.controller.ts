import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { ReqUser } from "src/decorator/requser.decorator";
import { LoginDto, RegisterUserDto, UpdateDto } from "src/dto/user.dto";
import { JwtGuard } from "src/guard/App.guard";
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

    //更新用户
    @UseGuards(JwtGuard)
    @Post('/update')
    @HttpCode(200)
    updateUser(@Body() updateDto: UpdateDto, @ReqUser() userId) {
        //console.log(userId);

        return this.userService.UpdateUser(updateDto, userId)

    }
}
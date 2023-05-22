import { Body, Injectable } from "@nestjs/common";
import { LoginDto, RegisterUserDto } from "src/dto/user.dto";
import { UserRepository } from "src/repository/user.repository";
import { isNil } from 'lodash'
import { TokenService } from "./token.service";
import * as dayjs from "dayjs";
@Injectable()
export class UserService {
    constructor(
        protected userRepository: UserRepository,
        protected tokenService: TokenService
    ) { }
    //注册用户
    async register(registerUserDto: RegisterUserDto) {
        let item = await this.userRepository.BaseQuery().insert().values({ ...registerUserDto }).execute()
        if (isNil(item)) return "注册失败"
        return "注册成功"

    }
    //登录
    async login(loginDto: LoginDto) {
        //跟据 username 查询 数据 和密码 对比密码  返回token
        let result = await this.userRepository.createQueryBuilder('user')
                               .where({ username: loginDto.username })
                               .getOne()
    

        //比较密码

        //返回token
        let now=dayjs()
        let token=await this.tokenService.generateAccessToken(result,now)
        return token
        

    }

    //退出登录
    loginOut(){}
    //删除好友
    //添加好友
    //添加群
    //退群

}
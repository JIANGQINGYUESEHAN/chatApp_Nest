import { Injectable } from "@nestjs/common";
import { RegisterUserDto } from "src/dto/user.dto";
import { UserRepository } from "src/repository/user.repository";
import{isNil}from 'lodash'
@Injectable()
export class UserService{
    constructor(
        protected userRepository:UserRepository
    ){}
    //注册用户
   async register(registerUserDto:RegisterUserDto){
       let item= await this.userRepository.BaseQuery().insert().values({...registerUserDto}).execute()
       if(isNil(item)) return "注册失败"
       return "注册成功"
       
    }
    //登录
    //删除好友
    //添加好友
    //添加群
    //退群
    
}
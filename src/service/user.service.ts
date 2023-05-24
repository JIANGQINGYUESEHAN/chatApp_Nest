import { Body, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { LoginDto, RegisterUserDto, UpdateDto } from "src/dto/user.dto";
import { UserRepository } from "src/repository/user.repository";
import { isNil } from 'lodash'
import { TokenService } from "./token.service";
import * as dayjs from "dayjs";
import { ExtractJwt } from "passport-jwt";
import * as request from 'supertest';
import { UserEntity } from "src/entity/user.entity";
import { UpdateResult } from "typeorm";
@Injectable()
export class UserService {
    constructor(
        protected userRepository: UserRepository,
        protected tokenService: TokenService,
        
    ) { }
    //注册用户
    async register(registerUserDto: RegisterUserDto) {
        let item =await this.userRepository.save(registerUserDto, { reload: true });
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

        if(!result) return "请输入正确的账号和密码"
        //返回token
        let now=dayjs()
        let token=await this.tokenService.generateAccessToken(result,now)

        return token
        

    }
    //跟新用户
    async UpdateUser(updateDto: UpdateDto, userId: string) {
        console.log(userId);
        
        try {
          // 获取qb
          const qb = await this.userRepository.createQueryBuilder().where("id = :id", { id:userId })
        // console.log(qb); // 打印生成的 SQL 查询语句，用于调试
        //return qb
        //   // 进行更新操作
         const result: UpdateResult = await qb.update().set({ ...updateDto }).execute();
          console.log(result);
      
          if (result.affected === 0) {
            throw new Error("User not found or update operation failed."); // 抛出错误，指示更新失败
          }
      
          return {
            result,
            msg:"更新成功"
          };
        } catch (error) {
          console.error(error); // 打印错误消息或异常信息，用于调试
          throw error; // 重新抛出异常，以便在调用方进行进一步处理
        }
      }
    //修改密码
    fixPassword(){}

    //忘记密码

    //修改标签

    //删除用户

    //删除好友

    //添加好友
    //添加群
    //退群
    
}
import { Injectable } from "@nestjs/common";
import { GroupRepository } from "src/repository/group.repository";
import { GroupRelationRepository } from '../repository/group.repository';
import { CreateGroupDto } from "src/dto/group.dto";

@Injectable()
export class GroupService{
    constructor(
        protected groupRepository:GroupRepository,
        protected groupRelationRepository: GroupRelationRepository
    ){}
   //查看群信息
   detail(id:string){
    this.groupRepository.findOne({where:{id}})
   }

    //创建群
   
  async  CreateGroupe(createGroupDto:CreateGroupDto,groupManagerId){
    let item=await    this.groupRepository.save({ groupManagerId,...createGroupDto })
        
    }
    
    
    //修改群名称
    

    //删除群

    //判断是否在群

    //加群

    //退群

    //获取群内所有人信息

    //聊天
}
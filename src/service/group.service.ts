import { Injectable } from "@nestjs/common";
import { GroupRepository } from "src/repository/group.repository";
import { GroupRelationRepository } from '../repository/group.repository';
import { CreateGroupDto, UpdateGroupDto } from "src/dto/group.dto";
import { GroupEntity } from '../entity/group.entity';
import { GroupRelationEntity } from "src/entity/group.relation.entity";
import { UserService } from "./user.service";


@Injectable()
export class GroupService {
  constructor(
    protected groupRepository: GroupRepository,
    protected groupRelationRepository: GroupRelationRepository,
    protected userService: UserService
  ) { }
  //查看群信息
  async detail(id: string) {
    let item = await this.groupRepository.findOne({ where: { id } })
    return item
  }

  //创建群

  async CreateGroupe(createGroupDto: CreateGroupDto, groupManagerId) {
    let item = await this.groupRepository.save({ groupManagerId, ...createGroupDto })
    return item

  }
  //群主删除群
  async DeleteGroup(id: string) {
    const group = await this.groupRepository.findOne({ where: { id } });

    if (!group) {
      throw new Error(`Group with ID ${id} not found.`);
    }

    await this.groupRelationRepository
      .createQueryBuilder()
      .delete()
      .from(GroupRelationEntity)
      .where("group = :groupId", { groupId: id })
      .execute();
    await this.groupRepository.remove(group);
  }
  //修改群(名称，群头像)
  async UpdateGroup(updateMessage: UpdateGroupDto, id: string) {
    let item = await this.groupRepository.createQueryBuilder('group')
      .update({ ...updateMessage })
      .where({ id })
      .execute()
    if (item.affected == 1) {
      return this.detail(id)
    } else {
      throw new Error(`Group with ID ${id} not found.`);
    }

  }


  //加群
  async AddGroup(userId, groupId) {
    let user = await this.userService.GetDetail(userId)
    let group = await this.detail(groupId)

    let item = await this.groupRelationRepository.save({ user, group })
  
  if(item.id){
    return {
      msg:"加群成功"
    }
  }

  }

  //获取群内所有人信息
 async getGroupInform(){}
  //退群

  





  //聊天
}
import { HttpException, Injectable } from '@nestjs/common';
import { GroupRepository } from 'src/repository/group.repository';
import { GroupRelationRepository } from '../repository/group.repository';
import { CreateGroupDto, UpdateGroupDto } from 'src/dto/group.dto';
import { GroupEntity } from '../entity/group.entity';
import { GroupRelationEntity } from 'src/entity/group.relation.entity';
import { UserService } from './user.service';

@Injectable()
export class GroupService {
  constructor(
    protected groupRepository: GroupRepository,
    protected groupRelationRepository: GroupRelationRepository,
    protected userService: UserService,
  ) { }
  //查看群信息
  async detail(id: string) {
    const item = await this.groupRepository.findOne({ where: { id } });
    return item;
  }

  //创建群

  async CreateGroupe(createGroupDto: CreateGroupDto, groupManagerId) {
    const item = await this.groupRepository.save({
      groupManagerId,
      ...createGroupDto,
    });
    return item;
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
      .where('group = :groupId', { groupId: id })
      .execute();
    await this.groupRepository.remove(group);
  }
  //修改群(名称，群头像)
  async UpdateGroup(updateMessage: UpdateGroupDto, id: string) {
    const item = await this.groupRepository
      .createQueryBuilder('group')
      .update({ ...updateMessage })
      .where({ id })
      .execute();
    if (item.affected == 1) {
      return this.detail(id);
    } else {
      throw new Error(`Group with ID ${id} not found.`);
    }
  }

  //加群
  async AddGroup(userId, groupId) {
    const user = await this.userService.GetDetail(userId);
    const group = await this.detail(groupId);

    const item = await this.groupRelationRepository.save({ user, group });

    if (item.id) {
      return {
        msg: '加群成功',
      };
    }
  }

  //获取群内所有人信息
  async getGroupInform(id: any) {
    //获取群成员信息
    const item = await this.groupRelationRepository
      .createQueryBuilder('group')
      .where('group.groupId = :groupId', { groupId: id })
      .leftJoinAndSelect('group.user', 'userId')
      .getMany();
    if (item.length == 0) {
      throw new HttpException({ msg: '错误未加入该群' }, 301);
    }

    if (item.length != 0) {
      return item.map((perSon) => {
        delete perSon.user.password;
        return perSon;
      });
    }
  }
  //退群
  async Withdrawal(userId: string, id: string) {
    const item = await this.groupRelationRepository
      .createQueryBuilder('group')
      .where('group.userId = :userId', { userId })
      .leftJoinAndSelect('group.user', 'userId')
      .getOne();

    console.log(item.user);

    await this.groupRelationRepository.remove(item);

    return {
      msg: '退出成功',
    };
  }

  //聊天
}

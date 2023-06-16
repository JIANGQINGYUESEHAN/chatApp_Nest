import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from 'src/repository/user.repository';
import { FriendRepository } from 'src/repository/friend.repository';
import CommonException from 'src/config/util.config';
import { FriendEntity } from 'src/entity/friend.entity';
import { In } from 'typeorm';

@Injectable()
export class FriendService {
  constructor(
    protected userService: UserService,
    protected userRepository: UserRepository,
    protected friendRepository: FriendRepository
  ) {}
  //删除好友
  //添加好友
  //判断是否是自己好友
  async checkRelation(OwnerId, FriendId) {
    let IsFriend = false;
    //判断是否相等不能加自己

    let Owner = await this.userService.GetDetail(OwnerId);

    let Friend = await this.userService.GetDetail(FriendId);

    if (Owner.id == Friend.id) {
      throw new CommonException('不能添加自己');
    }
    let OwnerRelation = (await this.GetFriends(
      Owner.id
    )) as unknown as Array<any>;

    IsFriend = OwnerRelation.some((item) => {
      return item.friend.id === Friend.id;
    });

    return { Owner, Friend, IsFriend };
  }
  //添加朋友
  async AddFriend(OwnerId, friendName) {
    let { Friend, Owner, IsFriend } = await this.checkRelation(
      OwnerId,
      friendName
    );
    if (IsFriend) {
      return this.userService.GetDetail(Friend.id);
    }
    //添加好友
    await this.friendRepository.save({ user: Friend, friend: Owner });
    await this.friendRepository.save({ user: Owner, friend: Friend });
    return null;
  }
  //获取所有好友
  async GetFriends(OwnerId) {
    const user = await this.friendRepository
      .createQueryBuilder('friends')
      .where('friends.userId = :userId', { userId: OwnerId })
      .leftJoinAndSelect('friends.friend', 'friend')

      .getMany();

    return user;
  }
  //获取好友信息
  async getFriendMessage(findFriendDto) {
    return this.userService.GetDetail(findFriendDto);
  }
  //删除朋友
  async DeleteFriend(OwnerId, deleteFriend) {
    // let Owner = await this.userService.GetDetail(OwnerId)

    // let Friend = await this.userService.GetDetail(FriendId)

    let item = await this.friendRepository
      .createQueryBuilder()
      .delete()
      .where({ user: OwnerId, friend: deleteFriend })
      .execute();
    if (item.affected == 1) {
      return {
        msg: '删除成功'
      };
    }
    return {
      msg: '删除失败'
    };
  }
}

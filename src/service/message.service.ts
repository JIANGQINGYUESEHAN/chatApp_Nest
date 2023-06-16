import { Injectable } from '@nestjs/common';
import {
  GroupRelationRepository,
  GroupRepository,
} from 'src/repository/group.repository';
import {
  FriendMessageRepository,
  GroupMessageRepository,
} from 'src/repository/message.repository';
import { UserRepository } from 'src/repository/user.repository';
import { UserService } from './user.service';
import { GroupService } from './group.service';
import {
  GenerateUniqueRoomId,
  MessageType,
  Type,
  formatTime,
  getTimeDiff,
} from 'src/config/util.config';
import { friendRecentChat, GroupRecentChat } from 'src/config/util.config';
import * as dayjs from 'dayjs';
import { FriendMessageEntity } from 'src/entity/friendmessage.entity';
import { GroupMessageEntity } from 'src/entity/groupmessage.entity';
@Injectable()
export class MessageService {
  constructor(
    protected groupRepository: GroupRepository,
    protected userRepository: UserRepository,
    protected groupRelationRepository: GroupRelationRepository,
    protected friendMessageRepository: FriendMessageRepository,
    protected groupMessageRepository: GroupMessageRepository,
    protected userService: UserService,
    protected groupService: GroupService,
  ) { }

  //获取当前所有聊天对象的列表
  async getRecentMessageList(userId) {
    const friend = await this.getRecentChatUser(userId);
    const group = await this.getRecentChatGroup(userId);
    const msg = friend.concat(group as any);

    msg.sort((a, b) => {
      return dayjs(a.time).isAfter(b.time) ? -1 : 0;
    });

    msg.map((item, index) => {
      (item.id = index), (item.time = getTimeDiff(item.time));
      return item;
    });

    return msg;
  }
  //获取 当前聊天对象的信息
  async getRecentChatUser(userId) {
    const message = await this.friendMessageRepository
      .createQueryBuilder('msg')
      .orderBy('msg.createTime', 'DESC')
      .leftJoinAndSelect('msg.sender', 'sender')
      .leftJoinAndSelect('msg.receiver', 'receiver')
      .orWhere('sender.id=:userId', { userId })
      .orWhere('receiver.id=:userId', { userId })
      .getMany();
    const res = [];
    const map = new Map();
    //生成唯一id
    for (const item of message) {
      const Id = GenerateUniqueRoomId(item.sender.id, item.receiver.id);
      //判断之前存储过没
      if (!map.has(Id)) {
        //进行存储
        map.set(Id, item.id);
        res.push(item);
      }
    }
    //
    const obj = res.map((item) => {
      //判断哪一个是好友
      const friend = item.sender.id == userId ? item.receiver : item.sender;
      const obj: friendRecentChat = {
        id: friend.id,
        avatarSrc: friend.avatarSrc,
        name: friend.username,
        intro: friend.intro,
        content: item.content,
        contentType: item.type,
        time: formatTime(item.createTime),
        type: Type.friend,
        unreadCount: 0,
      };
      return obj;
    });
    return obj;
  }
  //获取当前群的聊天的记录
  async getRecentChatGroup(userId) {
    const groups = await this.groupRelationRepository
      .createQueryBuilder('relation')
      .leftJoinAndSelect('relation.group', 'group')
      .leftJoinAndSelect('relation.user', 'user')
      .leftJoinAndSelect('group.groupMessage', 'msg')
      .where('user.id = :userId', { userId })
      .andWhere('msg.groupId = group.id')
      .getMany();

    const RecentChatGroup = groups.map((item) => {
      const group = item.group;
      const user = item.user;

      //获取到最后一条信息
      const groupMessage = item.group.groupMessage.pop();

      const msg: GroupRecentChat = {
        id: groupMessage.id,
        groupAvatarSrc: group.avatarSrc,
        groupName: group.groupName,
        groupIntro: group.intro,
        userId: user.id,
        userName: user.username,
        userAvatarSrc: user.avatarSrc,
        content: groupMessage.content,
        contentType: groupMessage.type,
        time: formatTime(groupMessage.createTime),
        type: Type.group,
        unreadCount: 0,
      };
      return msg;
    });

    return RecentChatGroup;
  }

  // 查询我发给好友的/好友发给我的 消息
  async getFriendMessage(userId, friendId) {
    const item = await this.friendMessageRepository
      .createQueryBuilder('msg')
      .orderBy('msg.createTime', 'ASC')
      .leftJoinAndSelect('msg.sender', 'sender')
      .leftJoinAndSelect('msg.receiver', 'receiver')
      .where('msg.sender= :senderId And msg.receiver= :receiverId ', {
        senderId: userId,
        receiverId: friendId,
      })
      .orWhere('sender.id = :receiverId And receiver.id = :senderId', {
        senderId: userId,
        receiverId: friendId,
      })
      .getMany();
    return item;
  }
  async sendFriendMessage(
    senderId,
    receiverId,
    { content = '', type = 'TEXT' },
  ) {
    const senderUser = await this.userService.GetDetail(senderId);
    const receiverUser = await this.userService.GetDetail(receiverId);
    const message = new FriendMessageEntity();
    message.sender = senderUser;
    message.receiver = receiverUser;
    message.content = content;
    message.type = type;
    return this.friendMessageRepository.save(message);
  }
  async getGroupMessage(groupId: string) {
    const groupMessage = this.groupMessageRepository
      .createQueryBuilder('msg')
      .orderBy('msg.createTime', 'ASC')
      .leftJoinAndSelect('msg.user', 'user')
      .where('msg.group.id = :id', { id: groupId })
      .getMany();

    return groupMessage;
  }
  async sendGroupMessage(senderId, groupId, { content = '', type = 'TEXT' }) {
    const senderUser = await this.userService.GetDetail(senderId);
    const Group = await this.groupService.detail(groupId);
    const message = new GroupMessageEntity();
    message.user = senderUser;
    message.group = Group;
    message.content = content;
    message.type = type as MessageType;
    return this.groupMessageRepository.save(message);
  }
}

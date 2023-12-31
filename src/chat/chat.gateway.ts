import {
  Body,
  HttpCode,
  HttpStatus,
  Injectable,
  Logger,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import {
  GenerateUniqueRoomId,
  errorResp,
  successResp,
} from "src/config/util.config";

import { BadRequestTransformationFilter } from "src/filter/chatexception.filter";
import { UseGuards } from "@nestjs/common";
import {
  FriendService,
  GroupService,
  MessageService,
  UserService,
} from "src/service";
import { WsTokenGuard } from "src/guard/ws/ws.token.guard";
import { FriendMessageConnectDto, FriendMessageDto, GroupMessageConnectDto, GroupMessageDto, noticeDto } from "src/dto/msg.dto";
import { AppFilter } from "src/filter/httpexception.filter";
import { WsGroupFriedGuard } from "src/guard/ws/ws.group.friend.guard";
@Injectable()
@UseGuards(WsTokenGuard)
@UsePipes(ValidationPipe)
@UseFilters(BadRequestTransformationFilter)
@WebSocketGateway(3002, { cors: true, transports: ["websocket"] })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server; // socket 实例

  roomUserIds: Map<string, any>; //存储俩人聊天 和群组聊天房间号
  liveUserIds: Map<string, any>;//存储上线用户的id

  constructor(
    protected userService: UserService,
    protected messageService: MessageService,
    protected friendService: FriendService,
    protected groupService: GroupService
  ) {
    this.liveUserIds = new Map();
    this.roomUserIds = new Map()
  }
  afterInit(server: any) {
    Logger.log("聊天初始化");
  }

  handleConnection(client: any, ...args: any[]) {
    const id = client.handshake?.headers?.userid; //从浏览器进行发送
    if (id) {
      this.liveUserIds.set(id, id);
      client.join(id); //是 Socket.IO 中用于将客户端连接加入指定房间的方法。
      Logger.log(`id = ${id}的用户上线了`);
    }
  }
  handleDisconnect(client: any) {
    const id = client.handshake?.headers?.userid;
    this.liveUserIds.delete(id);

    Logger.log(`id = ${id}的用户下线了`);
  }

  //定义错误处理事件
  @SubscribeMessage("mistake")
  async takeMistake(@ConnectedSocket() client: Socket) {
    try {
      throw new Error("An error occurred");
    } catch (error) {
      // 发送错误消息给客户端
      client.emit("error", error.message);
    }
  }

  //朋友上线连接
  @UseGuards(WsGroupFriedGuard)
  @SubscribeMessage("friendChatConnect")
  async friendChatConnect(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: FriendMessageConnectDto
  ) {
    try {
      const { senderId, receiverId } = data;

      const roomId = GenerateUniqueRoomId(senderId, receiverId);



      this.roomUserIds.set(roomId, roomId);
      client.join(roomId);
      this.server
        .to(roomId)
        .emit("friendChatConnect", successResp({ data: "连接成功" }));
    } catch (error) {
      // 发送错误消息给客户端
      client.emit("error", error.message);
    }
  }

  //朋友聊天对话
  @SubscribeMessage('friendChatMessage')
  async friendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: FriendMessageDto,
  ) {

    console.log(data);
    const { senderId, receiverId, content, type } = data;

    const ID = GenerateUniqueRoomId(senderId, receiverId);
    let check = this.checkRoomExists(ID)
    if (!check) {
      throw new WsException({ msg: "房间号不存在", status: HttpStatus.CREATED })
    }

    const roomId = this.roomUserIds.get(ID);

    try {

      client.join(roomId);


      const message = await this.messageService.sendFriendMessage(
        senderId,
        receiverId,
        { content, type },
      );

      //通知两人
      this.server.to(roomId).emit('friendChatMessage', successResp(message));

      //假如其他人不在线
      this.server.to(String(receiverId)).emit('notice', successResp(message));

    } catch (error) {
      this.server.to(roomId).emit('friendChatMessage', errorResp(error));
    }
  }
  //整体通知事件
  @SubscribeMessage('notice')
  async notice(@ConnectedSocket() client: Socket, @MessageBody() data: noticeDto) {
    //获取在线用户
    this.server.emit("notice", successResp(data))
  }
  @SubscribeMessage('groupChatConnect')
  async groupChatConnect(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: GroupMessageConnectDto,
  ) {
    const { senderId, groupId } = data;
    console.log(senderId, groupId);

    const group = groupId + '';
    try {
      const user = await this.userService.GetDetail(senderId);

      client.join(group);
      this.server
        .to(group)
        .emit(
          'groupChatConnect',
          successResp(data, `${user.username}加入了群聊`),
        );
    } catch (e) {
      this.server.emit('groupChatConnect', errorResp(e));
    }
  }
  //

  @SubscribeMessage('groupChatMessage')
  async groupChatMessage(
    @ConnectedSocket() chat: Socket,
    @MessageBody() data: GroupMessageDto,
  ) {
    const { senderId, groupId, content, type } = data;

    const roomId = groupId + '';
    try {
      let groupMessage = await this.messageService.sendGroupMessage(
        senderId,
        groupId,
        { content, type },
      );

      this.server
        .to(roomId)
        .emit('groupChatMessage', successResp(groupMessage));
      // 通知不在看群但是在线的人
      await this.noticeGroupMember(
        senderId,
        groupId,
        successResp(groupMessage),
      );
    } catch (error) {
      this.server.emit('groupChatMessage', errorResp(error));
    }
  }
  async noticeGroupMember(userId, groupId, content) {
    const Member = await this.groupService.getGroupInform(groupId);

    const userIds = Member.map((item) => String(item?.user?.id));
    console.log(userIds);

    const liverGroupMember = userIds.filter((i) => {
      return String(i) !== userId.toString();
    });
    console.log(liverGroupMember);
    console.log(this.liveUserIds);

    //对信息进行广播
    // 通知在线的群员有新消息
    for (const i of liverGroupMember) {
      this.server.to(String(i)).emit('notice', content);
    }
  }

  //判断房间号是否存在
  checkRoomExists(roomId: string): boolean {
    const rooms = Array.from(this.server.sockets.adapter.rooms.keys());
    return rooms.includes(roomId);
  }

}

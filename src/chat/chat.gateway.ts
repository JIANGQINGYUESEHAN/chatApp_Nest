import {
  Body,
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
import { WsTokenGuard } from "src/guard/ws/wstoken.guard";
import { FriendMessageConnectDto, FriendMessageDto } from "src/dto/msg.dto";
@Injectable()
@UseGuards(WsTokenGuard)
@UsePipes(ValidationPipe)
@UseFilters(BadRequestTransformationFilter)
@WebSocketGateway(3002, { cors: true, transports: ["websocket"] })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server; // socket 实例

  liveUserIds: Map<string, any>; //存储房间id号

  constructor(
    protected userService: UserService,
    protected messageService: MessageService,
    protected friendService: FriendService,
    protected groupService: GroupService
  ) {
    this.liveUserIds = new Map();
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
    this.server.emit("onlineStatus", Array.from(this.liveUserIds));
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
  @SubscribeMessage("friendChatConnect")
  async friendChatConnect(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: FriendMessageConnectDto
  ) {
    try {
      const { senderId, receiverId } = data;

      const roomId = GenerateUniqueRoomId(senderId, receiverId);


      this.liveUserIds.set(roomId, roomId);
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

    const roomId = this.liveUserIds.get(ID);

    try {

      const roomExists = this.checkRoomExists(roomId);
      if (roomExists) {
        throw new Error()
      }
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
  async notice(@ConnectedSocket() client: Socket, data) {
    return '订阅成功';
  }
  //判断房间号是否存在
  checkRoomExists(roomId: string): boolean {
    const rooms = Array.from(this.server.sockets.adapter.rooms.keys());
    return rooms.includes(roomId);
  }

  //转成数字的方法
  ChangeNumber(str: string) {
    let a = parseInt(str)
    console.log(a);
    return a

  }
}

import {
  Body,
  Injectable,
  Logger,
  UseFilters,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FriendMessageDto } from 'src/dto/msg.dto';
import { BadRequestTransformationFilter } from 'src/filter/chatexception.filter';
import {
  FriendService,
  GroupService,
  MessageService,
  UserService
} from 'src/service';
@Injectable()
@UsePipes(ValidationPipe)
@UseFilters(BadRequestTransformationFilter)
@WebSocketGateway(3002, { cors: true, transports: ['websocket'] })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
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
    Logger.log('聊天初始化');
  }
  handleConnection(client: any, ...args: any[]) {
    const id = client.handshake?.headers?.userid; //从浏览器进行发送
    if (id) {
      this.liveUserIds.set(id, id);
      client.join(id); //是 Socket.IO 中用于将客户端连接加入指定房间的方法。
      this.server.emit('onlineStatus', this.liveUserIds);
      Logger.log(`id = ${id}的用户上线了`);
    }
  }
  handleDisconnect(client: any) {
    const id = client.handshake?.headers?.userid;
    this.liveUserIds.delete(id);
    this.server.emit('onlineStatus', Array.from(this.liveUserIds));
    Logger.log(`id = ${id}的用户下线了`);
  }
  @SubscribeMessage('friendChatConnect')
  async friendChatConnect(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: FriendMessageDto
  ) {
    console.log(data);
  }
}

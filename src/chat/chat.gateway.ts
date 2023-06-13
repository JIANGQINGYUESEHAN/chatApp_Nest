import { Injectable, Logger, SetMetadata, UseGuards } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { CUSTOM_STRING_METADATA_KEY } from "src/config/decorator.config";
import { GenerateUniqueRoomId, errorResp, successResp } from "src/config/util.config";
import { ReqUser } from "src/decorator/requser.decorator";
import { GroupMessageDto } from "src/dto/group.dto";
import { FriendMessageDto } from "src/dto/msg.dto";
import { JwtGuard } from "src/guard/App.guard";
import { FriendGuard } from "src/guard/friend.guard";
import { FriendService, GroupService, MessageService, UserService } from "src/service";
@Injectable()
@WebSocketGateway(3002, { cors: true, transports: ['websocket'] })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server; // socket 实例

    liveUserIds: Set<string>; // 在线用户的id

    constructor(
        protected userService: UserService,
        protected messageService: MessageService,
        protected friendService: FriendService,
        protected groupService: GroupService
    ) {
        this.liveUserIds = new Set<string>();
    }
    afterInit(server: any) {
        Logger.log("聊天初始化")
    }

    handleConnection(client: any, ...args: any[]) {
        // 根据用户id给每个连上的用户分配房间 ,用于消息通知
        const id = client.handshake?.query?.userId;//从浏览器进行发送
        if (id) {
            client.join(id)//是 Socket.IO 中用于将客户端连接加入指定房间的方法。
            this.liveUserIds.add(id)//Set存储结构的方法
            this.server.emit("onlineStatus", Array.from(this.liveUserIds))
            Logger.log(`id = ${id}的用户上线了`);
        }


    }
    handleDisconnect(client: any) {
        const id = client.handshake?.query?.userId;
        this.liveUserIds.delete(id)
        this.server.emit("onlineStatus", Array.from(this.liveUserIds))
        Logger.log(`id = ${id}的用户下线线了`);
    }

    //与好友建立连接
    @UseGuards(FriendGuard)
    @SubscribeMessage("friendChatConnect")
    async friendChatConnect(client: Socket, data: FriendMessageDto) {
        const { senderId, receiverId } = data;
        const roomId = GenerateUniqueRoomId(senderId, receiverId)
        try {
            client.join(roomId)
            this.server.to(roomId).emit("friendChatConnect", successResp(data, "连接成功"));
        } catch (error) {
            this.server.emit("friendChatConnect", errorResp(error));
        }

    }

    //给好友发消息
    @SubscribeMessage("friendChatMessage")
    async friendMessage(client: Socket, data: FriendMessageDto) {
        const { senderId, receiverId, content, type } = data;
        const roomId = GenerateUniqueRoomId(senderId, receiverId);
        try {
            const message = await this.messageService.sendFriendMessage(senderId, receiverId, { content, type });
            //通知两人
            this.server.to(roomId).emit("friendChatMessage", successResp(message))
            //假如其他人不在线
            this.server.to(String(receiverId)).emit("notice", successResp(message));

        } catch (error) {
            this.server.to(roomId).emit("friendChatMessage", errorResp(error));
        }
    }

    // 用于消息通知
    @SubscribeMessage("notice")
    async notice(client: Socket, data) {
        return "订阅成功";
    }
    // 用于在线用户通知
    @SubscribeMessage("onlineStatus")
    async onlineStatus(client: Socket, data) {
        const id = client.handshake?.query?.userId;
        this.server.to(id).emit("onlineStatus", Array.from(this.liveUserIds));
    }

    @UseGuards(JwtGuard)
    @SetMetadata(CUSTOM_STRING_METADATA_KEY, 'userId')
    @SubscribeMessage("groupChatConnect")
    async groupChatConnect(client: Socket, data) {
        const { senderId, groupId } = data;
        try {
            const user = await this.userService.GetDetail(senderId)


            client.join(groupId);
            this.server
                .to(groupId)
                .emit("groupChatConnect", successResp(data, `${user.username}加入了群聊`));
        } catch (e) {
            this.server.emit("groupChatConnect", errorResp(e));
        }
    }
    // 

    @SubscribeMessage("groupChatMessage")
    async groupChatMessage(chat: Socket, data: GroupMessageDto) {
        const { senderId, groupId, content, type } = data;

        const roomId = groupId + ""
        try {
            let groupMessage = this.messageService.sendGroupMessage(senderId, groupId, { content, type })
            this.server.to(roomId).emit("groupChatMessage", successResp(groupMessage))
            // 通知不在看群但是在线的人
            await this.noticeGroupMember(senderId, groupId, successResp(groupMessage));
        } catch (error) {
            this.server.emit("groupChatMessage", errorResp(error));
        }
    }
    async noticeGroupMember(userId, groupId, content) {
        const Member = await this.groupService.getGroupInform(userId, groupId)
        const userIds = Member.map(item => String(item?.user?.id));
        const liverGroupMember = userIds.filter(item => this.liveUserIds.has(item)).filter(
            (item) => item != String(userId)
        )
        //对信息进行广播
        // 通知在线的群员有新消息
        for (const i of liverGroupMember) {
            this.server.to(String(i)).emit("notice", content);
        }

    }

}
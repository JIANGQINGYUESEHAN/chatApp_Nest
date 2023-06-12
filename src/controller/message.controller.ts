import { Controller, Get, UseGuards, Param, Post, Body } from '@nestjs/common';
import { ReqUser } from "src/decorator/requser.decorator";
import { DeleteGroup } from 'src/dto/group.dto';
import { FriendIdDto, friendMsgDto } from 'src/dto/msg.dto';
import { JwtGuard } from 'src/guard/App.guard';
import { FriendGuard } from 'src/guard/friend.guard';
import { MessageService } from "src/service/message.service";


@Controller('/message')
export class MessageController {
  constructor(
    protected messageService: MessageService
  ) { }

  @UseGuards(JwtGuard)
  @Get("/list")
  getAll(@ReqUser() userId) {

    return this.messageService.getRecentMessageList(userId);
  }

  // 查询我发给好友的/好友发给我的 消息
  @UseGuards(JwtGuard)
  @UseGuards(FriendGuard)
  @Get("/friendMsg/:id")
  getFriendMsg(@ReqUser() userId, @Param() friendId: FriendIdDto ) {

    return this.messageService.getFriendMessage(userId, friendId.id);
  }

  //朋友间发送信息
  @UseGuards(JwtGuard)
  @UseGuards(FriendGuard)
  @Post("/friendMsg/:id")
  sendFriendMessage(@ReqUser() userId,@Param() friendId: FriendIdDto,@Body()friendMsg:friendMsgDto){
  console.log(userId);
  console.log(friendId);
  console.log(friendMsg);
  
  
  

  }
  


}
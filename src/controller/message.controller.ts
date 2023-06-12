import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { ReqUser } from "src/decorator/requser.decorator";
import { DeleteGroup } from 'src/dto/group.dto';
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
  getFriendMsg(@ReqUser() userId, @Param() friendId: DeleteGroup) {

    return this.messageService.getFriendMessage(userId, friendId.id);
  }


}
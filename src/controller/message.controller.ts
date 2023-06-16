import {
  Controller,
  Get,
  UseGuards,
  Param,
  Post,
  Body,
  SetMetadata,
  Query
} from '@nestjs/common';
import { CUSTOM_STRING_METADATA_KEY } from 'src/config/decorator.config';
import { ReqUser } from 'src/decorator/requser.decorator';
import { DeleteGroup } from 'src/dto/group.dto';
import { FriendIdDto, MsgDto } from 'src/dto/msg.dto';
import { JwtGuard } from 'src/guard/App.guard';

import { GrouperGuard } from 'src/guard/custom.guard';
import { FriendGuard } from 'src/guard/friend.guard';
import { MessageService } from 'src/service/message.service';

@Controller('/message')
export class MessageController {
  constructor(protected messageService: MessageService) {}

  @UseGuards(JwtGuard)
  @Get('/list')
  getAll(@ReqUser() userId) {
    return this.messageService.getRecentMessageList(userId);
  }

  // 查询我发给好友的/好友发给我的 消息
  @UseGuards(JwtGuard)
  @UseGuards(FriendGuard)
  @Get('/friendMsg/:id')
  getFriendMsg(@ReqUser() userId, @Param() friendId: FriendIdDto) {
    return this.messageService.getFriendMessage(userId, friendId.id);
  }

  //朋友间发送信息
  @UseGuards(JwtGuard)
  @UseGuards(FriendGuard)
  @Post('/friendMsg/:id')
  sendFriendMessage(
    @ReqUser() userId,
    @Param() friendId: FriendIdDto,
    @Body() friendMsg: MsgDto
  ) {
    return this.messageService.sendFriendMessage(userId, friendId.id, {
      ...friendMsg
    });
  }

  //查看群消息
  @UseGuards(JwtGuard)
  @SetMetadata(CUSTOM_STRING_METADATA_KEY, 'userId')
  @UseGuards(GrouperGuard)
  @Get('/group/:id')
  async getGroupMessage(@Param() groupId: DeleteGroup) {
    return this.messageService.getGroupMessage(groupId.id);
  }

  //发送群消息
  @UseGuards(JwtGuard)
  @SetMetadata(CUSTOM_STRING_METADATA_KEY, 'userId')
  @UseGuards(GrouperGuard)
  @Post('/group/:id')
  async sendGroupMsg(
    @ReqUser() userId,
    @Param() groupId: DeleteGroup,
    @Body() groupMsg: MsgDto
  ) {
    return this.messageService.sendGroupMessage(userId, groupId.id, {
      ...groupMsg
    });
  }
}

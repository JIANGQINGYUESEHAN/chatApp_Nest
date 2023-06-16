import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReqUser } from 'src/decorator/requser.decorator';
import {
  CheckFriendDto,
  DeleteFriend,
  FindFriendDto,
} from 'src/dto/friend.dto';
import { JwtGuard } from 'src/guard/App.guard';
import { FriendService } from 'src/service';

@Controller('/friend')
export class FriendController {
  constructor(protected friendService: FriendService) {}

  @UseGuards(JwtGuard)
  @Get('/add/:username')
  @HttpCode(200)
  AddFriend(@ReqUser() OwnerId, @Param() FriendId: CheckFriendDto) {
    return this.friendService.AddFriend(OwnerId, FriendId.username);
  }
  @UseGuards(JwtGuard)
  @Get('/all')
  @HttpCode(200)
  GetFriends(@ReqUser() OwnerId) {
    return this.friendService.GetFriends(OwnerId);
  }
  //获取朋友详细信息
  @UseGuards(JwtGuard)
  @Post('/getFriend')
  @HttpCode(200)
  getFriend(@Body() findFriendDto: FindFriendDto) {
    return this.friendService.getFriendMessage(findFriendDto);
  }
  //删除好友
  @UseGuards(JwtGuard)
  @Get('/deleteFriend/:id')
  deleteFriend(@ReqUser() OwnerId, @Param() deleteFriend: DeleteFriend) {
    return this.friendService.DeleteFriend(OwnerId, deleteFriend.id);
  }
}

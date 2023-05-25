import { Controller, Get, HttpCode, Param, Query, UseGuards } from "@nestjs/common";
import { ReqUser } from "src/decorator/requser.decorator";
import { CheckFriendDto } from "src/dto/friend.dto";
import { JwtGuard } from "src/guard/App.guard";
import { FriendService } from "src/service";


@Controller('/friend')
export class FriendController {
    constructor(
        protected friendService: FriendService
    ) { }
  
    @UseGuards(JwtGuard)
    @Get('/add/:username')
    @HttpCode(200)
    AddFriend(@ReqUser() OwnerId, @Param() FriendId: CheckFriendDto) {
        return this.friendService.AddFriend(OwnerId, FriendId.username)
    }
    @UseGuards(JwtGuard)
    @Get('/all')
    @HttpCode(200)
    GetFriends(@ReqUser() OwnerId){

    }
}
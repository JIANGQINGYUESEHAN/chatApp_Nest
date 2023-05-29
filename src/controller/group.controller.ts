import { Body, Controller, HttpCode, Post, UseGuards } from "@nestjs/common";
import { GroupService } from '../service/group.service';
import { JwtGuard } from "src/guard/App.guard";
import { CreateGroupDto } from "src/dto/group.dto";
import { ReqUser } from "src/decorator/requser.decorator";

@Controller('/group')
export class GroupController{
    constructor(
        protected groupService:GroupService
    ){}
    //创建群
    @UseGuards(JwtGuard)
    @Post('/create')
    @HttpCode(200)
    createGroup(@Body() createGroupDto:CreateGroupDto,@ReqUser()userId ){
        console.log(createGroupDto);
        console.log(userId);
        this.groupService.CreateGroupe(createGroupDto,userId)
        
        
    }
}
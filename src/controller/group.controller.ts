import { Body, Controller, Get, HttpCode, Param, Post, SetMetadata, UseGuards } from "@nestjs/common";
import { GroupService } from '../service/group.service';
import { JwtGuard } from "src/guard/App.guard";
import { CreateGroupDto, DeleteGroup,  UpdateGroupDto } from "src/dto/group.dto";
import { ReqUser } from "src/decorator/requser.decorator";
import { GrouperGuard} from "src/guard/custom.guard";
import { CUSTOM_STRING_METADATA_KEY } from "src/config/decorator.config";


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
     return   this.groupService.CreateGroupe(createGroupDto,userId)
        
    }
    //删除群
    //判断是否登录了
    @UseGuards(JwtGuard)
    //判断是否是群主
    @UseGuards(GrouperGuard)
    @Get('/delete/:id')
    @HttpCode(200)
    deleteGroup(@Param()Id:DeleteGroup){
       this.groupService.DeleteGroup(Id.id)
        
    }


    @UseGuards(JwtGuard)
    @SetMetadata(CUSTOM_STRING_METADATA_KEY, 'groupManagerId')
    //判断是否是群主
    @UseGuards(GrouperGuard)
    @Post('/update/:id')
    @HttpCode(200)
    updateGroup(@Body()updateMessage:UpdateGroupDto,@Param() Id:DeleteGroup ){
        // console.log(updateMessage);
        // console.log(Id);
       return this.groupService.UpdateGroup(updateMessage,Id.id)
        

    }
    //用户加群
    @UseGuards(JwtGuard)   
    @Get('/add/:id')
    @HttpCode(200)
    AddGroup(@Param() Id:DeleteGroup ,@ReqUser() userId ){
      return  this.groupService.AddGroup(userId,Id.id)
        
        
    }


    //获取群内所有人的基础信息
    @UseGuards(JwtGuard)  

    //判断是否在群里
    @SetMetadata(CUSTOM_STRING_METADATA_KEY, 'userId')
    //判断是否是群主
    @UseGuards(GrouperGuard)
    
    @Get('/get/:id')
    @HttpCode(200)
    getGroupInform( @ReqUser() userId , @Param() Id:DeleteGroup ){
        console.log(userId);
        console.log(Id);
        
    }





}
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { MessageType } from "src/config/util.config";
import IsDefaultEnum from "src/constraint/enum.constraint";
import { DataExist } from "src/constraint/exist.constraint";
import { DtoDecorator } from "src/decorator/dto.decorator";
import { UserEntity } from "src/entity/user.entity";


@DtoDecorator({type:'param'})
export class FriendIdDto{
    @DataExist({entity:UserEntity})
    id:string
}
@DtoDecorator({type:'body'})
export class MsgDto{
    @IsString()
    @IsNotEmpty()
    content:string
    @IsDefaultEnum(MessageType)
    type:MessageType
}
export class FriendMessageDto {
    @IsString()
    senderId: string;
    @IsString()
    receiverId: string;
    @IsString()
    content: any;
    type: MessageType;
  }
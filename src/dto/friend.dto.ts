import { IsNotEmpty } from "class-validator";
import { DataExist } from "src/constraint/exist.constraint";
import { IsUnique } from "src/constraint/unique.constraint";
import { DtoDecorator } from "src/decorator/dto.decorator";
import { UserEntity } from "src/entity/user.entity";

@DtoDecorator({type:'param'})
export class CheckFriendDto{
    @DataExist({entity:UserEntity})
    @IsNotEmpty()
    username:string
}
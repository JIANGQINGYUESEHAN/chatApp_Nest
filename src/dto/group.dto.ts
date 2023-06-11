import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { DataExist } from "src/constraint/exist.constraint";
import { IsUnique } from "src/constraint/unique.constraint";
import { DtoDecorator } from "src/decorator/dto.decorator";
import { GroupEntity } from "src/entity/group.entity";

@DtoDecorator({type:'body'})
export class CreateGroupDto{
    @IsUnique({entity:GroupEntity})
    @IsString()
    @IsNotEmpty()
    groupName:string
    @IsString()
    @IsOptional()
    intro?:string
}
@DtoDecorator({type:'param'})
export class DeleteGroup{
    @DataExist({entity:GroupEntity})
    id:string
}

//修改群名称 头像
@DtoDecorator({type:'body'})
export class UpdateGroupDto{
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    avatarSrc?: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    groupName?: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    intro?: string;
}
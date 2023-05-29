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
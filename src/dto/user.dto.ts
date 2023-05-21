import { IsNotEmpty, IsNumber, IsString, Length } from "class-validator"
import { IsRegular } from "src/constraint/regular.condtraint"
import { IsUnique } from "src/constraint/unique.constraint"
import { DtoDecorator } from "src/decorator/dto.decorator"
import { UserEntity } from "src/entity/user.entity"

@DtoDecorator({type:'body'})
export  class RegisterUserDto{
    @IsString()
    @IsNotEmpty()
   // @Length(8,2,{message:"用户名长度不符合要求"})
   // @IsUnique({entity:UserEntity})
    username:string
    @IsString()
    @IsNotEmpty()
    @IsUnique({entity:UserEntity})
    @IsRegular(/^1[3-9]\d{9}$/)
    phone:string
    @IsString()
    @IsNotEmpty()
    //判断是否符合条件
    @IsRegular(/^[a-zA-Z0-9]{8}$/)
    @IsString()
    @Length(8, 8, { message: '密码长度不符合要求' })
    password:string
    
}
// /^1[3-9]\d{9}$/

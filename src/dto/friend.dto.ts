import { IsNotEmpty, IsString } from 'class-validator';
import { DataExist } from 'src/constraint/exist.constraint';
import { IsUnique } from 'src/constraint/unique.constraint';
import { DtoDecorator } from 'src/decorator/dto.decorator';
import { UserEntity } from 'src/entity/user.entity';

@DtoDecorator({ type: 'param' })
export class CheckFriendDto {
  @DataExist({ entity: UserEntity })
  @IsNotEmpty()
  username: string;
}
@DtoDecorator({ type: 'body' })
export class FindFriendDto {
  @DataExist({ entity: UserEntity })
  @IsString()
  username: string;
}
//删除好友
@DtoDecorator({ type: 'param' })
export class DeleteFriend {
  @DataExist({ entity: UserEntity })
  @IsString()
  id: string;
}

import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { MessageType } from 'src/config/util.config';
import { DataExistConstraintById } from 'src/constraint/data.exist.constraint';
import IsDefaultEnum from 'src/constraint/enum.constraint';
import { DataExist } from 'src/constraint/exist.constraint';
import { DtoDecorator } from 'src/decorator/dto.decorator';
import { UserEntity } from 'src/entity/user.entity';

@DtoDecorator({ type: 'param' })
export class FriendIdDto {
  @DataExist({ entity: UserEntity })
  id: string;
}
@DtoDecorator({ type: 'body' })
export class MsgDto {
  @IsString()
  @IsNotEmpty()
  content: string;
  @IsDefaultEnum(MessageType)
  type: MessageType;
}





export class FriendMessageConnectDto {
  @IsNotEmpty()
  @DataExistConstraintById({ entity: UserEntity })
  @IsString()
  senderId: string;

  @IsNotEmpty()
  @IsString()
  @DataExistConstraintById({ entity: UserEntity })
  receiverId: string;

}

export class FriendMessageDto {
  @IsNotEmpty()
  @DataExistConstraintById({ entity: UserEntity })
  @IsString()
  senderId: string;

  @IsNotEmpty()
  @IsString()
  @DataExistConstraintById({ entity: UserEntity })
  receiverId: string;

  @IsNotEmpty()
  @IsString()
  content: string

  @IsNotEmpty()
  @IsDefaultEnum(MessageType)
  type: MessageType;
}

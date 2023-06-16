import { CustomRepository } from 'src/decorator/repository.decorator';
import { FriendMessageEntity } from 'src/entity/friendmessage.entity';
import { GroupMessageEntity } from 'src/entity/groupmessage.entity';
import { Repository } from 'typeorm';

@CustomRepository(FriendMessageEntity)
export class FriendMessageRepository extends Repository<FriendMessageEntity> {}

@CustomRepository(GroupMessageEntity)
export class GroupMessageRepository extends Repository<GroupMessageEntity> {}

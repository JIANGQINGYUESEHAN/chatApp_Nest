import { CustomRepository } from 'src/decorator/repository.decorator';
import { FriendEntity } from 'src/entity/friend.entity';
import { Repository } from 'typeorm';

@CustomRepository(FriendEntity)
export class FriendRepository extends Repository<FriendEntity> {
  BaseQuery() {
    return this.createQueryBuilder('user');
  }
}

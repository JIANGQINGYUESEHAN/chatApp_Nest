import { CustomRepository } from "src/decorator/repository.decorator";
import { GroupEntity } from "src/entity/group.entity";
import { GroupRelationEntity } from "src/entity/group.relation.entity";
import { Repository } from "typeorm";


@CustomRepository(GroupEntity)
export class GroupRepository extends Repository<GroupEntity> {}
@CustomRepository(GroupRelationEntity)
export class GroupRelationRepository extends Repository<GroupRelationEntity> {}
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { GroupEntity } from "./group.entity";
import { UserEntity } from "./user.entity";

@Entity()
export class GroupRelationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => GroupEntity, groupRelation => groupRelation.group)
  @JoinColumn()
  group: GroupEntity;

  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn()
  user: UserEntity;
}

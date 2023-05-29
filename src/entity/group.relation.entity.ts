import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { GroupEntity } from "./group.entity";
import { UserEntity } from "./user.entity";

@Entity()
export class GroupRelationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => GroupEntity, group => group.id)
  @JoinColumn({ name: "groupId" })
  group: GroupEntity;

  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({ name: "userId" })
  user: UserEntity;
}

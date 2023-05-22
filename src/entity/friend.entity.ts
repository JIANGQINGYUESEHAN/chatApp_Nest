import { Entity, JoinColumn, JoinTable, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity()
export class FriendEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({ name: "userId" })
  user: UserEntity;

  @ManyToOne(() => UserEntity, user => user.id)
  @JoinColumn({ name: "friendId" })
  friend: UserEntity;
  
}
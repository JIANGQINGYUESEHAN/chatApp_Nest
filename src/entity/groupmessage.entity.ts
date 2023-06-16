import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { UserEntity } from './user.entity';
import { GroupEntity } from './group.entity';
import { MessageType } from 'src/config/util.config';

@Entity()
export class GroupMessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // 映射到user的id
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'senderId' })
  user: UserEntity;

  // 映射到group的id
  @ManyToOne(() => GroupEntity, (group) => group.id)
  group: GroupEntity;

  @Column()
  content: string;

  @Column()
  type: MessageType;

  @CreateDateColumn()
  createTime: string;
}

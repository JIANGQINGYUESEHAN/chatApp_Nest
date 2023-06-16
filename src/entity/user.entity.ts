import { DefaultAvatarImage } from 'src/config/entity.config';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { FriendEntity } from './friend.entity';
import { FriendMessageEntity } from './friendmessage.entity';
import { GroupMessageEntity } from './groupmessage.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @Expose()
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ comment: '昵称' })
  username: string;

  @Expose()
  @Column({ default: DefaultAvatarImage })
  avatarSrc: string;

  @Exclude()
  @Column({ select: true, comment: '密码' })
  password: string;

  @Expose()
  @Column({ default: '这个人很懒', comment: '个性签名' })
  intro: string;

  @Expose()
  @Column({ default: '' })
  email: string;

  @Expose()
  @Column({ comment: '手机号' })
  phone: string;

  @Expose()
  @Column({ default: null, comment: '性别' })
  gender: string;

  @Expose()
  @Column({ default: '' })
  address: string;

  @OneToMany(() => FriendEntity, (friend) => friend.user)
  friend: FriendEntity[];

  @OneToMany(() => FriendMessageEntity, (msg) => msg.sender)
  friendMessage: FriendMessageEntity[];

  @OneToMany(() => GroupMessageEntity, (msg) => msg.user)
  groupMessage: GroupMessageEntity[];

  @CreateDateColumn()
  createTime: string;
}

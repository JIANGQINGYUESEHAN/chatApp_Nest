import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { Expose } from "class-transformer";
import { DefaultAvatarImage } from "src/config/entity.config";

@Entity()
export class GroupEntity{
    @Expose()
    @PrimaryGeneratedColumn()
    id:string
    @Expose()
    @Column({ default: DefaultAvatarImage })
    avatarSrc: string;
  
    @Expose()
    @Column()
    groupName: string;

    @Expose()
    @Column()
    groupManagerId: number;

    @Expose()
    @Column({ default: "群主很懒,没写公告" })
    intro: string;
    
    @Expose()
    @CreateDateColumn()
    createTime: string;
}
import { DefaultAvatarImage } from "src/config/entity.config";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import {  Expose} from 'class-transformer'

@Entity()
export class UserEntity {
    @Expose()
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Expose()
    @Column({ default: DefaultAvatarImage })
    avatarSrc: string;

    @Expose()
    @Column({comment:"昵称",length:10})
    username: string;

    @Expose()
    @Column({ select: false ,comment:"密码"})
    password: string;

    @Expose()
    @Column({ default: "这个人很懒" ,comment:"个性签名"})
    intro: string;

    @Expose()
    @Column({ default: "" })
    email: string;

    @Expose()
    @Column({ default:null ,comment:"性别"})
    gender: string;

    @Expose()
    @Column({ default: "" })
    address: string;

    @CreateDateColumn()
    createTime: string;
}
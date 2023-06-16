import { Global, Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import {
  FriendService,
  GroupService,
  MessageService,
  TokenService,
  UserService,
} from 'src/service';
import { DatabaseModule } from 'src/module/database.moudle';
import { UserRepository } from 'src/repository/user.repository';
import { FriendRepository } from 'src/repository/friend.repository';
import {
  GroupRelationRepository,
  GroupRepository,
} from 'src/repository/group.repository';
import {
  FriendMessageRepository,
  GroupMessageRepository,
} from 'src/repository/message.repository';
import { JwtService } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    DatabaseModule.forRepository([
      UserRepository,
      FriendRepository,
      FriendRepository,
      GroupRepository,
      GroupRelationRepository,
      GroupMessageRepository,
      FriendMessageRepository,
    ]),
  ],
  providers: [
    ChatGateway,
    UserService,
    FriendService,
    MessageService,
    GroupService,
    TokenService,
    JwtService,
  ],
  exports: [
    DatabaseModule.forRepository([
      UserRepository,
      FriendRepository,
      FriendRepository,
      GroupRepository,
      GroupRelationRepository,
      GroupMessageRepository,
      FriendMessageRepository,
    ]),
  ],
})
export class ChatModule {}

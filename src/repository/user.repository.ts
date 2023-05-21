import { CustomRepository } from "src/decorator/repository.decorator";
import { UserEntity } from "src/entity/user.entity";
import { Repository } from "typeorm";

@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity>{
  BaseQuery(){
       return this.createQueryBuilder('user')
    }
}
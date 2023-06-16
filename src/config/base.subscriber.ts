import {
  ObjectLiteral,
  InsertEvent,
  UpdateEvent,
  SoftRemoveEvent,
  RecoverEvent,
  TransactionStartEvent,
  TransactionCommitEvent,
  TransactionRollbackEvent,
  EventSubscriber,
  EntitySubscriberInterface,
  ObjectType,
  DataSource,
  LoadEvent,
  EntityTarget
} from 'typeorm';
import { isNil } from 'lodash';
import { ClassType, RepositoryType } from './entity.config';
import { getRepository } from './entity.config';
type SubscribeEvent<E extends ObjectLiteral> =
  | InsertEvent<E>
  | UpdateEvent<E>
  | SoftRemoveEvent<E>
  | RecoverEvent<E>
  | TransactionStartEvent
  | TransactionCommitEvent
  | TransactionRollbackEvent;

@EventSubscriber()
export abstract class BaseSubscriber<E extends ObjectLiteral>
  implements EntitySubscriberInterface<E>
{
  protected abstract entity: ObjectType<E>;
  constructor(protected dataSource: DataSource) {
    this.dataSource.subscribers.push(this);
  }
  listenTo(): string | Function {
    return this.entity;
  }
  async afterLoad(entity: any, event?: LoadEvent<E>) {
    if ('parent' in entity && isNil(entity.depth)) entity.depth = 0;
  }

  protected getDataSource(event: SubscribeEvent<E>) {
    return event.connection;
  }
  protected getManager(event: SoftRemoveEvent<E>) {
    return event.manager;
  }
  protected getRepository<
    C extends ClassType<T>,
    T extends RepositoryType<E>,
    A extends EntityTarget<E>
  >(event: SubscribeEvent<E>, repository?: C, entity?: A) {
    return isNil(repository)
      ? this.getDataSource(event).getRepository(entity ?? this.entity)
      : getRepository<T, E>(this.getDataSource(event), repository);
  }
}

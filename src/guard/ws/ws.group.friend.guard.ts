import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class WsGroupFriedGuard implements CanActivate {
  constructor() {
  }
  canActivate(context: ExecutionContext) {
    const data = context.switchToWs().getData();
    console.log(data);

    return true
  }
}

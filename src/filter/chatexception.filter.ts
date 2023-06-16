import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { errorResp } from 'src/config/util.config';

@Catch()
export class BadRequestTransformationFilter extends BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const properException = new WsException(exception.getResponse());

    const client = host.switchToWs().getClient<Socket>();

    client.emit('mistake', errorResp(properException.getError()));

    super.catch(properException, host);
  }
}

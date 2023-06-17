
import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { ValidationError } from 'class-validator';
import { Socket } from 'socket.io';
import { errorResp } from 'src/config/util.config';

@Catch()
export class BadRequestTransformationFilter extends BaseWsExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();

    //处理数据验证
    if (exception.response && exception instanceof ValidationError) {

      client.emit('mistake', errorResp(exception));
      return;
    }
    //处理房间号不存在
    if (exception.error && exception.error.status == 201) {
      client.emit('mistake', errorResp(exception.error));
      return
    }
    //处理token过期
    if (exception.error && exception.error.status == 401) {
      client.emit('mistake', errorResp(exception.error));
      return
    }

    const properException = new WsException(exception.getResponse());
    client.emit('mistake', errorResp(properException.getError()));

    super.catch(properException, host);
  }
}

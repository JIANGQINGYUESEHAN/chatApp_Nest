import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";
interface Response<T> {
    data: T;
  }
  //先 dto 在前置拦截器 在守卫
@Injectable()
export class TransInterceptor<T> implements NestInterceptor<T, Response<T>>{
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        console.log('Before...');
        return next.handle().pipe(
            map((data) =>{
                let response=context.switchToHttp().getResponse()
                const statusCode=response.statusCode
                let res={
                    statusCode, 
                    success:true,
                    data
                }
                return res
            }),
          );
      }
}
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { validate } from "class-validator";
import { plainToClass } from 'class-transformer';

@Injectable()
export class MsgPipe implements PipeTransform<any>{
    
    async transform(value: any, metadata: ArgumentMetadata) {
        const { metatype } = metadata;
    
        if (!metatype || !this.isDtoClass(metatype)) {
          return value;
        }
    
        const object = plainToClass(metatype, value);
        const errors = await validate(object);
        console.log(errors);
        
    
        if (errors.length > 0) {
          throw new BadRequestException('Validation failed');
        }
    
        return object;
      }
    
    private isDtoClass(metatype: any): boolean {
        return metatype && metatype.prototype && metatype.prototype.constructor === Object;
      }
}
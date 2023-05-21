import { ArgumentMetadata, Injectable, Paramtype, ValidationPipe } from "@nestjs/common";
import * as merge from 'deepmerge'
import { DTO_VALIDATION_OPTIONS } from "src/config/decorator.config";
import { isObject, omit, isFunction } from "lodash";


@Injectable()
export class AppPipe extends ValidationPipe {
    async transform(value: any, metadata: ArgumentMetadata) {
        let { type, metatype } = metadata
        let dto = metatype as any
        //获取配置
        let option = Reflect.getMetadata(DTO_VALIDATION_OPTIONS, dto)
        //保存原有的验证规则
        let originTransform = { ...this.transformOptions }
        let originValidator = { ...this.validatorOptions }
 
  
        //解构获取的值
        let { transformOptions, type: optionsType, ...customOption } = option || {}
        let requestType: Paramtype = optionsType ?? 'body'
        if (requestType !== type) return value

        //合并验证规则
        if (transformOptions) {
            this.transformOptions = merge(this.transformOptions, transformOptions ?? {}, {
                arrayMerge: (_d, _s, o) => _s
            })
        }
        this.validatorOptions = merge(this.validatorOptions, customOption ?? {}, {
            arrayMerge: (_d, _s, o) => _s
        })


      
       
        const toValidation = isObject(value)
        ? Object.fromEntries(
              Object.entries(value as Record<string, any>).map(([key, v]) => {
                  if (!isObject(v) || !('mimetype' in v)) return [key, v];
                  return [key, omit(v, ['fields'])];
              }),
          )
        : value;



        let result = await super.transform(toValidation, metadata)
        if (typeof result.transform == 'function') {
            result = result.transform(result)
            let { transform, ...data } = result
            result = data
        }
        
        this.transformOptions = originTransform
        this.validatorOptions = originValidator
        
        return result

    }
}
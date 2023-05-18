import { ArgumentMetadata, Injectable, Paramtype, ValidationPipe } from "@nestjs/common";
import * as merge from 'deepmerge'
import { DTO_VALIDATION_OPTIONS } from "src/config/decorator.config";
import { isObject, omit, isFunction } from "lodash";


@Injectable()
export class AppPipe extends ValidationPipe {
    async transform(value: any, metadata: ArgumentMetadata) {
        let { type, metatype } = metadata
        let dto = metatype
        //读取配置
        let option = Reflect.getMetadata(DTO_VALIDATION_OPTIONS, dto)||{}

        //保存配置
        const originValidatorOption = { ...this.validatorOptions }
        const originTransformOption = { ...this.transformOptions }

        //读取配置
        let {transformOption,type:optionType,...customOption}=option

        //设置默认获取方式
        const requestType:Paramtype=optionType || 'body'
        //进行判断
        if(requestType!==type) return value

        if(transformOption){
            //进行合并
            this.transformOptions= merge(this.transformOptions,transformOption??{},{
                arrayMerge:(_d,_s,o)=>_s
            })
        }

        this.validatorOptions=merge(this.validatorOptions,customOption,{
            arrayMerge:(_d,_s,o)=>_s
        })

        //进行配置
        const toValidator=isObject(value)?  Object.fromEntries(Object.entries((value as Record<string,any>).map(([k,v])=>{
            if(!isObject(v)||!('mimetype' in v)){
                return [k,v]
            }else{
                return [k,omit(v,['fields'])]
            }
        }))) :value

        //进行序列化
        let result=await super.transform(toValidator,metadata)
        //判断result.transform 是否是个函数
        if(typeof result.transform=='function'){
            result=await result.transform(result)
            let {transform,...data}=result
            result=data
        }
        this.validatorOptions = originValidatorOption;
        // 重置transform选项
        this.transformOptions = originTransformOption;
        return result;

    }
}
// import { Injectable } from "@nestjs/common";
// import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface, ValidatorOptions, registerDecorator } from "class-validator";
// import { DataSource, ObjectType } from "typeorm";
// import * as  merge from 'deepmerge';
// import { ReqUser } from "src/decorator/requser.decorator";
// import { getRepository } from '../config/entity.config';
// type Condition = {
//         /* 实体 */
//         entity: ObjectType<any>;
        
//         /* 如果没有指定字段则使用当前验证的属性作为查询依据 */
//         property?: string;
//     };
// @Injectable()
// @ValidatorConstraint({ name: "passwordEqual", async: true })
// export class passwordEqualConstraints implements ValidatorConstraintInterface {
//     protected  id:string
//     constructor(
//         protected dataSource: DataSource,
      
//     ) { }
//   async  validate(value: any,args?: ValidationArguments) {
    
//         let config: Omit<Condition, "entity"> = {
//             property: args.constraints[0]
//         }
//         let condition = ("entity" in args.constraints[0] ? merge(config, args.constraints[0]) : { ...config, entity: args.constraints[0] }) as Required<Condition>
//         if (!condition.entity) return false
        
      
//         // try {
//         //     let qb = await this.dataSource.getRepository(condition.entity).createQueryBuilder().where({ id: userId }).getOne()
//         //     if (!qb) return false
//         //     return value === qb.password ? false : true
//         // } catch (error) {
//         //     return false
//         // }


//     }

//     // protected getUserId(@ReqUser() userId) {
//     //     console.log(userId);
        
//     //     return userId
//     // }

//     defaultMessage(args?: ValidationArguments) {
//         const { entity, property, id } = args.constraints[0]


//         const queryProperty = property ?? args.property

//         if ((args.object as any).getManager) {
//             return 'getManager function not been found!';
//         }
//         if (!id) {
//             return ` id不存在`
//         }
//         if (!entity) {
//             return 'Model not been specified!';
//         }
//         return `密码错误`;
//     }

// }

// export function IsPasswordTrue(option: Condition, args?: ValidatorOptions) {
//     return (obj: Record<string, any>, propertyName: string) => {
//         registerDecorator({
//             target: obj.constructor,
//             constraints: [option],
//             propertyName: propertyName,
//             options: args,
//             validator: passwordEqualConstraints,
//         });
//     }
// }

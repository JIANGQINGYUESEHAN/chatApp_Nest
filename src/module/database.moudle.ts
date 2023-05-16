import { DynamicModule, Injectable, Provider, Type } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions, getDataSourceToken } from "@nestjs/typeorm";
import { CUSTOM_REPOSITORY_METADATA } from "src/config/decorator.config";
import { DataSource } from "typeorm";

@Injectable()
export class DataBaseModule {
  static forRoot(TypeOrmConfig:TypeOrmModuleOptions):DynamicModule{
    return {
        global:true,
        module:DataBaseModule,
        imports:[TypeOrmModule.forRoot(TypeOrmConfig)],
        providers:[]
    }

  }
  static forRepository<T extends Type<any>>( repositories:T[], dataSourceName?:string):DynamicModule{
        let  providers:Provider[]=[]
        for(let Repo of  repositories){
            let entity=Reflect.getMetadata( CUSTOM_REPOSITORY_METADATA,Repo )
            if(!entity)continue;
            providers.push({
                inject:[getDataSourceToken(dataSourceName)],
                provide:Repo,
                useFactory:(dataSource:DataSource)=>{
                    let base=dataSource.getRepository(entity)
                    return new Repo(base.target,base.manager,base.queryRunner)
                }
            })

        }
        return{
            module:DataBaseModule,
            providers,
            exports:providers
        }
  }
}
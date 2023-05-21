import * as bcrypt from 'bcrypt'
//密码加密
export function encryption(password:string){
    return bcrypt.hashSync(password,10)
}
//密码解密
export function decrypt(password:string,comparePassword:string){
    return bcrypt.compareSync(password,comparePassword)
}
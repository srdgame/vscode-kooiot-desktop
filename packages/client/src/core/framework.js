/*
 * web框架组
 *
 * */
// 加载网站配置文件夹
import { register } from './global'

export default {
  install: (app) => {
    register(app)
    console.log(`
       欢迎使用 KooIoT-Desktop
       当前版本:v2.5.5
       加群方式:微信：dirkchang QQ群：291292378
    `)
  }
}

import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/loading/style/css'
import 'element-plus/es/components/notification/style/css'
import 'element-plus/es/components/message-box/style/css'
import './style/element_visiable.scss'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { createApp } from 'vue'
// 引入前端初始化相关内容
import './core/framework'
// 引入封装的router
import router from '@/router/index'
import '@/permission'
import run from '@/core/framework.js'
import auth from '@/directive/auth'
import { store } from '@/pinia'
import App from './App.vue'
import i18n from './i18n' // added by mohamed hassan to multilangauge

import { initDom } from './utils/positionToCode'

initDom()
/**
 * @description 导入加载进度条，防止首屏加载时间过长，用户等待
 *
 * */

import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

Nprogress.configure({ showSpinner: false, ease: 'ease', speed: 500 })
Nprogress.start()

/**
 * 无需在这块结束，会在路由中间件中结束此块内容
 * */

const app = createApp(App)
app.config.productionTip = false

library.add(fas)
library.add(far)
library.add(fab)

app
  .component('FontAwesomeIcon', FontAwesomeIcon)
  .component('FontAwesomeLayers', FontAwesomeLayers)
  .component('FontAwesomeLayersText', FontAwesomeLayersText)
  .use(run)
  .use(store)
  .use(auth)
  .use(router)
  .use(i18n)
  .mount('#app')

export default app

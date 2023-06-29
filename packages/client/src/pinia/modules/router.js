import { asyncRouterHandle } from '@/utils/asyncRouter'
import { emitter } from '@/utils/bus.js'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const notLayoutRouterArr = []
const keepAliveRoutersArr = []
const nameMap = {}

const userMenus = [
  {
    'path': 'http://iot.kooiot.cn',
    'name': 'http://iot.kooiot.cn',
    'hidden': false,
    'component': '/',
    'meta': {
      'keepAlive': false,
      'defaultMenu': false,
      'title': '云平台',
      'title_i18n': 'system.menu.website',
      'icon': 'home-filled',
      'closeTab': false
    },
  },
  {
    'path': 'iot_dashboard',
    'name': 'iot.dashboard',
    'hidden': false,
    'component': 'view/iot/dashboard/index.vue',
    'meta': {
      'activeName': '',
      'keepAlive': false,
      'defaultMenu': false,
      'title': '看板',
      'title_i18n': 'iot.menu.dashboard',
      'icon': 'odometer',
      'closeTab': false
    },
  },
  {
    'path': 'device',
    'name': 'iot.device',
    'hidden': false,
    'component': 'view/iot/device/device.vue',
    'meta': {
      'activeName': '',
      'keepAlive': true,
      'defaultMenu': false,
      'title': '网关列表',
      'title_i18n': 'iot.menu.gatewayList',
      'icon': 'platform',
      'closeTab': false
    },
  },
  {
    'path': 'device/:sn',
    'name': 'iot.device.detail',
    'hidden': true,
    'component': 'view/iot/device/detail/detail.vue',
    'meta': {
      'activeName': 'iot.device',
      'keepAlive': false,
      'defaultMenu': false,
      'title': '网关详情-${sn}',
      'title_i18n': 'iot.menu.gatewayDetail',
      'icon': 'platform',
      'closeTab': false
    },
  },
  {
    'path': 'store',
    'name': 'store.store',
    'hidden': false,
    'component': 'view/store/store/store.vue',
    'meta': {
      'activeName': '',
      'keepAlive': true,
      'defaultMenu': false,
      'title': '应用中心',
      'title_i18n': 'store.menu.appStore',
      'icon': 'goods-filled',
      'closeTab': false
    }
  },
  {
    'path': 'cached',
    'name': 'store.cached',
    'hidden': false,
    'component': 'view/store/cached/cached.vue',
    'meta': {
      'activeName': '',
      'keepAlive': true,
      'defaultMenu': false,
      'title': '本地缓存',
      'title_i18n': 'store.menu.cachedStore',
      'icon': 'folder-checked',
      'closeTab': false
    }
  },
  {
    'path': 'local',
    'name': 'store.local',
    'hidden': false,
    'component': 'view/store/local/local.vue',
    'meta': {
      'activeName': '',
      'keepAlive': true,
      'defaultMenu': false,
      'title': '本地应用',
      'title_i18n': 'store.menu.localStore',
      'icon': 'folder',
      'closeTab': false
    }
  },
  {
    'path': 'user_app/:app',
    'name': 'store.user_app',
    'hidden': true,
    'component': 'view/store/user_app/user_app.vue',
    'meta': {
      'activeName': 'store',
      'keepAlive': false,
      'defaultMenu': false,
      'title': '应用详情 - ${app}',
      'title_i18n': 'store.menu.appDetail',
      'icon': 'platform',
      'closeTab': false
    },
  },
  {
    'path': 'store',
    'name': 'store',
    'hidden': true,
    'component': 'view/store/index.vue',
    'meta': {
      'activeName': '',
      'keepAlive': true,
      'defaultMenu': false,
      'title': '应用中心',
      'title_i18n': 'store.menu.appStore',
      'icon': 'goods-filled',
      'closeTab': false
    },
    'children': [
      // Already move to top menu
    ]
  },
]

const formatRouter = (routes, routeMap) => {
  routes && routes.forEach(item => {
    item.meta.btns = item.btns
    item.meta.hidden = item.hidden
    if (item.meta.defaultMenu === true) {
      notLayoutRouterArr.push({
        ...item,
        path: `/${item.path}`,
      })
    } else {
      routeMap[item.name] = item
      if (item.children && item.children.length > 0) {
        formatRouter(item.children, routeMap)
      }
    }
  })
}

const KeepAliveFilter = (routes) => {
  routes && routes.forEach(item => {
    // 子菜单中有 keep-alive 的，父菜单也必须 keep-alive，否则无效。这里将子菜单中有 keep-alive 的父菜单也加入。
    if ((item.children && item.children.some(ch => ch.meta.keepAlive) || item.meta.keepAlive)) {
      item.component && item.component().then(val => {
        keepAliveRoutersArr.push(val.default.name)
        nameMap[item.name] = val.default.name
      })
    }
    if (item.children && item.children.length > 0) {
      KeepAliveFilter(item.children)
    }
  })
}

export const useRouterStore = defineStore('router', () => {
  const keepAliveRouters = ref([])
  const asyncRouterFlag = ref(0)
  const setKeepAliveRouters = (history) => {
    const keepArrTemp = []
    history.forEach(item => {
      if (nameMap[item.name]) {
        keepArrTemp.push(nameMap[item.name])
      }
    })
    keepAliveRouters.value = Array.from(new Set(keepArrTemp))
  }
  emitter.on('setKeepAlive', setKeepAliveRouters)

  const asyncRouters = ref([])
  const routeMap = ({})
  // 从后台获取动态路由
  const SetAsyncRouter = async() => {
    asyncRouterFlag.value++
    const baseRouter = [{
      path: '/layout',
      name: 'layout',
      component: 'view/layout/index.vue',
      meta: {
        title: '底层layout'
      },
      children: []
    }]
    const asyncRouter = userMenus
    asyncRouter && asyncRouter.push({
      path: 'reload',
      name: 'Reload',
      hidden: true,
      meta: {
        title: '',
        closeTab: true,
      },
      component: 'view/error/reload.vue'
    })
    formatRouter(asyncRouter, routeMap)
    baseRouter[0].children = asyncRouter
    if (notLayoutRouterArr.length !== 0) {
      baseRouter.push(...notLayoutRouterArr)
    }
    asyncRouterHandle(baseRouter)
    KeepAliveFilter(asyncRouter)
    asyncRouters.value = baseRouter
    return true
  }

  return {
    asyncRouters,
    keepAliveRouters,
    asyncRouterFlag,
    SetAsyncRouter,
    routeMap
  }
})


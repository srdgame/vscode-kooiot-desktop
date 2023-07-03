<template>
  <div>
    <el-tabs v-model="tabActive" :tab-position="tabPosition" @tab-remove="removeTab">
      <el-tab-pane lazy name="overview">
        <template #label>
          <span><el-icon><odometer /></el-icon> {{ t('iot.gatewayOverview') }} </span>
        </template>
        <div>
          <Overview :product="productInfo" :device="deviceInfo" :status="deviceStatus" @switch-tab="switchTab" @install-app="onInstallApp(true)" />
        </div>
      </el-tab-pane>
      <el-tab-pane lazy name="deviceList">
        <template #label>
          <span><el-icon><data-line /></el-icon> {{ t('iot.deviceList') }} </span>
        </template>
        <div>
          <DeviceList :product="productInfo" :device="deviceInfo" :status="deviceStatus" :devices="deviceList" @open-device="openDevice" />
        </div>
      </el-tab-pane>
      <el-tab-pane lazy name="appList">
        <template #label>
          <span><el-icon><Menu /></el-icon> {{ t('iot.appManagement') }} </span>
        </template>
        <div>
          <AppList :device="deviceInfo" :status="deviceStatus" :is-show="tabActive === 'appList'" @install-app="onInstallApp(true)" />
        </div>
      </el-tab-pane>
      <el-tab-pane v-if="showInstallApp" lazy name="installApp" closable>
        <template #label>
          <span><el-icon><menu /></el-icon> {{ t('iot.installNewApp') }} </span>
        </template>
        <div>
          <InstallApp :product="productInfo" :device="deviceInfo" :status="deviceStatus" @on-close="onInstallApp(false)" />
        </div>
      </el-tab-pane>
      <el-tab-pane lazy name="settings">
        <template #label>
          <span><el-icon><set-up /></el-icon> {{ t('iot.gatewaySettings') }} </span>
        </template>
        <div>
          <Settings :product="productInfo" :device="deviceInfo" :status="deviceStatus" />
        </div>
      </el-tab-pane>
      <el-tab-pane lazy name="deviceDebug">
        <template #label>
          <span><el-icon><View /></el-icon> {{ t('iot.gatewayDebug') }} </span>
        </template>
        <div>
          <DeviceDebug :product="productInfo" :device="deviceInfo" :status="deviceStatus" :mqtt="store_device" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'IOTDeviceDetail'
}
</script>

<script setup>
import {
  fire_snapshot
} from '@/api/local/device/data'
import { get_device } from '@/api/local/device'
import Overview from './component/overview/index.vue'
import DeviceList from './component/deviceList/index.vue'
import AppList from './component/appList/index.vue'
import Settings from './component/settings/index.vue'
import DeviceDebug from './component/deviceDebug/index.vue'
import InstallApp from './component/installApp/index.vue'
import { nextTick, computed, ref, onBeforeUnmount, onMounted, watch } from 'vue'
// import { useRouter, useRoute } from 'vue-router'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { ElMessage } from 'element-plus'
// import { useUserStore } from '@/pinia/modules/user'
import { useDeviceStore } from '@/pinia/modules/device'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const route = useRoute()
// const router = useRouter()
// const userStore = useUserStore()
const deviceStore = useDeviceStore()

const tabPosition = ref('top')
const tabActive = ref('overview')
const showInstallApp = ref(false)
const sn = ref(route.params.sn) // 网关名称
const deviceInfo = ref({})
const productInfo = ref({})
const checkTimer = ref(null)

const route_name = ref('iot.device.detail')
const store_device = ref(null)
const openDeviceList = ref([])

const deviceList = computed(() => {
  return store_device.value ? store_device.value.data.devices : []
})

const deviceStatus = computed(() => {
  return store_device.value ? store_device.value.data.gateway : {}
})

watch(tabActive, (val) => {
  deviceStore.SaveActiveTab(sn.value, tabActive.value)
})

const loadDeviceInfo = () => {
  if (sn.value) {
    getDeviceInfo()
    connectMQTT()
  }
  checkTimer.value = checkTimer.value || setInterval(() => {
    if (sn.value) {
      getDeviceInfo()
    }
    if (store_device.value !== null) {
      store_device.value.Tick()
    }
  }, 10000)
}

const disconnectMQTT = () => {
  // deviceList.value = []
  // for (var key in deviceStatus.value) {
  //   if (Object.prototype.hasOwnProperty.call(deviceStatus.value, key)) {
  //     deviceStatus.value[key] = null
  //   }
  // }
}

const connectMQTT = async() => {
  disconnectMQTT()
  // Get device
  store_device.value = await deviceStore.GetDevice(sn.value)

  const loadList = deviceStore.LoadDeviceList(sn.value)
  openDeviceList.value = loadList
}

onBeforeRouteUpdate(async(to, form) => {
  if (to.name === route_name.value) {
    if (sn.value !== to.params.sn) {
      sn.value = to.params.sn
      tabActive.value = deviceStore.LoadActiveTab(sn.value, 'overview')
      loadDeviceInfo()
      await refreshData()
    }
  }
})

onBeforeUnmount(() => {
  disconnectMQTT()
  if (checkTimer.value) {
    clearTimeout(checkTimer.value)
    checkTimer.value = null
  }
})

const getDeviceInfo = async() => {
  const res = await get_device({ sn: sn.value })
  if (res.code === 0) {
    if (res.data?.device) {
      deviceInfo.value = res.data.device
    } else {
      deviceInfo.value = {}
      ElMessage({
        type: 'error',
        message: t('iot.getGatewayInfoFailed')
      })
    }
  }
}

// const toTarget = (name) => {
//   router.push({ name })
// }

const switchTab = (name) => {
  tabActive.value = name
}

const removeTab = (name) => {
  if (name === 'installApp') {
    showInstallApp.value = false
    if (name === tabActive.value) {
      nextTick(_ => {
        tabActive.value = 'appList'
      })
    }
  } else {
    const index = openDeviceList.value.indexOf(name)
    if (index !== -1) {
      openDeviceList.value.splice(index, 1)
      deviceStore.SaveDeviceList(sn.value, openDeviceList.value)
      if (tabActive.value === name) {
        if (openDeviceList.value.length === 0) {
          tabActive.value = 'deviceList'
        } else {
          if (index === 0) {
            tabActive.value = openDeviceList.value[0]
          } else {
            tabActive.value = openDeviceList.value[index - 1]
          }
        }
      }
    }
  }
}

const onInstallApp = (show) => {
  console.log(show)
  showInstallApp.value = show
  nextTick(_ => {
    if (show) {
      tabActive.value = 'installApp'
    } else {
      if (tabActive.value === 'installApp') {
        tabActive.value = 'appList'
      }
    }
  })
}

const openDevice = (sn) => {
  const findex = openDeviceList.value.indexOf(sn)
  if (findex === -1) {
    openDeviceList.value.push(sn)
    deviceStore.SaveDeviceList(sn.value, openDeviceList.value)
  }
  tabActive.value = sn
}

const refreshData = async() => {
  const res = await fire_snapshot({
    device: sn.value
  })
}

onMounted(async() => {
  deviceStore.Connect()
  tabActive.value = deviceStore.LoadActiveTab(sn.value, 'overview')
  if (tabActive.value === 'installApp') {
    tabActive.value = 'overview'
  }
  loadDeviceInfo()
  await refreshData()
})

</script>


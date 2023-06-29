<template>
  <div>
    <el-tabs v-model="tabActive" :tab-position="tabPosition">
      <el-tab-pane lazy name="overview">
        <template #label>
          <span><el-icon><Odometer /></el-icon> {{ t('iot.store.storeOverview') }} </span>
        </template>
        <div>
          <Overview @switch-tab="switchTab" />
        </div>
      </el-tab-pane>
      <el-tab-pane lazy name="appList">
        <template #label>
          <span><el-icon><Search /></el-icon> {{ t('iot.store.findApp') }} </span>
        </template>
        <div>
          <AppList :show-new="false" @on-create="onCreateApp()" />
        </div>
      </el-tab-pane>
      <el-tab-pane lazy name="extList">
        <template #label>
          <span><el-icon><Cpu /></el-icon> {{ t('iot.store.coreExt') }} </span>
        </template>
        <div>
          <ExtList />
        </div>
      </el-tab-pane>
      <el-tab-pane lazy name="watchList">
        <template #label>
          <span><el-icon><Star /></el-icon> {{ t('iot.store.watchAppList') }} </span>
        </template>
        <div>
          <WatchList />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'StoreManufacturer',
}
</script>

<script setup>

import Overview from './component/overview/index.vue'
import AppList from './component/appList/index.vue'
import ExtList from './component/extList/index.vue'
import WatchList from './component/watchList/index.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()

const tabPosition = ref('top')
const tabActive = ref('overview')

// const toTarget = function(name) {
//   router.push({ name })
// }

const switchTab = function(name) {
  if (name === 'developer') {
    router.push({ name: 'store.developer' })
  } else {
    tabActive.value = name
  }
}
const onCreateApp = function() {
  // Nothing here
}
</script>


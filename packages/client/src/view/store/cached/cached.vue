<template>
  <div>
    <el-tabs v-model="tabActive" :tab-position="tabPosition">
      <el-tab-pane lazy name="appList">
        <template #label>
          <span><el-icon><Search /></el-icon> {{ t('iot.store.findApp') }} </span>
        </template>
        <div>
          <AppList :show-new="false" @on-create="onCreateApp()" />
        </div>
      </el-tab-pane>
      <el-tab-pane lazy name="tplList">
        <template #label>
          <span><el-icon><Files /></el-icon> {{ t('iot.store.templateList') }} </span>
        </template>
        <div>
          <TemplateList />
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
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'StoreCached',
}
</script>

<script setup>

import AppList from './cachedApps.vue'
import ExtList from './cachedExts.vue'
import TemplateList from './cachedTemplates.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const tabPosition = ref('top')
const tabActive = ref('appList')

// const toTarget = function(name) {
//   router.push({ name })
// }

const onCreateApp = function() {
  // Nothing here
}
</script>


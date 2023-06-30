<template>
  <el-tabs v-model="tabActiveUI" tab-position="top">
    <el-tab-pane v-if="conf_enable" :label="t('iot.configPannel')" name="ui">
      <ConfigUI v-model="jsonData" :schema="jsonSchema" :app="appInfo" :device="device" />
    </el-tab-pane>
    <el-tab-pane :label="t('iot.configData')" name="edit">
      <vue3-json-editor
        v-model="jsonDataEdit"
        class="vue-json-editor-class"
        mode="code"
        :expanded-on-start="true"
        style="height:100%"
        @json-change="onJsonChange"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: 'IOTDeviceDetailAppList',
}
</script>

<script setup>
import {
  get_app
} from '@/api/cached/user_app'
import {
  config_app
} from '@/api/local/device/app'

import {
  deepClone
} from '@/utils/clone'

import ConfigUI from '@/components/configUI/index.vue'
import { Vue3JsonEditor } from 'vue3-json-editor'
import { useActionsStore } from '@/pinia/modules/actions'
import { ElMessage } from 'element-plus'
import { nextTick, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const actionStore = useActionsStore()

const props = defineProps({
  device: {
    required: true,
    type: Object
  },
  status: {
    default: () => {},
    required: true,
    type: Object
  },
  instInfo: {
    required: true,
    type: Object
  }
})

const appInfo = ref({})
const tabActiveUI = ref('ui')
const conf_enable = ref(false)
const jsonSchema = ref([])
const jsonData = ref({})
const jsonDataEdit = ref({})
const internalChange = ref(false)
const internalChangeEdit = ref(false)

watch(jsonData, (newValue) => {
  if (internalChangeEdit.value) {
    return
  }
  // console.log('JSON0', newValue)
  internalChange.value = true
  jsonDataEdit.value = JSON.parse(JSON.stringify(newValue))
  nextTick(function() {
    internalChange.value = false
  })
}, { immediate: true, deep: true })

const loadAppConfig = () => {
  // console.log(props.instInfo.conf)
  props.instInfo && props.instInfo.app ? loadApp(props.instInfo.app.ID) : tabActiveUI.value = 'edit'
  props.instInfo ? jsonData.value = deepClone(props.instInfo.conf) : null
  // console.log(jsonData.value)
}

const loadApp = async(app_id) => {
  const res = await get_app({ ID: app_id })
  if (res.code === 0) {
    if (res.data?.app) {
      appInfo.value = res.data.app
      conf_enable.value = appInfo.value.config?.enable
      if (conf_enable.value) {
        tabActiveUI.value = 'ui'
        jsonSchema.value = JSON.parse(appInfo.value.config.template)
        // jsonData.value = {}
        // console.log('loadApp', jsonSchema.value)
      } else {
        tabActiveUI.value = 'edit'
      }
    } else {
      tabActiveUI.value = 'edit'
      ElMessage({
        type: 'error',
        message: t('iot.fetchAppInfoFailed')
      })
    }
  } else {
    tabActiveUI.value = 'edit'
  }
}

const saveConfig = async() => {
  const data = {
    device: props.device.sn,
    inst: props.instInfo.inst,
    conf: jsonData.value
  }
  const res = await config_app(data)
  if (res.code === 0) {
    if (res.data?.id) {
      actionStore.PushAction({ id: res.data.id, name: t('iot.modifyAppConfig') + ` ${data.inst} - ${props.device.sn}`, data: data })
      ElMessage({
        type: 'success',
        message: t('iot.modifyAppConfigReqSuccess'),
        showClose: true
      })
    }
  }
}

const onJsonChange = (value) => {
  if (internalChange.value) {
    return
  }
  // console.log('JSON1', value)
  internalChangeEdit.value = true
  jsonDataEdit.value = value
  jsonData.value = value
  nextTick(function() {
    internalChangeEdit.value = false
  })
}

onMounted(async() => {
  loadAppConfig()
})

defineExpose({
  reload: loadAppConfig,
  save: saveConfig,
})

</script>

<style lang="scss">
.vue-json-editor-class {
  height: 60vh !important;
}
.jsoneditor-vue {
  height: 100% !important;
}
.ace_content {
  height: 100% !important;
}
.ace_editor div {
  font: inherit!important
}
</style>

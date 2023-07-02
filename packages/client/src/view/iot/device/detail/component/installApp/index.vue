<template>
  <div>
    <el-steps :active="active" simple>
      <el-step icon="edit" :title="t('iot.appInstallStepBasic')" :description="t('iot.appInstallStepBasicDesc')" />
      <el-step icon="setting" :title="t('iot.appInstallStepConfig')" :description="t('iot.appInstallStepConfigDesc')" />
      <el-step icon="circle-check" :title="t('iot.appInstallStepPreview')" :description="t('iot.appInstallStepPreview')" />
    </el-steps>
    <div class="step-content-class">
      <div v-show="tabActive==='first'">
        <div>
          <el-form
            ref="editForm"
            :inline="true"
            :model="formData"
            :rules="rules"
            label-width="120px"
          >
            <el-form-item :label="t('iot.application')" prop="name">
              <option-select
                ref="optionSelect"
                v-model="appID"
                v-model:data-list="appList"
                :label="t('iot.appID')"
                :list-api="get_app_list"
              />
              <el-button @click="openDialog">...</el-button>
            </el-form-item>
            <el-form-item :label="t('iot.appInstName')" prop="inst">
              <el-input
                v-model="formData.inst"
                :placeholder="t('iot.enterAppInstNameTip')"
              />
            </el-form-item>
            <el-form-item :label="t('iot.appVersion')" prop="version">
              <el-input
                v-model="formData.version"
                :placeholder="t('iot.appVersion')"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-show="tabActive==='config'">
        <div>
          <el-tabs v-model="tabActiveUI" tab-position="top">
            <el-tab-pane :label="t('iot.appInstallStepConfig')" name="edit">
              <Vue3JsonEditor
                v-model="jsonDataEdit"
                class="vue-json-editor-class"
                mode="code"
                :show-btns="false"
                :expanded-on-start="true"
                @json-change="onJsonChange"
              />
            </el-tab-pane>
            <el-tab-pane v-if="conf_enable" :label="t('iot.configPannel')" name="ui">
              <ConfigUI v-model="jsonData" :schema="jsonSchema" :app="appInfo" :device="device" :product="product" />
            </el-tab-pane>
            <!-- <el-tab-pane label="配置模板" name="config">
              <Vue3JsonEditor
                v-model="jsonSchema"
                class="vue-json-editor-class"
                mode="code"
                :show-btns="false"
                :expanded-on-start="true"
              />
            </el-tab-pane> -->
          </el-tabs>
        </div>
      </div>
      <div v-show="tabActive==='finish'">
        <span><el-icon><InfoFilled /></el-icon> {{ t('iot.appInstallComplete') }} </span>
      </div>
    </div>
    <el-row :gutter="20" style="margin-top: 12px;">
      <el-col :span="6" :offset="6">
        <el-button :disabled="!canPrev" type="primary" icon="arrow-left" @click="prev">{{ t('iot.stopPre') }}</el-button>
      </el-col>
      <el-col :span="6">
        <el-button v-if="canNext" type="primary" icon="arrow-right" @click="next">{{ t('iot.stepNext') }}</el-button>
        <el-button v-if="canFinish" type="success" icon="check" @click="finish">{{ t('iot.stepInstall') }}</el-button>
      </el-col>
    </el-row>

    <el-dialog v-model="dialogFormVisible" :before-close="closeDialog" :title="dialogTitle">
      <ApplicationList
        v-model="appList"
        :list-api="get_app_list"
        :data-list="appList"
        @on-select="selectApp"
      />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'IOTDeviceDetailInstallApp'
}
</script>

<script setup>
import {
  get_app,
  get_app_list
} from '@/api/cached/user_app'
import {
  install_app
} from '@/api/local/device/app'
// import { useDeviceStore } from '@/pinia/modules/device'
import { Vue3JsonEditor } from 'vue3-json-editor'
import OptionSelect from '@/components/optionSelect/index.vue'
import ConfigUI from '@/components/configUI/index.vue'
import ApplicationList from '@/components/applicationList/index.vue'
import { computed, ref, nextTick, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useActionsStore } from '@/pinia/modules/actions'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// const deviceStore = useDeviceStore()
const actionStore = useActionsStore()
const activeTabs = ['first', 'config', 'finish']

const props = defineProps({
  product: {
    required: true,
    type: Object
  },
  device: {
    required: true,
    type: Object
  },
  status: {
    default: () => {},
    required: true,
    type: Object
  }
})

const active = ref(0)
const appID = ref(null)
const appInfo = ref({})
const appList = ref([])
const tabActiveUI = ref('ui')
const conf_enable = ref(false)
const jsonSchema = ref([])
const jsonData = ref({})
const jsonDataEdit = ref({}) // Vue3JsonEditor's model watch do not set the deep, so we have to change value on root
const internalChange = ref(false)
const internalChangeEdit = ref(false)
const formData = ref({
  name: '',
  version: 0,
  inst: ''
})
const rules = ref({
  name: [{ required: true, message: t('iot.enterAppNameTip'), trigger: 'blur' }],
  inst: [
    { required: true, message: t('iot.enterAppInstNameTip2'), trigger: 'blur' }
  ],
  version: [{ required: true, message: t('iot.enterAppVersion'), trigger: 'blur' }]
})

// const deviceStatus = computed(() => {
//   return props.status
// })

// const connected = computed(() => {
//   return deviceStore.connected
// })

const canPrev = computed(() => {
  return active.value > 0
})
const canNext = computed(() => {
  return active.value < (activeTabs.length - 1)
})
const canFinish = computed(() => {
  return active.value === (activeTabs.length - 1)
})
const tabActive = computed(() => {
  return activeTabs[active.value]
})

watch(appID, (newValue, oldValue) => {
  if (newValue && newValue > 0) {
    formData.value.name = newValue
    setTimeout(() => {
      loadApp(newValue)
    }, 100)
  } else {
    conf_enable.value = false
    appInfo.value = {}
    jsonData.value = {}
    jsonSchema.value = []
  }
})

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

const prev = () => {
  active.value--
}
const next = () => {
  active.value++
}

const finish = async() => {
  const data = {
    device: props.device.sn,
    inst: formData.value.inst,
    version: formData.value.version,
    name: appInfo.value.app_id,
    conf: jsonData.value
  }
  const res = await install_app(data)
  if (res.code === 0) {
    if (res.data?.id) {
      actionStore.PushAction({ id: res.data.id, name: t('iot.installApp') + ` ${data.inst} - ${props.device.sn}`, data: data })
      ElMessage({
        type: 'success',
        message: t('iot.appInstallReqSuccess'),
        showClose: true
      })
    }
  }
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
        jsonData.value = {}
        // console.log('loadApp', jsonSchema)
      } else {
        tabActiveUI.value = 'edit'
      }
      formData.value.version = appInfo.value.cache_version

    } else {
      ElMessage({
        type: 'error',
        message: t('iot.fetchAppInfoFailed')
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

const dialogTitle = ref(t('iot.select'))
const dialogFormVisible = ref(false)
const openDialog = (key) => {
  dialogFormVisible.value = true
}
const closeDialog = () => {
  dialogFormVisible.value = false
}

const selectApp = (app) => {
  appID.value = app.ID
  closeDialog()
}

</script>

<style scoped>
.step-content-class {
  min-height: 100%;
  height: 100%;
}
</style>

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

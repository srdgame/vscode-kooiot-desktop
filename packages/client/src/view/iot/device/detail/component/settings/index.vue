<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :style="{paddingLeft:'10px', paddingRight:'10px'}">
      <el-form-item>
        <el-button v-if="device.online" link style="color: #67C23A" icon="link"> {{ t('iot.online') }} </el-button>
        <el-button v-else link style="color: #dc143c" icon="loading"> {{ t('iot.offline') }}... </el-button>

        <el-button v-if="deviceStatus.data_upload" link style="color: #67C23A" icon="upload"> {{ t('iot.dataUploadEnable') }} </el-button>
        <el-button v-else link style="color: #606266" icon="circle-close"> {{ t('iot.dataUploadDisabled') }} </el-button>

        <el-button v-if="connected" link style="color: #67C23A" icon="upload"> {{ t('iot.dataChannelOpen') }} </el-button>
        <el-button v-else link style="color: #dc143c" icon="circle-close"> {{ t('iot.dataChannelClosed') }} </el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="24" class="system_state">
      <el-col :span="12">
        <el-card shadow="never" class="card_item">
          <template #header>
            <div><el-icon><SetUp /></el-icon> {{ t('iot.systemSettings') }} </div>
          </template>
          <div>
            <el-row :gutter="10">
              <el-col :span="12"> {{ t('iot.dataUploadOption') + ':' }} </el-col>
              <el-col :span="12">
                <WaitableSwitch
                  option="EnableData"
                  :desc="t('iot.dataUploadOption')"
                  :disabled="!connected"
                  :val="deviceStatus.data_upload !== 0"
                  @change="enableOption"
                />
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12"> {{ t('iot.betaMode') + ':' }} </el-col>
              <el-col :span="12">
                <WaitableSwitch
                  option="EnableBeta"
                  :desc="t('iot.betaMode')"
                  :disabled="!connected"
                  :val="deviceStatus.enable_beta !== 0"
                  @change="enableOption"
                />
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12"> {{ t('iot.eventUploadLevel') + ':' }} </el-col>
              <el-col :span="12">
                <WaitableNumber
                  option="EnableEvent"
                  :desc="t('iot.eventUploadLevel')"
                  :disabled="!connected"
                  :val="deviceStatus.event_upload"
                  @change="changeOption"
                />
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12"> {{ t('iot.statictiesDataUpload') + ':' }} </el-col>
              <el-col :span="12">
                <WaitableSwitch
                  option="EnableStat"
                  :desc="t('iot.statictiesDataUpload')"
                  :disabled="!connected"
                  :val="deviceStatus.stat_upload !== 0"
                  @change="enableOption"
                />
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12"> {{ t('iot.dataUploadTTL') + '(ms) **:' }} </el-col>
              <el-col :span="12">
                <WaitableNumber
                  option="data_upload_period"
                  :desc="t('iot.dataUploadTTL') "
                  :disabled="!connected"
                  :val="deviceStatus.data_upload_period"
                  @change="changeCloudConf"
                />
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12"> {{ t('iot.dataUploadSnapshot') + '(s) **:' }} </el-col>
              <el-col :span="12">
                <WaitableNumber
                  option="data_upload_cov_ttl"
                  :desc="t('iot.dataUploadSnapshot')"
                  :disabled="!connected"
                  :val="deviceStatus.data_upload_cov_ttl"
                  @change="changeCloudConf"
                />
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12"> {{ t('iot.restartFreeIOE') + ':' }} </el-col>
              <el-col :span="12">
                <el-button
                  :disabled="!connected"
                  size="small"
                  type="danger"
                  icon="refresh"
                  plain
                  @click="onRestart"
                > {{ t('iot.restartFreeIOE') }} </el-button>
              </el-col>
            </el-row>
            <el-row :gutter="10">
              <el-col :span="12"> {{ t('iot.restartGateway') + ':' }} </el-col>
              <el-col :span="12">
                <el-button
                  :disabled="!connected"
                  size="small"
                  type="danger"
                  icon="refresh"
                  plain
                  @click="onReboot"
                > {{ t('iot.restartGateway') }} </el-button>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <div class="chart-player">
          <el-card v-if="deviceStatus" shadow="never" class="card_item">
            <template #header>
              <div><el-icon><Histogram /></el-icon> {{ t('iot.systemLoad') }}</div>
            </template>
            <div>
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-row :gutter="10">
                    <el-col :span="12"> {{ t('iot.memTotal') + '(MB):' }} </el-col>
                    <el-col :span="12" v-text="Math.round(deviceStatus.mem_total / 1024)" />
                  </el-row>
                  <el-row :gutter="10">
                    <el-col :span="12"> {{ t('iot.memUsed') + '(MB):' }} </el-col>
                    <el-col :span="12" v-text="Math.round(deviceStatus.mem_used / 1024)" />
                  </el-row>
                  <el-row :gutter="10">
                    <el-col :span="12"> {{ t('iot.cpuLoad') + ':' }} </el-col>
                    <el-col :span="12" v-text="deviceStatus.cpuload" />
                  </el-row>
                  <el-row :gutter="10">
                    <el-col :span="12"> {{ t('iot.cpuTemperature') + ':' }} </el-col>
                    <el-col :span="12" v-text="deviceStatus.cpu_temp" />
                  </el-row>
                </el-col>
                <el-col :span="12">
                  <el-progress
                    v-if="deviceStatus.mem_used"
                    type="dashboard"
                    :percentage="percentage"
                    :color="colors"
                  />
                </el-col>
              </el-row>
            </div>
          </el-card>
          <el-card v-if="deviceStatus" shadow="never" class="card_item">
            <template #header>
              <div><el-icon><Compass /></el-icon> {{ t('iot.systemInformation') }}
                <el-button :style="{ float: 'right' }" type="primary" link @click="checkUpdate">
                  {{ t('iot.checkUpdate') }}
                </el-button>
              </div>
            </template>
            <div>
              <el-row :gutter="10">
                <el-col :span="12"> {{ t('iot.softwareVersion') + ':' }} </el-col>
                <el-col :span="12">
                  {{ deviceStatus.version }} <i v-if="latest.version > deviceStatus.version"> / {{ latest.version }} </i>
                  <el-button
                    v-if="latest.version > deviceStatus.version"
                    :style="{ float: 'right' }"
                    link
                    type="warning"
                    @click="upgradeDevice"
                  > <el-icon><Promotion /></el-icon> {{ t('iot.upgrade') }}  </el-button>
                  <el-tag
                    v-if="latest.version != 0 && latest.version === deviceStatus.version"
                    type="success"
                  > {{ t('iot.noUpdate') }} </el-tag>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12"> {{ t('iot.frameworkVersion') + ':' }} </el-col>
                <el-col :span="12">
                  {{ deviceStatus.skynet_version }} <i v-if="latest.skynet_version > deviceStatus.skynet_version"> / {{ latest.skynet_version }} </i>
                  <el-button
                    v-if="latest.skynet_version > deviceStatus.skynet_version"
                    :style="{ float: 'right' }"
                    link
                    type="warning"
                    @click="upgradeDevice"
                  > <el-icon><Promotion /></el-icon> {{ t('iot.upgrade') }} </el-button>
                  <el-tag
                    v-if="latest.skynet_version != 0 && latest.skynet_version === deviceStatus.skynet_version"
                    type="success"
                  > {{ t('iot.noUpdate') }} </el-tag>
                </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12"> {{ t('iot.OS') + ':' }} </el-col>
                <el-col :span="12" v-text="deviceStatus.platform" />
              </el-row>
              <el-row :gutter="10">
                <el-col :span="12"> {{ t('iot.firmwareVersion') + ':' }} </el-col>
                <el-col :span="12" v-text="deviceStatus.firmware_version" />
              </el-row>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>

    <el-dialog v-model="dialogFormVisible" :title="t('iot.gatewayUpgrade')">
      <el-form ref="dataForm" :inline="true" :model="formData" label-width="160px" type="mini">
        <el-form-item v-if="latest.version > deviceStatus?.version" :about="t('iot.softwareVersion')" prop="version">
          <el-input v-model="formData.version" autocomplete="off" />
        </el-form-item>
        <el-form-item v-if="latest.skynet_version > deviceStatus?.skynet_version" :label="t('iot.upgradeWithFramework')" prop="with_skynet" style="width:100%">
          <el-switch v-model="formData.with_skynet" />
        </el-form-item>
        <el-form-item v-if="formData.with_skynet && latest.skynet_version > deviceStatus?.skynet_version" :label="t('iot.frameworkVersion')" prop="skynet_version">
          <el-input v-model="formData.skynet_version" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">{{ t('iot.cancel') }}</el-button>
          <el-button type="primary" @click="enterDialog"> {{ t('iot.confirm') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'IOTDeviceDetailSettings',
}
</script>

<script setup>
import {
  sys_option,
  sys_restart,
  sys_reboot,
  update_cloud_config,
  check_update,
  sys_upgrade,
} from '@/api/local/device/sys'
import WaitableSwitch from '@/components/waitableSwitch/index.vue'
import WaitableNumber from '@/components/waitableNumber/index.vue'
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useDeviceStore } from '@/pinia/modules/device'
import { useActionsStore } from '@/pinia/modules/actions'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const deviceStore = useDeviceStore()
const actionStore = useActionsStore()

const props = defineProps({
  device: {
    required: true,
    type: Object
  },
  status: {
    required: true,
    type: Object
  }
})

const latest = ref({
  version: 0,
  skynet_version: 0
})
const formData = ref({
  version: 0,
  with_skynet: false,
  skynet_version: 0
})

const tableData = ref([])

const checkTimer = ref(null)
const colors = ref([
  { color: '#5cb87a', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#f56c6c', percentage: 80 }
])

const connected = computed(() => {
  return deviceStore.connected
})

const deviceStatus = computed(() => {
  return props.status
})

const percentage = computed(() => {
  return Math.round((props.status.mem_used / props.status.mem_total) * 100)
})

const getTableData = async() => {
  tableData.value = {}
  // const res = await list_app({ device: props.device.sn })
  // if (res.code === 0) {
  //   tableData.value = res.data.apps
  // }
}

const onDeviceLoad = () => {
  props.device ? getTableData() : null
  checkTimer.value = setInterval(() => {
    props.device ? getTableData() : null
  }, 3000)
}
onDeviceLoad()

const enableOption = async(val, option, desc) => {
  const data = {
    device: props.device.sn,
    option: option,
    value: val ? 1 : 0
  }
  var info = (val ? t('general.enable') : t('iot.closed')) + desc
  const res = await sys_option(data)
  if (res.code === 0) {
    actionStore.PushAction({ id: res.data.id, name: info, data: data })
    ElMessage({
      type: 'success',
      message: info + t('iot.requestSuccess'),
      showClose: true
    })
  }
}
const changeOption = async(val, option, desc) => {
  const data = {
    device: props.device.sn,
    option: option,
    value: val
  }
  var info = t('iot.modify') + desc
  const res = await sys_option(data)
  if (res.code === 0) {
    actionStore.PushAction({ id: res.data.id, name: info, data: data })
    ElMessage({
      type: 'success',
      message: info + t('iot.requestSuccess'),
      showClose: true
    })
  }
}
const changeCloudConf = async(val, option, desc) => {
  ElMessage({
    type: 'warning',
    message: t('iot.modify') + desc + t('iot.notImplemented')
  })
  const conf = {}
  conf[option] = val
  const data = {
    device: props.device.sn,
    conf: conf
  }
  var info = t('iot.modify') + desc
  const res = await update_cloud_config(data)
  if (res.code === 0) {
    actionStore.PushAction({ id: res.data.id, name: info, data: data })
    ElMessage({
      type: 'success',
      message: info + t('iot.requestSuccess'),
      showClose: true
    })
  }
}
const onRestart = async() => {
  const data = {
    device: props.device.sn,
  }
  var info = t('iot.restartFreeIOE') + ' - ' + props.device.sn
  ElMessageBox.confirm(info + '?', t('general.hint'), {
    confirmButtonText: t('general.confirm'),
    cancelButtonText: t('general.cancel'),
    type: 'warning'
  })
    .then(async() => {
      const res = await sys_restart(data)
      if (res.code === 0) {
        actionStore.PushAction({ id: res.data.id, name: info, data: data })
        ElMessage({
          type: 'success',
          message: info + t('iot.requestSuccess'),
          showClose: true
        })
      }
    })
}
const onReboot = async() => {
  const data = {
    device: props.device.sn,
  }
  var info = t('iot.restartGateway') + ' - ' + props.device.sn
  ElMessageBox.confirm(info + '?', t('general.hint'), {
    confirmButtonText: t('general.confirm'),
    cancelButtonText: t('general.cancel'),
    type: 'warning'
  })
    .then(async() => {
      const res = await sys_reboot(data)
      if (res.code === 0) {
        actionStore.PushAction({ id: res.data.id, name: info, data: data })
        ElMessage({
          type: 'success',
          message: info + t('iot.requestSuccess'),
          showClose: true
        })
      }
    })
}
// 弹窗相关
const dataForm = ref(null)
const dialogFormVisible = ref(false)

const closeDialog = () => {
  dialogFormVisible.value = false
}

const enterDialog = async() => {
  dataForm.value.validate(async valid => {
    if (valid) {
      var data = {
        device: props.device.sn,
        version: 0,
        skynet: null,
      }
      var info = t('iot.gatewayUpgrade')
      if (formData.value.version !== 0) {
        data.version = formData.value.version
        info = info + data.version + ' - '
      }
      if (formData.value.with_skynet && formData.value.skynet_version !== 0) {
        data.skynet = formData.value.skynet_version
        info = info + data.version + ' '
      }
      const res = await sys_upgrade(data)
      if (res.code === 0) {
        actionStore.PushAction({ id: res.data.id, name: info, data: data })
        ElMessage({
          type: 'success',
          message: t('iot.gatewayUpgradeReqSent'),
          showClose: true
        })
      }
      closeDialog()
    }
  })
}
const checkUpdate = async() => {
  const res = await check_update({ device: props.device.sn })
  if (res.code === 0) {
    if (res.data?.data) {
      latest.value = {
        version: res.data.data.version,
        skynet_version: res.data.data.skynet_version
      }
      ElMessage({
        type: 'success',
        message: t('iot.fetchLatestVersionSuccess')
      })
    }
  }
}
const upgradeDevice = async() => {
  if (latest.value.version > props.status.version) {
    formData.value.version = latest.value.version
  } else {
    formData.value.version = 0
  }
  if (latest.value.skynet_version > props.status.skynet_version) {
    formData.value.skynet_version = latest.value.skynet_version
    formData.value.with_skynet = true
  } else {
    formData.value.skynet_version = 0
    formData.value.with_skynet = false
  }
  dialogFormVisible.value = true
}
</script>

<style scoped>
.system_state {
  padding: 0px;
}

</style>

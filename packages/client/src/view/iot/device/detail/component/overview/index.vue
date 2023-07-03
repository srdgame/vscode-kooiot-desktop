<template>
  <div>
    <div class="gva-card-box">
      <el-card class="gva-card quick-entrance">
        <el-row :gutter="20">
          <span>{{ device.description }}
            <el-button v-if="device.online" size="small" link style="color: #67C23A" icon="link"> {{ t('iot.online') }} </el-button>
            <el-button v-else size="small" link style="color: #dc143c" icon="loading"> {{ t('iot.offline') }} </el-button>

            <el-button v-if="deviceStatus?.data_upload" size="small" link style="color: #67C23A" icon="upload"> {{ t('iot.dataUploadEnable') }} </el-button>
            <el-button v-else size="small" link style="color: #606266" icon="warning-filled"> {{ t('iot.dataUploadDisabled') }} </el-button>

            <el-button v-if="connected" size="small" link style="color: #67C23A" icon="sort"> {{ t('iot.dataChannelOpen') }} </el-button>
            <el-button v-else size="small" link style="color: #dc143c" icon="warning-filled"> {{ t('iot.dataChannelClosed') }} </el-button>

            <el-button size="small" link type="primary" icon="refresh" @click="refreshData()"> {{ t('iot.deviceDataRefresh') }} </el-button>
          </span>
        </el-row>
      </el-card>
    <!-- <div class="quick-entrance-title"></div> -->
    </div>
    <div class="shadow">
      <el-row :gutter="20">
        <el-col
          v-for="(card, key) in toolCards"
          :key="key"
          :span="4"
          :xs="8"
          @click="switchTab(card.name)"
        >
          <el-card shadow="hover" class="grid-content">
            <el-icon v-if="card.icon">
              <component :is="card.icon" :style="{ color: card.color }" />
            </el-icon>
            <p>{{ card.label }}</p>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="bottom">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :lg="12">
          <div class="chart-player">
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
        <el-col :xs="24" :sm="12" :lg="12">
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
          </div>
        </el-col>
      </el-row>
    </div>
    <el-row :gutter="20">
      <el-col>
        <div class="chart-player">
          <el-card v-if="deviceStatus" shadow="never" class="card_item">
            <template #header>
              <div><el-icon><Position /></el-icon> {{ t('iot.mobileNetworkInfo') }} </div>
            </template>
            <div>
              <el-row :gutter="10">
                <el-col :span="4"> {{ t('iot.mobileSignalStrength') + ':' }} </el-col>
                <el-col :span="20"> {{ deviceStatus.csq }} </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="4"> {{ t('iot.mobileCCID') + ':' }} </el-col>
                <el-col :span="20"> {{ deviceStatus.ccid }} </el-col>
              </el-row>
              <el-row :gutter="10">
                <el-col :span="4"> {{ t('iot.mobileLteInfo') + ':' }} </el-col>
                <el-col :span="40" v-text="deviceStatus.lte_info" />
              </el-row>
              <el-row :gutter="10">
                <el-col :span="4"> {{ t('iot.mobileFlow') + ':' }} </el-col>
                <el-col :span="20"> {{ deviceStatus.wan_s }} / {{ deviceStatus.wan_r }} </el-col>
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
  name: 'IOTDeviceDetailOverview'
}
</script>

<script setup>
import {
  fire_snapshot
} from '@/api/local/device/data'
import { check_update, sys_upgrade } from '@/api/local/device/sys'
import { useDeviceStore } from '@/pinia/modules/device'
import { useActionsStore } from '@/pinia/modules/actions'
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const deviceStore = useDeviceStore()
const actionStore = useActionsStore()
const emit = defineEmits(['switchTab', 'installApp'])

const props = defineProps({
  product: {
    default: function() {
      return {}
    },
    required: true,
    type: Object
  },
  device: {
    default: function() {
      return {}
    },
    required: true,
    type: Object
  },
  status: {
    default: () => {},
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
const toolCards = ref([
  {
    label: t('iot.viewDeviceData'),
    icon: 'data-line',
    name: 'deviceList',
    color: '#ff9c6e'
  },
  {
    label: t('iot.appManagement'),
    icon: 'menu',
    name: 'appList',
    color: '#b37feb'
  },
  {
    label: t('iot.gatewaySettings'),
    icon: 'set-up',
    name: 'settings',
    color: '#69c0ff'
  },
  {
    label: t('iot.gatewayDebug'),
    icon: 'view',
    name: 'deviceDebug',
    color: '#5cdbd3'
  },
])
const colors = ref([
  { color: '#5cb87a', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#f56c6c', percentage: 80 }
])

const connected = computed(() => {
  return deviceStore.connected
})

const deviceStatus = computed(() => {
  // console.log('deviceStatus.computed', props.status.data_upload)
  return props.status
})

const percentage = computed(() => {
  return Math.round((props.status.mem_used / props.status.mem_total) * 100)
})

// watch(() => props.status, (val) => {
//   console.log('props.status', val.data_upload)
// }, { deep: true })

const switchTab = (name) => {
  emit('switchTab', name)
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
  const res = await check_update({ device: props.device.sn, platform: deviceStatus.value.platform })
  if (res.code === 0) {
    if (res.data) {
      latest.value = {
        version: res.data.version,
        skynet_version: res.data.skynet_version
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

const refreshData = async() => {
  const res = await fire_snapshot({
    device: props.device.sn,
  })
}

</script>

<style scoped>
/* .el-card-define {
  min-height: 100%;
  height: 100%;
}
.el-card-define >>> .el-card__body {
  height: 100%;
} */

.car-left {
    width: 70%;
    float: left;
}

.card_item {
  height: 260px;
}
</style>

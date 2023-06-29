<template>
  <div>
    <div :style="{display:'inline-block',float:'right'}">
      <el-button v-if="device.online" link style="color: #67C23A" icon="link"> {{ t('iot.online') }} </el-button>
      <el-button v-else link style="color: #dc143c" icon="loading"> {{ t('iot.offline') }}... </el-button>

      <el-button v-if="deviceStatus.data_upload" link style="color: #67C23A" icon="upload"> {{ t('iot.dataUploadEnable') }} </el-button>
      <el-button v-else link style="color: #606266" icon="circle-close"> {{ t('iot.dataUploadDisabled') }} </el-button>

      <el-button v-if="connected" link style="color: #67C23A" icon="upload"> {{ t('iot.dataChannelOpen') }} </el-button>
      <el-button v-else link style="color: #dc143c" icon="circle-close"> {{ t('iot.dataChannelClosed') }} </el-button>
    </div>
    <el-tabs v-model="tabActive" :tab-position="tabPosition">
      <el-tab-pane lazy name="log">
        <template #label>
          <span><el-icon><Comment /></el-icon> {{ t('iot.deviceLogTab') }} </span>
        </template>
      </el-tab-pane>
      <el-tab-pane lazy name="comm">
        <template #label>
          <span><el-icon><Switch /></el-icon> {{ t('iot.deviceCommTab') }} </span>
        </template>
      </el-tab-pane>
    </el-tabs>
    <div v-show="tabActive === 'log'">
      <device-log :device="props.device" :mqtt="props.mqtt" :tab-active="tabActive === 'log'" />
    </div>
    <div v-show="tabActive === 'comm'">
      <device-comm :device="props.device" :mqtt="props.mqtt" :tab-active="tabActive === 'comm'" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'IOTDeviceDetailDebug',
}
</script>

<script setup>
import DeviceLog from './deviceLog.vue'
import DeviceComm from './deviceComm.vue'
import { computed, ref } from 'vue'
import { useDeviceStore } from '@/pinia/modules/device'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const deviceStore = useDeviceStore()

const props = defineProps({
  device: {
    required: true,
    type: Object
  },
  mqtt: {
    required: true,
    type: Object
  },
  status: {
    required: true,
    type: Object
  },
})

const connected = computed(() => {
  return deviceStore.connected
})

const deviceStatus = computed(() => {
  return props.status
})

const tabPosition = ref('top')
const tabActive = ref('log')
</script>

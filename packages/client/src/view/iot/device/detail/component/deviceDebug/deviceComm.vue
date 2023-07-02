<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <!-- <el-form-item>
        <el-radio-group v-model="scroll_top" style="margin-left:30px">
          <el-radio :label="1">自动滚动</el-radio>
          <el-radio :label="2">固定位置</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item :label="t('iot.recordCount')">
        <el-input v-model="dataCount" :placeholder="t('iot.recordCount')" readonly />
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="show_hex">{{ t('iot.showInHexMode') }}</el-checkbox>
      </el-form-item>
      <el-form-item :label="t('iot.search')">
        <el-input v-model="filter" :placeholder="t('iot.searchKeywordTip')" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="search" @click="onSubmit">{{ t('general.search') }}</el-button>
        <el-button v-if="subscribed" type="warning" icon="refresh-right" @click="closeChannel()">{{ t('iot.unSubscribe') }}</el-button>
        <el-button v-else type="success" icon="refresh-right" @click="createChannel()">{{ t('iot.deviceCommSubscribe') }}</el-button>
        <el-button type="danger" icon="delete" @click="cleanChannel()">{{ t('iot.clean') }}</el-button>
      </el-form-item>
    </el-form>
    <div style="width: 100%; height: 600px">
      <el-auto-resizer>
        <template #default="{ height, width }">
          <el-table-v2
            ref="plTabComm"
            :columns="columns"
            :data="tableData"
            :width="width"
            :height="height"
            :row-height="rowHeight"
            raw-key="index"
          />
        </template>
      </el-auto-resizer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IOTDeviceDetailDebugDeviceComm',
}
</script>

<script setup>
import { strToHexCharCode /* , strToASCIICharcode */ } from '@/utils/iot'
import { h, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  device: {
    required: true,
    type: Object
  },
  mqtt: {
    required: true,
    type: Object
  },
  tabActive: {
    required: true,
    type: Boolean
  }
})

const device = ref(props.device.sn)
const filter = ref('')
const subscribed = ref(false)
const show_hex = ref(true)
const channel = ref(null)

const plTabComm = ref(null)

const tableData = ref([])
const dataCount = ref('0')

const page_key = ref('device_debug')
const rowHeight = ref(40)

const columns = [
  { key: 'time', dataKey: 'time', title: t('iot.time'), width: 160, minWidth: 120 },
  { key: 'id', dataKey: 'id', title: t('iot.deviceSerialNumber'), width: 240 },
  { key: 'direction', dataKey: 'direction', title: t('iot.deviceCommDirection'), width: 100 },
  { key: 'content', dataKey: 'content', title: t('iot.deviceComm'), width: 240, flexGrow: 1, cellRenderer: ({ cellData }) =>
    h(
      'div',
      { title: formatCommContent(cellData) },
      { default: () => formatCommContent(cellData) },
    )
  },
]

const formatCommContent = (cellData) => {
  return show_hex.value ? strToHexCharCode(cellData) : cellData
}
// const formatCommContent = ({ cellData }) => {
//   return show_hex.value ? strToHexCharCode(cellData) : cellData
// }

watch(show_hex, (val, old_val) => {
  tableData.value = channel.value.dataArr?.slice(0)
})

watch(() => props.device, (val) => {
  if (val.sn === device.value) {
    return
  }
  device.value = val.sn
  if (channel.value) {
    channel.value.setUpdateCB(() => {})
    channel.value = null
    tableData.value = []
    dataCount.value = '0'
  }
  subscribed.value = false
  nextTick(_ => {
    subscribed.value = props.mqtt.isCommSub(page_key.value)
    if (subscribed.value) {
      channel.value = props.mqtt.subComm(page_key.value, channel.value)
      channel.value.setUpdateCB((val) => {
        tableData.value = val.dataArr?.slice(0)
        dataCount.value = val.dataArr?.length + '/' + val.allData?.length
        // plTabLog.value?.scrollToRow('end')
      })
      channel.value.setFilter(filter.value)
    }
  })
})

const onSubmit = () => {
  if (channel.value) {
    channel.value.setFilter(filter.value)
  }
}

const createChannel = async() => {
  channel.value = await props.mqtt.subComm(page_key.value, channel.value)
  subscribed.value = true
  channel.value.setFilter(filter.value)
  channel.value.setUpdateCB((val) => {
    tableData.value = val.dataArr?.slice(0)
    dataCount.value = val.dataArr?.length + '/' + val.allData?.length
    // plTabLog.value?.scrollToRow('end')
  })
}

const closeChannel = async() => {
  if (!channel.value) {
    return
  }
  await props.mqtt.unSubComm('device_debug')
  subscribed.value = false
}

const cleanChannel = () => {
  if (channel.value) {
    channel.value.clearData()
  }
}

</script>

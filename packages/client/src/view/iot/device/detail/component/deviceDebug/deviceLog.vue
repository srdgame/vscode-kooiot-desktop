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
      <el-form-item :label="t('iot.search')">
        <el-input v-model="filter" :placeholder="t('iot.searchKeywordTip')" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="search" @click="onSubmit">{{ t('general.search') }}</el-button>
        <el-button v-if="subscribed" type="warning" icon="refresh-right" @click="closeChannel()">{{ t('iot.unSubscribe') }}</el-button>
        <el-button v-else type="success" icon="refresh-right" @click="createChannel()">{{ t('iot.deviceLogSubscribe') }}</el-button>
        <el-button type="danger" icon="delete" @click="cleanChannel()">{{ t('iot.clean') }}</el-button>
      </el-form-item>
    </el-form>
    <div style="width: 100%; height: 600px">
      <el-auto-resizer>
        <template #default="{ height, width }">
          <el-table-v2
            ref="plTabLog"
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
  name: 'IOTDeviceDetailDebugDeviceLog',
}
</script>

<script setup>
// import { computed, ref, onMounted, nextTick } from 'vue'
import { nextTick, ref, watch } from 'vue'
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

const filter = ref('')
const subscribed = ref(false)
const channel = ref(null)
const plTabLog = ref(null)

const tableData = ref([])
const dataCount = ref('')

const page_key = ref('device_debug')
const rowHeight = ref(40)

const columns = [
  { key: 'time', dataKey: 'time', title: t('iot.time'), width: 160, minWidth: 120 },
  { key: 'level', dataKey: 'level', title: t('iot.logLevel'), width: 100, minWidth: 80 },
  { key: 'id', dataKey: 'id', title: t('iot.processID'), width: 85 },
  { key: 'inst', dataKey: 'inst', title: t('iot.processName'), width: 120 },
  { key: 'content', dataKey: 'content', title: t('iot.deviceComm'), width: 240, flexGrow: 1 },
]

watch(() => props.device, (val) => {
  if (channel.value) {
    channel.value.setUpdateCB(() => {})
    channel.value = null
    tableData.value = []
    dataCount.value = '0'
  }
  subscribed.value = false
  nextTick(_ => {
    subscribed.value = props.mqtt.isLogSub(page_key.value)
    if (subscribed.value) {
      channel.value = props.mqtt.subLog(page_key.value)
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
  channel.value = props.mqtt.subLog(page_key.value)
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
  await props.mqtt.unSubLog(page_key.value)
  subscribed.value = false
  // console.log(subscribed.value)
}

const cleanChannel = () => {
  if (channel.value) {
    channel.value.clearData()
  }
}

</script>

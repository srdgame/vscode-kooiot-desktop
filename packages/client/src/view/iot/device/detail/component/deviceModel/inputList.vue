<template>
  <div style="width: 100%; height: 480px">
    <el-auto-resizer>
      <template #default="{ height, width }">
        <!-- <el-table-v2
          :columns="columns"
          :data="allData"
          :row-class="tableRowClass"
          :width="width"
          :height="height"
          fixed
        /> -->
        <el-table-v2
          :columns="columns"
          :data="allData"
          :width="width"
          :height="height"
        />
      </template>
    </el-auto-resizer>

    <el-drawer
      v-model="drawer"
      :title="t('iot.dataHistoryLine')"
      direction="btt"
      :with-header="false"
      size="50%"
      :append-to-body="true"
    >
      <v-chart ref="dataLine" class="chart" :option="option" autoresize />
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'IotDeviceDetailDeviceModelInputList',
}
</script>

<script setup>
import { formatTimeToStr } from '@/utils/date'
import { computed, h, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { ElTag } from 'element-plus'
// import XEUtils from 'xe-utils'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const timer = ref(0)
const tableKey = ref(0)

const props = defineProps({
  modelValue: {
    required: true,
    type: Array
  },
  device: {
    required: true,
    type: String
  }
})

const search = ref('')
const drawer = ref(false)
// const his_data = ref([])
const option = ref({})

const columns = [
  { key: 'seq', title: '#', width: 55, minWidth: 40, fixed: true, cellRenderer: ({ rowIndex }) => `${rowIndex + 1}` },
  { key: 'name', dataKey: 'name', title: t('iot.name'), width: 150, flexGrow: 1 },
  { key: 'desc', dataKey: 'desc', title: t('general.description'), width: 120, flexGrow: 1 },
  { key: 'unit', dataKey: 'unit', title: t('iot.unit'), width: 80, minWidth: 60 },
  { key: 'vt', dataKey: 'vt', title: t('iot.dataVT'), width: 80, minWidth: 60, cellRenderer: ({ cellData }) =>
    h(
      ElTag,
      { type: 'success', title: formatVT(cellData) },
      () => formatVT(cellData),
    ),
  },
  { key: 'value.value', dataKey: 'value.value', title: t('iot.inputDataValue'), width: 180, flexGrow: 1, cellRenderer: ({ cellData }) =>
    h(
      'div',
      { title: formatValue(cellData) },
      { default: () => formatValue(cellData) },
    )
  },
  { key: 'value.timestamp', dataKey: 'value.timestamp', title: t('iot.time'), width: 180, minWidth: 160, cellRenderer: ({ cellData }) =>
    h(
      'div',
      { title: formatTimestamp(cellData) },
      { default: () => formatTimestamp(cellData) },
    )
  },
  { key: 'value.quality', dataKey: 'value.quality', title: t('iot.inputQuality'), width: 80, minWidth: 60, cellRenderer: ({ cellData }) =>
    h(
      'div',
      { title: formatQuality(cellData) },
      { default: () => formatQuality(cellData) },
    )
  }
]

// const tableRowClass = ({ rowIndex }) => {
//   if (rowIndex % 2 === 1) {
//     return 'bg-red-my'
//   } else if (rowIndex % 2 === 0) {
//     return 'bg-blue-my'
//   }
//   return ''
// }

const formatVT = (vt) => {
  return vt !== null && vt !== '' ? vt : 'float'
}

const formatValue = (value) => {
  return value !== null ? value : 'N/A'
}

const formatTimestamp = (timestamp) => {
  return timestamp !== null ? formatTimeToStr(timestamp * 1000) : 'N/A'
}

const formatQuality = (quality) => {
  return quality !== null ? quality : '-99'
}

const allData = computed(() => {
  return props.modelValue.filter(data => !search.value || data.name.toLowerCase().includes(search.value.toLowerCase()))
  // const filterName = XEUtils.toValueString(search.value).trim().toLowerCase()
  // if (filterName) {
  //   const filterRE = new RegExp(filterName, 'gi')
  //   const searchProps = ['name', 'desc', 'unit']
  //   const rest = props.modelValue.filter(item => searchProps.some(key => XEUtils.toValueString(item[key]).toLowerCase().indexOf(filterName) > -1))
  //   return rest.map(row => {
  //     const item = Object.assign({}, row)
  //     searchProps.forEach(key => {
  //       item[key] = XEUtils.toValueString(item[key]).replace(filterRE, match => `<span class="keyword-lighten">${match}</span>`)
  //     })
  //     return item
  //   })
  // } else {
  //   return props.modelValue
  // }
})

onMounted(async() => {
  await nextTick()
  timer.value = setInterval(() => {
    var val = tableKey.value + 1
    if (val < 0) {
      val = 0
    }
    tableKey.value = val
  }, 1000)
})

onUnmounted(async() => {
  clearInterval(timer.value)
})
</script>

<style lang="scss">
.keyword-lighten {
  color: #000;
  background-color: #FFFF00;
}
.bg-blue-my {
  --un-bg-opacity:1;
  background-color:rgba(191,219,254,var(--un-bg-opacity));
}
.bg-red-my {
  --un-bg-opacity:1;
  background-color:rgba(254,226,226,var(--un-bg-opacity));
}
</style>

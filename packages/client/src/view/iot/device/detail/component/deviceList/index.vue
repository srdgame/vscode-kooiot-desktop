<template>
  <div>
    <div class="status-search-box">
      <el-form :inline="true" class="demo-form-inline" :style="{paddingLeft:'10px', paddingRight:'10px', paddingBottom: '0px'}">
        <el-form-item>
          <el-button v-if="device.online" link style="color: #67C23A" icon="link"> {{ t('iot.online') }} </el-button>
          <el-button v-else link style="color: #dc143c" icon="loading"> {{ t('iot.offline') }}... </el-button>

          <el-button v-if="deviceStatus.data_upload" link style="color: #67C23A" icon="upload"> {{ t('iot.dataUploadEnable') }} </el-button>
          <el-button v-else link style="color: #606266" icon="circle-close"> {{ t('iot.dataUploadDisabled') }} </el-button>

          <el-button v-if="connected" link style="color: #67C23A" icon="upload"> {{ t('iot.dataChannelOpen') }} </el-button>
          <el-button v-else link style="color: #dc143c" icon="circle-close"> {{ t('iot.dataChannelClosed') }} </el-button>
        </el-form-item>
        <el-form-item :style="{display:'inline-block',float:'right'}">
          <el-button type="primary" icon="refresh-right" @click="refreshData()">{{ t('iot.deviceDataRefresh') }}</el-button>
          <el-button v-if="!deviceStatus.data_upload" type="success" icon="open" @click="enableOption(1, 'EnableData', t('iot.dataUploadOption'))">
            {{ t('iot.dataUploadOptionEnable') }}
          </el-button>
          <el-button v-else plain type="danger" icon="open" @click="enableOption(0, 'EnableData', t('iot.dataUploadOption'))">
            {{ t('iot.dataUploadOptionDisable') }}
          </el-button>
        </el-form-item>
        <el-form-item :style="{display:'inline-block',float:'right'}">
          <el-input
            v-model="search"
            :placeholder="t('iot.searchKeywordTip2')"
          />
        </el-form-item>
      </el-form>
    </div>

    <el-table v-if="newWindowStyle" :data="allData" style="width: 100%" row-key="sn">
      <el-table-column :label="t('iot.name')" fixed min-width="120" prop="meta.inst" sortable />
      <el-table-column :label="t('iot.serialNumber')" min-width="240" prop="sn" sortable />
      <el-table-column :label="t('general.description')" min-width="240" prop="meta.description" sortable />
      <el-table-column :label="t('iot.deviceName')" min-width="120" prop="meta.name" sortable />
      <el-table-column :label="t('iot.deviceBelongAppInst')" min-width="160" prop="meta.app_inst" sortable />

      <el-table-column align="left" fixed="right" :label="t('general.operations')" width="80">
        <template #default="scope">
          <el-button-group>
            <el-tooltip :content="t('iot.view')" placement="top">
              <el-button type="success" icon="view" link @click="handleView(scope.row)">{{ t('iot.view') }}</el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-table v-else :data="allData" style="width: 100%" row-key="sn" :expand-row-keys="expandedDevices" @expand-change="expandSelect"> -->
    <el-table v-else :data="allData" style="width: 100%" row-key="sn">
      <el-table-column fixed type="expand">
        <template #default="scope">
          <div class="expand-wrapper">
            <div style="padding-left: 58px">
              <deviceModel v-model="scope.row" />
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="t('iot.name')" fixed min-width="120" prop="meta.inst" sortable />
      <el-table-column :label="t('iot.serialNumber')" min-width="240" prop="sn" sortable />
      <el-table-column :label="t('general.description')" min-width="240" prop="meta.description" sortable />
      <el-table-column :label="t('iot.deviceName')" min-width="120" prop="meta.name" sortable />
      <el-table-column :label="t('iot.deviceBelongAppInst')" min-width="160" prop="meta.app_inst" sortable />
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'IotDeviceDetailDeviceList',
}
</script>

<script setup>
import {
  sys_option,
  // update_cloud_config
} from '@/api/local/device/sys'
import { useDeviceStore } from '@/pinia/modules/device'
import { useActionsStore } from '@/pinia/modules/actions'
import deviceModel from '../deviceModel/index.vue'
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits(['open-device'])

const deviceStore = useDeviceStore()
const actionsStore = useActionsStore()

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
  devices: {
    default: () => {},
    required: true,
    type: Object
  }
})

const newWindowStyle = computed(() => {
  return props.devices.length > 110
})

// const expandedDevices = ref([])

const connected = computed(() => {
  return deviceStore.connected
})

const search = ref('')
const deviceData = computed(() => {
  return props.devices
})

const allData = computed(() => {
  return deviceData.value ? deviceData.value.filter(data => !search.value ||
    data.meta.name.toLowerCase().includes(search.value.toLowerCase()) ||
    data.meta.description.toLowerCase().includes(search.value.toLowerCase()) ||
    data.sn.toLowerCase().includes(search.value.toLowerCase()) ||
    data.meta.inst.toLowerCase().includes(search.value.toLowerCase()) ||
    data.meta.app_inst.toLowerCase().includes(search.value.toLowerCase())) : []
})

const deviceStatus = computed(() => {
  return props.status
})

const refreshData = async() => {
  // TODO:
}

// const expandSelect = (row, expandedRows) => {
//   if (expandedRows.length) {
//     var index = expandedDevices.value.indexOf(row.sn)
//     if (index === -1) {
//       expandedDevices.value.push(row.sn)
//     } else {
//       expandedDevices.value.splice(index, 1)
//     }
//   } else {
//     expandedDevices.forEach(sn => {
//       const index = allData.value.findIndex(sn)
//     })
//     expandedDevices.value.shift()
//     expandedDevices.value = []
//   }
// }

const enableOption = async(val, key, desc) => {
  const data = {
    device: props.device.sn,
    option: key,
    value: val ? 1 : 0
  }
  var info = (val ? t('general.enable') : t('iot.closed')) + desc
  const res = await sys_option(data)
  if (res.code === 0) {
    actionsStore.PushAction({ id: res.data.id, name: info, data: { val: val, key: key, desc: desc }})
    ElMessage({
      type: 'success',
      message: info + t('iot.requestSuccess'),
      showClose: true
    })
  }
}

const loadData = () => {
  props.device ? refreshData() : null
}

const handleView = (index, row) => {
  emit('open-device', row.sn)
}

loadData()
</script>

<style scoped>
  .demo-form-inline {
    z-index: 0;
  }
</style>

<style scoped>
.status-search-box {
    margin-bottom: 5px;
}
</style>

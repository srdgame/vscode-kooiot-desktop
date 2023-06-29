<template>
  <div>
    <div style="width: 100%; height: 480px">
      <el-auto-resizer>
        <template #default="{ height, width }">
          <el-table-v2
            :columns="columns"
            :data="allData"
            :width="width"
            :height="height"
          />
        </template>
      </el-auto-resizer>
    </div>

    <el-dialog v-model="dialogFormVisible" :before-close="closeDialog" :title="dialogTitle" :append-to-body="true">
      <el-form ref="dataForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item :label="t('iot.deviceCommandName')" prop="command">
          <el-input v-model="formData.command" autocomplete="off" :disabled="true" />
        </el-form-item>
        <el-form-item :label="t('iot.deviceCommandParams')" prop="param">
          <el-input v-model="formData.param" autocomplete="off" type="textarea" :autosize="{ minRows: 4 }" />
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
  name: 'IotDeviceDetailDeviceModelCommandList',
}
</script>

<script setup>
import { send_command } from '@/api/local/device/data'
// import { useDeviceStore } from '@/pinia/modules/device'
import { useActionsStore } from '@/pinia/modules/actions'
import { ElMessage, ElButton, ElInput } from 'element-plus'
// import XEUtils from 'xe-utils'
import { computed, h, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// const deviceStore = useDeviceStore()
const actionsStore = useActionsStore()

const props = defineProps({
  modelValue: {
    default: () => [],
    type: Array
  },
  device: {
    required: true,
    type: String
  }
})

const checkParam = (rule, value, callback) => {
  if (value.length <= 0) {
    return callback(new Error(t('iot.enterCommandParamsTip')))
  } else {
    try {
      const json = JSON.parse(value)
      // console.log(json)
      if (json) {
        callback()
      }
    } catch (e) {
      return callback(e)
    }
  }
}

const search = ref('')
const dialogTitle = ref('')
const dialogFormVisible = ref(false)
const formData = ref({
  device: '',
  command: '',
  param: ''
})
const rules = ref({
  param: [{ validator: checkParam, trigger: 'blur' }]
})

const columns = [
  { key: 'seq', title: '#', width: 55, minWidth: 40, fixed: true, cellRenderer: ({ rowIndex }) => `${rowIndex + 1}` },
  { key: 'name', dataKey: 'name', title: t('iot.name'), width: 150, flexGrow: 1 },
  { key: 'desc', dataKey: 'desc', title: t('general.description'), width: 120, flexGrow: 1 },
  { key: 'operations', title: t('general.operations'), width: 150, flexGrow: 1, align: 'center', cellRenderer: ({ rowIndex, rowData }) =>
    h(
      ElButton,
      { type: 'primary', onClick: () => handleTrigger(rowIndex, rowData) },
      { default: () => t('iot.deviceCommandTrigger') },
    ), headerCellRenderer: (props) =>
    h(
      'div',
      { class: 'flex item-center justify-center' },
      [
        h(ElInput, { size: 'small', placeholder: t('iot.searchKeywordTip2'), modelValue: search.value,
          'onUpdate:modelValue': (value) => { search.value = value } })
      ]
    )
  }
]

const allData = computed(() => {
  return props.modelValue.filter(data => !search.value || data.name.toLowerCase().includes(search.value.toLowerCase()))
  // const filterName = XEUtils.toValueString(search.value).trim().toLowerCase()
  // if (filterName) {
  //   const filterRE = new RegExp(filterName, 'gi')
  //   const searchProps = ['name', 'desc']
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

const handleTrigger = (index, row) => {
  return openDialog(row)
}

// 弹窗相关
const dataForm = ref(null)
const initForm = () => {
  dataForm.value.resetFields()
  formData.value = {
    device: '',
    command: '',
    param: ''
  }
}

const openDialog = (row) => {
  dialogTitle.value = t('iot.deviceCommandDlgTitle')
  formData.value.device = props.device
  formData.value.command = row.name
  formData.value.param = '{}'
  dialogFormVisible.value = true
}

const closeDialog = () => {
  initForm()
  dialogFormVisible.value = false
}

const enterDialog = async() => {
  dataForm.value.validate(async valid => {
    if (valid) {
      const res = await send_command(formData.value)
      if (res.code === 0) {
        actionsStore.PushAction({ id: res.data.id, name: t('iot.actionCommand') + ` ${formData.value.command}`, data: formData.value.param })
        ElMessage({
          type: 'success',
          message: t('iot.deviceCommandReqSuccess'),
          showClose: true
        })
      }
      closeDialog()
    }
  })
}
</script>

<style lang="scss">
.keyword-lighten {
  color: #000;
  background-color: #FFFF00;
}
</style>

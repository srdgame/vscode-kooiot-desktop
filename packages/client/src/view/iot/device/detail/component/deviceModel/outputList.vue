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
        <el-form-item :label="t('iot.deviceOutput')" prop="output">
          <el-input v-model="formData.output" autocomplete="off" :disabled="true" />
        </el-form-item>
        <el-form-item :label="t('iot.devicePropName')" prop="prop">
          <el-input v-model="formData.prop" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="t('iot.outputDataValue')" prop="value">
          <el-input v-model="formData.value" autocomplete="off" />
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
  name: 'IotDeviceDetailDeviceModelOutputList',
}
</script>

<script setup>
import { send_output } from '@/api/local/device/data'
import { ElMessage, ElButton, ElTag, ElInput } from 'element-plus'
// import XEUtils from 'xe-utils'
import { computed, h, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
const dialogTitle = ref('')
const dialogFormVisible = ref(false)
const formData = ref({
  device: '',
  output: '',
  prop: 'value',
  value: ''
})
const rules = ref({
  prop: [{ required: true, message: t('iot.enterPropNameTip'), trigger: 'blur' }],
  value: [
    { required: true, message: t('iot.enterOuputDataTip'), trigger: 'blur' }
  ]
})

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
  { key: 'operations', title: t('general.operations'), width: 150, minWidth: 120, align: 'center', cellRenderer: ({ rowIndex, rowData }) =>
    h(
      ElButton,
      { type: 'primary', onClick: () => handleWrite(rowIndex, rowData) },
      { default: () => t('iot.outputWrite') },
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

const formatVT = (vt) => {
  return vt !== null && vt !== '' ? vt : 'float'
}

const handleWrite = (index, row) => {
  return openDialog(row)
}

const dataForm = ref(null)
const initForm = () => {
  dataForm.value.resetFields()
  formData.value = {
    device: '',
    output: '',
    prop: 'value',
    value: ''
  }
}

const closeDialog = () => {
  initForm()
  dialogFormVisible.value = false
}

const openDialog = (row) => {
  dialogTitle.value = t('iot.outputWriteDlgTitle')
  formData.value.device = props.device
  formData.value.output = row.name
  formData.value.prop = 'value'
  dialogFormVisible.value = true
}

const enterDialog = async() => {
  dataForm.value.validate(async valid => {
    if (valid) {
      const res = await send_output(formData.value)
      if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: t('iot.outputDataWriteSuccess'),
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


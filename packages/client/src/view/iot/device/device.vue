<template>
  <div v-loading.fullscreen.lock="loading">
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <el-form-item :label="t('iot.name')">
          <el-input v-model="searchInfo.name" :placeholder="t('iot.name')" />
        </el-form-item>
        <el-form-item :label="t('general.description')">
          <el-input v-model="searchInfo.description" :placeholder="t('general.description')" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="openDialog('add')">{{ t('general.add') }}</el-button>
          <el-button type="primary" icon="search" @click="onSubmit">{{ t('general.search') }}</el-button>
          <el-button icon="refresh" @click="onReset">{{ t('general.reset') }}</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="gva-table-box">
      <div style="width: 100%; height: 600px">
        <el-auto-resizer>
          <template #default="{ height, width }">
            <el-table-v2
              :columns="columns"
              :data="tableData"
              :width="width"
              :height="height"
              raw-key="sn"
            />
          </template>
        </el-auto-resizer>
      </div>
    </div>

    <el-dialog v-model="dialogFormVisible" :before-close="closeDialog" :title="dialogTitle">
      <el-form ref="dataForm" :inline="true" :model="formData" :rules="rules" label-width="120px">
        <el-form-item :label="t('iot.name')" prop="name">
          <el-input v-model.trim="formData.name" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="t('general.description')" prop="desc">
          <el-input v-model.trim="formData.desc" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="t('iot.address')" prop="host">
          <el-input v-model.trim="formData.host" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="t('iot.port')" prop="port">
          <el-input v-model.number="formData.port" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="t('iot.user')" prop="user">
          <el-input v-model.trim="formData.user" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="t('iot.password')" prop="password">
          <el-input v-model.trim="formData.password" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="t('iot.enableCloudAuth')" prop="cloudAuth">
          <el-switch v-model="formData.cloudAuth" />
        </el-form-item>
        <el-form-item :label="t('iot.serialNumber')" prop="sn" style="width: 100%">
          <el-input :disabled="type==='edit'" v-model.trim="formData.sn" autocomplete="off" />
          <el-button v-if="type==='add'" plain type="primary" style="margin-left: 5px" @click="fetchSN()">{{ t('iot.fetchDeviceSN') }}</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button v-if="formData.online" :disabled="!hasValidDevice" plain type="danger" @click="switchToCloud(true)">{{ t('iot.switchToCloud') }}</el-button>
          <el-button v-else :disabled="!hasValidDevice" plain type="danger" @click="switchToCloud(false)">{{ t('iot.switchToLocal') }}</el-button>
          <el-button @click="closeDialog">{{ t('iot.cancel') }}</el-button>
          <el-button type="primary" @click="enterDialog"> {{ t('iot.confirm') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'StoreAppCachedList',
}
</script>

<script setup>
import {
  create_device,
  get_device,
  update_device,
  delete_device,
  get_device_list
} from '@/api/local/device'
import {
  switch_cloud,
  fetch_device_info,
} from '@/api/local/device/sys'
import { formatTimeToStr } from '@/utils/date'
import { computed, h, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElButton, ElButtonGroup, ElMessage, ElMessageBox, ElTag } from 'element-plus'

const { t } = useI18n()

const router = useRouter()

const tableData = ref([])
const searchInfo = ref({})
const loading = ref(false)

const formData = ref({
  name: '',
  desc: '',
  host: '',
  port: 8818,
  cloudAuth: false,
  sn: '',
  user: 'admin',
  password: 'admin1',
})

const hasValidDevice = computed(() => {
  return formData.value.sn && formData.value.sn.length > 0
})

const type = ref('')
const rules = ref({
  name: [{ required: true, message: t('iot.enterName'), trigger: 'blur' }],
  desc: [{ required: true, message: t('iot.enterDescriptionTip'), trigger: 'blur' }],
  host: [{ required: true, message: t('iot.enterHostTip'), trigger: 'blur' }],
  port: [{ required: true, message: t('iot.enterPortTip'), trigger: 'blur' }],
  user: [{ required: true, message: t('iot.enterUserTip'), trigger: 'blur' }],
  password: [{ required: true, message: t('iot.enterPasswordTip'), trigger: 'blur' }],
})

const columns = [
  { key: 'sn', dataKey: 'sn', title: t('iot.serialNumber'), width: 160, flexGrow: 1 },
  { key: 'name', dataKey: 'name', title: t('iot.name'), width: 180, flexGrow: 1 },
  { key: 'desc', dataKey: 'desc', title: t('general.description'), width: 240, flexGrow: 1 },
  { key: 'host', dataKey: 'host', title: t('iot.address'), width: 120 },
  { key: 'port', dataKey: 'port', title: t('iot.port'), width: 50 },
  { key: 'online', dataKey: 'online', title: t('iot.status'), width: 120, align: 'center', cellRenderer: ({ cellData }) =>
    h(
      ElTag,
      { type: cellData ? 'success' : 'warning', title: cellData ? t('iot.online') : t('iot.offline') },
      () => cellData ? t('iot.online') : t('iot.offline'),
    )
  },
  { key: 'online_time', dataKey: 'online_time', title: t('iot.onlineTime'), width: 180, cellRenderer: ({ cellData }) =>
    h(
      'div',
      { title: formatDate(cellData) },
      { default: () => formatDate(cellData) },
    )
  },
  { key: 'operations', title: t('general.operations'), width: 150, minWidth: 200, cellRenderer: ({ rowIndex, rowData }) =>
    h(
      ElButtonGroup, [
        h(ElButton,
          { link: true, type: 'primary', icon: 'View', onClick: () => viewRow(rowIndex, rowData) },
          { default: () => t('iot.view') },
        ),
        h(ElButton,
          { link: true, type: 'primary', icon: 'Edit', onClick: () => editRow(rowIndex, rowData) },
          { default: () => t('general.edit') },
        ),
        h(ElButton,
          { link: true, type: 'danger', icon: 'Delete', onClick: () => removeRow(rowIndex, rowData) },
          { default: () => t('general.delete') },
        ),
      ]
    )
  }
]

const formatDate = (time) => {
  return formatTimeToStr(time)
}

const onReset = () => {
  searchInfo.value = {}
}
// 搜索

const onSubmit = () => {
  getTableData()
}

// 查询
const getTableData = async() => {
  const table = await get_device_list(searchInfo.value)
  if (table.code === 0) {
    tableData.value = table.data.list
  }
}

onMounted(async() => {
  getTableData()
})

// 弹窗相关
const dataForm = ref(null)
const initForm = () => {
  dataForm.value.resetFields()
  formData.value = {
    name: '',
    desc: '',
    host: '',
    port: 8818,
    cloudAuth: false,
    sn: '',
    user: 'admin',
    password: 'admin1',
  }
}

const dialogTitle = ref('')
const dialogFormVisible = ref(false)
const openDialog = (key) => {
  switch (key) {
    case 'add':
      dialogTitle.value = t('iot.addGateway')
      break
    case 'edit':
      dialogTitle.value = t('iot.editGatewayDlgTitle')
      break
    default:
      break
  }
  type.value = key
  dialogFormVisible.value = true
}
const closeDialog = () => {
  initForm()
  dialogFormVisible.value = false
}

const editRow = async(rowIndex, row) => {
  const res = await get_device({ sn: row.sn })
  formData.value = res.data.device
  openDialog('edit')
}

const enterDialog = async() => {
  dataForm.value.validate(async valid => {
    if (valid) {
      switch (type.value) {
        case 'add':
          {
            const res = await create_device(formData.value)
            if (res.code === 0) {
              ElMessage({
                type: 'success',
                message: t('general.addSuccess'),
                showClose: true
              })
            }
            getTableData()
            closeDialog()
          }

          break
        case 'edit':
          {
            const res = await update_device(formData.value)
            if (res.code === 0) {
              ElMessage({
                type: 'success',
                message: t('general.editSuccess'),
                showClose: true
              })
            }
            getTableData()
            closeDialog()
          }
          break
        default:
          // eslint-disable-next-line no-lone-blocks
          {
            ElMessage({
              type: 'error',
              message: t('iot.unknownOperation'),
              showClose: true
            })
          }
          break
      }
    }
  })
}

const fetchSN = async() => {
  dataForm.value.validate(async valid => {
    if (valid) {
      loading.value = true
      const res = await fetch_device_info({
        host: formData.value.host,
        port: formData.value.port,
        user: formData.value.user,
        password: formData.value.password
      })
      console.log(res.data)
      loading.value = false
      if (res.code === 0) {
        if (res.data?.device?.cfg?.cloud?.ID) {
          const sn = res.data?.device?.cfg?.cloud?.ID
          const index = tableData.value.findIndex(dev => dev.sn === sn)
          if (index !== -1) {
            ElMessage({
              type: 'error',
              message: '设备' + sn + '已经添加，无法再次添加'
            })
          } else {
            formData.value.sn = sn
            ElMessage({
              type: 'success',
              message: '获取设备SN:' + sn
            })
          }
        }
      } else {
        ElMessage({
          type: 'error',
          message: res.msg || t('general.editFailed')
        })
      }
    } else {
      ElMessage({
        type: 'error',
        message: '请填写设备基本信息'
      })
    }
  })
}

const switchToCloud = async(toCloud) => {
  dataForm.value.validate(async valid => {
    if (valid) {
      if (formData.value.sn && formData.value.sn !== '') {
        await _switchToCloud(toCloud)
      }
    }
  })
}

const _switchToCloud = async(toCloud) => {
  if (toCloud) {
    ElMessageBox.confirm('确定切换设备到云平台吗?', t('general.hint'), {
      confirmButtonText: t('general.confirm'),
      cancelButtonText: t('general.cancel'),
      type: 'warning'
    })
      .then(async() => {
        loading.value = true
        const res = await switch_cloud({})
        loading.value = false
        if (res.code === 0) {
          ElMessage({
            type: 'success',
            message: t('general.updateSuccess')
          })
          getTableData()
        }
      })
  } else {
    ElMessageBox.prompt('请输入本地IP(注意需要是网关能连接上的IP)', t('general.hint'), {
      confirmButtonText: t('general.confirm'),
      cancelButtonText: t('general.cancel'),
      inputPattern: /\S/,
      inputErrorMessage: '不能为空',
      inputValue: window.localStorage.getItem('device.switchHost') || '',
    }).then(async({ value }) => {
      window.localStorage.setItem('device.switchHost', value)
      loading.value = true
      const res = await switch_cloud({
        cloud: value,
        host: formData.value.host,
        port: formData.value.port,
        user: formData.value.user,
        password: formData.value.password
      })
      loading.value = false
      if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: res.msg || t('general.updateSuccess')
        })
      } else {
        ElMessage({
          type: 'error',
          message: res.msg || t('general.editFailed')
        })
      }
    }).catch(() => {
      ElMessage({
        type: 'info',
        message: '取消修改'
      })
    })
  }
}

const viewRow = (index, row) => {
  router.push({
    name: 'iot.device.detail',
    params: {
      sn: row.sn
    }
  })
}

const removeRow = (index, row) => {
  ElMessageBox.confirm(t('iot.deleteGatewayConfirmMsg'), t('general.hint'), {
    confirmButtonText: t('general.confirm'),
    cancelButtonText: t('general.cancel'),
    type: 'warning'
  })
    .then(async() => {
      const res = await delete_device(row)
      if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: t('general.deleteSuccess')
        })
        getTableData()
      }
    })
}

</script>

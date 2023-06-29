<template>
  <div>
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
              raw-key="ID"
            />
          </template>
        </el-auto-resizer>
      </div>
    </div>

    <el-dialog v-model="dialogFormVisible" :before-close="closeDialog" :title="dialogTitle">
      <el-form ref="dataForm" :inline="true" :model="formData" :rules="rules" label-width="120px">
        <el-form-item :label="t('iot.appID')" prop="app_id">
          <el-input v-model.trim="formData.app_id" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="t('iot.name')" prop="name">
          <el-input v-model.trim="formData.name" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="t('general.description')" prop="description">
          <el-input v-model.trim="formData.description" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="t('iot.store.appLocalFolder')" prop="local_folder">
          <el-input v-model.trim="formData.local_folder" autocomplete="off" />
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
  name: 'StoreAppCachedList',
}
</script>

<script setup>
import {
  create_app,
  get_app,
  update_app,
  delete_app,
  get_app_list
} from '@/api/local/user_app'
import { h, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElButton, ElButtonGroup, ElMessage, ElMessageBox } from 'element-plus'

const { t } = useI18n()

const tableData = ref([])
const searchInfo = ref({})

const formData = ref({
  app_id: '',
  name: '',
  description: '',
  local_folder: '',
})

const type = ref('')
const rules = ref({
  app_id: [{ required: true, message: t('iot.store.enterAppIDTip'), trigger: 'blur' }],
  name: [{ required: true, message: t('iot.store.enterAppNameTip'), trigger: 'blur' }],
  description: [
    { required: true, message: t('iot.enterDescriptionTip'), trigger: 'blur' }
  ],
  local_folder: [
    { required: true, message: t('iot.store.enterAppLocalFolderTip'), trigger: 'blur' }
  ]
})

const columns = [
  { key: 'app_id', dataKey: 'app_id', title: t('iot.appID'), width: 180 },
  { key: 'name', dataKey: 'name', title: t('iot.name'), width: 120, flexGrow: 1 },
  { key: 'description', dataKey: 'description', title: t('general.description'), width: 180, flexGrow: 1 },
  { key: 'local_folder', dataKey: 'local_folder', title: t('iot.store.appLocalFolder'), width: 240, flexGrow: 1 },
  { key: 'operations', title: t('general.operations'), width: 200, cellRenderer: ({ rowIndex, rowData }) =>
    h(
      ElButtonGroup, [
        h(ElButton,
          // { type: 'danger', icon: 'Delete', onClick: () => handleView(rowIndex, cellData) },
          { link: true, type: 'primary', icon: 'View', onClick: () => installApp(rowIndex, rowData) },
          { default: () => t('iot.store.install') },
        ),
        h(ElButton,
          { link: true, type: 'primary', icon: 'Edit', onClick: () => editApp(rowIndex, rowData) },
          { default: () => t('general.edit') },
        ),
        h(ElButton,
          { link: true, type: 'danger', icon: 'Delete', onClick: () => removeApp(rowIndex, rowData) },
          { default: () => t('general.delete') },
        ),
      ]
    )
  }
]

const onReset = () => {
  searchInfo.value = {}
}
// 搜索

const onSubmit = () => {
  getTableData()
}

// 查询
const getTableData = async() => {
  const table = await get_app_list(searchInfo.value)
  if (table.code === 0) {
    tableData.value = table.data.list
  }
}

onMounted(async() => {
  getTableData()
})

const installApp = (index, row) => {
  ElMessage('TODO:')
}

const removeApp = (index, row) => {
  ElMessageBox.confirm('是否确定删除本地缓存应用?', t('general.hint'), {
    confirmButtonText: t('general.confirm'),
    cancelButtonText: t('general.cancel'),
    type: 'warning'
  })
    .then(async() => {
      const res = await delete_app(row)
      if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: t('general.deleteSuccess')
        })
        getTableData()
      }
    })
}

const editApp = async(index, row) => {
  const res = await get_app({ app_id: row.app_id })
  formData.value = res.data.app
  openDialog('edit')
}

// 弹窗相关
const dataForm = ref(null)
const initForm = () => {
  dataForm.value.resetFields()
  formData.value = {
    sn: '',
    name: '',
    description: '',
    enable: true,
    owner: {
      id: 0,
      group_id: 0,
    }
  }
}

const dialogTitle = ref('')
const dialogFormVisible = ref(false)
const openDialog = (key) => {
  switch (key) {
    case 'add':
      dialogTitle.value = t('iot.store.newApp')
      break
    case 'edit':
      dialogTitle.value = t('iot.store.appEdit')
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

const enterDialog = async() => {
  dataForm.value.validate(async valid => {
    if (valid) {
      switch (type.value) {
        case 'add':
          {
            const res = await create_app(formData.value)
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
            const res = await update_app(formData.value)
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
</script>

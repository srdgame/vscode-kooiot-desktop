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

    <el-dialog v-model="showVersionContent" :title="t('iot.store.templateContent')">
      <csv-file v-model="selectedVersion.tpl_content" view-only />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'StoreAppTemplateCachedList',
}
</script>

<script setup>
import {
  delete_template,
  update_template,
  get_template_list
} from '@/api/cached/template'
import {
  get_latest
} from '@/api/store/template_version'
import csvFile from './csvFile.vue'
import { h, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElButton, ElButtonGroup, ElMessage, ElMessageBox } from 'element-plus'

const { t } = useI18n()

const tableData = ref([])
const searchInfo = ref({})

const selectedVersion = ref({})
const showVersionContent = ref(false)

const columns = [
  { key: 'app.name', dataKey: 'app.name', title: t('iot.appName'), width: 180, flexGrow: 1 },
  { key: 'name', dataKey: 'name', title: t('iot.name'), width: 180, flexGrow: 1 },
  { key: 'description', dataKey: 'description', title: t('general.description'), width: 120, flexGrow: 1 },
  { key: 'cache_version', dataKey: 'cache_version', title: t('iot.store.version'), width: 80 },
  { key: 'download', dataKey: 'download', title: t('iot.store.appHot'), width: 80 },
  { key: 'operations', title: t('general.operations'), width: 240, cellRenderer: ({ rowIndex, rowData }) => {
    const has_upgrade = rowData.latest_version && rowData.latest_version > rowData.cache_version
    if (has_upgrade) {
      return h(
        ElButtonGroup, [
          h(ElButton,
            { link: true, type: 'warning', icon: 'Download', onClick: () => updateAppVersion(rowIndex, rowData) },
            { default: () => t('iot.upgrade') },
          ),
          h(ElButton,
            // { type: 'danger', icon: 'Delete', onClick: () => handleView(rowIndex, cellData) },
            { link: true, type: 'primary', icon: 'View', onClick: () => viewContent(rowIndex, rowData) },
            { default: () => t('iot.view') },
          ),
          h(ElButton,
            { link: true, type: 'danger', icon: 'Delete', onClick: () => removeRow(rowIndex, rowData) },
            { default: () => t('general.delete') },
          ),
        ]
      )
    } else {
      return h(
        ElButtonGroup, [
          h(ElButton,
            // { type: 'danger', icon: 'Delete', onClick: () => handleView(rowIndex, cellData) },
            { link: true, type: 'primary', icon: 'View', onClick: () => viewContent(rowIndex, rowData) },
            { default: () => t('iot.view') },
          ),
          h(ElButton,
            { link: true, type: 'danger', icon: 'Delete', onClick: () => removeRow(rowIndex, rowData) },
            { default: () => t('general.delete') },
          ),
        ]
      )
    }
  } }
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
  const table = await get_template_list(searchInfo.value)
  if (table.code === 0) {
    tableData.value = table.data.list
    checkAllVersion(tableData.value)
  }
}

onMounted(async() => {
  await getTableData()
})

const loadVersion = async(app_id) => {
  const res = await get_latest({ ID: app_id })
  if (res.code === 0) {
    if (res.data?.version) {
      return res.data.version
    }
  }
  return 0
}

const checkAllVersion = async(apps) => {
  for (let index = 0; index < apps.length; index++) {
    const latest = await loadVersion(apps[index].ID)
    apps[index].latest_version = latest.version
  }
}

const removeRow = (index, row) => {
  ElMessageBox.confirm('是否确定删除本地缓存应用?', t('general.hint'), {
    confirmButtonText: t('general.confirm'),
    cancelButtonText: t('general.cancel'),
    type: 'warning'
  })
    .then(async() => {
      const res = await delete_template(row)
      if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: t('general.deleteSuccess')
        })
        getTableData()
      }
    })
}

const viewContent = function(index, row) {
  selectedVersion.value = row
  showVersionContent.value = true
}

const updateAppVersion = async(index, row) => {
  const latest = await loadVersion(row.ID)

  ElMessageBox.confirm('确定升级应用到版本 ' + latest.version + '?', t('general.hint'), {
    confirmButtonText: t('general.confirm'),
    cancelButtonText: t('general.cancel'),
    type: 'warning'
  })
    .then(async() => {
      row.tpl_content = latest.content
      row.cache_version = latest.version
      const res = await update_template(row)
      if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: t('general.updateSuccess')
        })
        getTableData()
      }
    })
}
</script>

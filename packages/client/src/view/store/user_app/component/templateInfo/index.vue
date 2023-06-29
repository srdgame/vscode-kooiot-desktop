<template>
  <div>
    <div class="clearflex" :style="{padding:'10px'}">
      <div :style="{display:'inline-block',float:'right'}">
        <el-button type="primary" icon="refresh-right" @click="onSubmit">{{ t('iot.store.refresh') }}</el-button>
        <el-button type="primary" icon="plus" @click="openDialog('add')">{{ t('iot.store.uploadNewVersion') }}</el-button>
      </div>
    </div>
    <div class="block" :style="{padding:'10px', paddingTop:'20px'}">
      <div v-if="tableData.length == 0" class="warning">{{ t('iot.store.versionEmptyPleaseUpload') }}</div>
      <el-timeline>
        <el-timeline-item
          v-for="version in tableData"
          :key="version.ID"
          :timestamp="formatDate(version.CreatedAt)"
          :color="version.beta?'#e6a23c':'#0bbd87'"
          placement="top"
        >
          <el-card>
            <template #header>
              {{ t('iot.store.version') }}: {{ version.version }}  <time class="time">{{ formatDate(version.CreatedAt) }}</time>
              <el-button-group class="button-group">
                <el-button link type="primary" icon="download" @click="downloadContent(version)">{{ t('iot.store.downloadTemplate') }}</el-button>
                <el-button link type="success" @click="viewContent(version)">{{ t('iot.store.viewTemplateContent') }}</el-button>
              </el-button-group>
            </template>
            {{ version.comment }}
            <!-- <div class="bottom clearfix">
              <time class="time">{{ version.CreatedAt }}</time>
            </div> -->
          </el-card>
        </el-timeline-item>
      </el-timeline>

    </div>
    <div class="gva-pagination">
      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :page-sizes="[10, 30, 50, 100]"
        :style="{float:'right',padding:'20px'}"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>

    <el-dialog v-model="dialogFormVisible" :before-close="closeDialog" :title="dialogTitle">
      <el-form
        ref="dataForm"
        :inline="true"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item :disabled="isEdit" :label="t('iot.store.version')" prop="version">
          <el-input v-model.number="formData.version" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="t('iot.store.versionComment')" prop="comment" style="width: 100%">
          <el-input v-model="formData.comment" type="textarea" :autosize="{ minRows: 2, maxRows: 12}" />
        </el-form-item>
        <el-form-item :label="t('iot.store.templateContent')" prop="content" style="width: 100%">
          <csv-file v-model="formData.content" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">{{ t('iot.cancel') }}</el-button>
          <el-button type="primary" @click="enterDialog"> {{ t('iot.confirm') }}</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="showVersionContent" :title="t('iot.store.templateContent')">
      <csv-file v-model="selectedVersion.content" view-only />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'StoreUserAppTemplateInfo',
}
</script>

<script setup>
import {
  create_version,
  delete_version,
  update_version,
  get_version,
  get_version_list
} from '@/api/store/template_version'
import csvFile from './csvFile.vue'
import { saveAs } from 'file-saver'
import { formatTimeToStr } from '@/utils/date'
import { onMounted, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const formatDate = (time) => {
  if (time !== null && time !== '') {
    var date = new Date(time)
    return formatTimeToStr(date, t('iot.timestampFormat'))
  } else {
    return ''
  }
}

const props = defineProps({
  template: {
    default: function() {
      return {}
    },
    required: true,
    type: Object
  }
})

console.log(props.template)

const formData = ref({
  template_id: props.template?.ID,
  version: 0,
  comment: '',
  content: ''
})

const type = ref('')
const rules = ref({
  version:
  [
    { required: true, message: t('iot.store.enterVersionNumber') },
    { type: 'number', message: t('iot.store.versionMustBeNumber') }
  ],
  comment: [{ required: true, message: t('iot.store.enterVersionComment'), trigger: 'blur' }],
  content: [{ required: true, message: t('iot.store.enterVersionComment'), trigger: 'blur' }]
})

const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const searchInfo = ref({})

// 搜索

const onSubmit = () => {
  page.value = 1
  pageSize.value = 10
  getTableData()
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData()
}

const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}

// 查询
const getTableData = async() => {
  const table = await get_version_list({ page: page.value, pageSize: pageSize.value, ...searchInfo.value })
  if (table.code === 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}

// 弹窗相关
const dataForm = ref(null)
const initForm = () => {
  dataForm.value.resetFields()
  formData.value = {
    template_id: props.template?.ID,
    version: 0,
    comment: '',
    content: ''
  }
}

const dialogTitle = ref('')
const dialogFormVisible = ref(false)
const openDialog = (key) => {
  switch (key) {
    case 'add':
      dialogTitle.value = t('iot.store.uploadNewVersion')
      break
    case 'edit':
      dialogTitle.value = t('iot.store.editVersion')
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

// eslint-disable-next-line no-unused-vars
const editRow = async(row) => {
  const res = await get_version({ ID: row.ID })
  formData.value = res.data.version
  openDialog('edit')
}

const enterDialog = async() => {
  dataForm.value.validate(async valid => {
    if (valid) {
      switch (type.value) {
        case 'add':
          {
            formData.value.template_id = props.template?.ID
            const res = await create_version(formData.value)
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
            const res = await update_version(formData.value)
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

// eslint-disable-next-line no-unused-vars
const deleteRow = async(row) => {
  ElMessageBox.confirm(t('iot.store.deleteTemplateVersionConfirmMsg'), t('general.hint'), {
    confirmButtonText: t('general.confirm'),
    cancelButtonText: t('general.cancel'),
    type: 'warning'
  })
    .then(async() => {
      const res = await delete_version(row)
      if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: t('general.deleteSuccess')
        })
        if (tableData.value.length === 1 && page.value > 1) {
          page.value--
        }
        getTableData()
      }
    })
}

const isEdit = ref(false)
const selectedVersion = ref({})
const showVersionContent = ref(false)

watch(() => props.template, function(newValue, oldValue) {
  // console.log(newValue)
  if (newValue && formData.value.template_id !== newValue.ID) {
    formData.value.template_id = newValue.ID
    searchInfo.value.template_id = newValue.ID
    onSubmit()
  }
})

onMounted(async() => {
  props.template ? formData.value.template_id = props.template.ID : null
  props.template ? searchInfo.value.template_id = props.template.ID : null
  props.template ? await getTableData() : null
})

const viewContent = function(row) {
  selectedVersion.value = row
  showVersionContent.value = true
}

const downloadContent = function(row) {
  const strData = new Blob([row.content], { type: 'text/csv;charset = utf-8' })
  const fileName = props.template.name + '.' + row.version + '.csv'
  saveAs(strData, fileName)
}

// const convertCreateTimestamp = function(timestamp) {
//   return new Date(timestamp).toDateString()
// }
</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .warning {
    padding: 10px;
    color: #dc143c;
  }

  .el-card .time {
    padding-left: 10px;
    font-size: 13px;
    color: #999;
  }

  .el-card .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .el-card .button-group {
    padding: 0;
    float: right;
  }

  .el-card .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }

  .clearfix:after {
      clear: both
  }
</style>


<template>
  <!-- <div style="border: 1px solid #cccccc;padding: 10px"> -->
  <div>
    <el-form :inline="true">
      <el-form-item>
        <el-button type="primary" plain icon="search" @click="onSelectFromStore">{{ t('iot.selectFromStore') }}</el-button>
        <el-button type="danger" plain icon="delete" @click="onClean">{{ t('iot.clean') }}</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="inputValue"
      style="width: 100%;margin-bottom: 0px"
      border
    >
      <el-table-column label="ID" width="75" prop="id" sortable />
      <el-table-column :label="t('iot.name')" width="160" prop="name" sortable />
      <el-table-column :label="t('general.description')" min-width="260" prop="description" />
      <el-table-column :label="t('iot.store.version')" width="60" prop="ver" />
      <el-table-column :label="t('general.operations')" min-width="140">
        <template #default="scope">
          <el-button-group>
            <el-button
              type="primary"
              icon="edit"
              link
              @click="editResult(scope.row)"
            >{{ t('general.edit') }}</el-button>
            <el-popover :visible="scope.row.__visible" trigger="click" placement="top" :width="160">
              <p>{{ t('general.deleteConfirm') }}</p>
              <div style="text-align: right; margin-top: 8px;">
                <el-button size="small" text @click="deleteCancel(scope.row)">取消</el-button>
                <el-button size="small" type="primary" @click="deleteResult(scope.row)">确定</el-button>
              </div>
              <template #reference>
                <el-button
                  type="danger"
                  icon="delete"
                  link
                  @click="scope.row.__visible = true"
                >
                  {{ t('general.delete') }}
                </el-button>
              </template>
            </el-popover>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogFormVisible" :before-close="closeDialog" :title="dialogTitle">
      <el-form ref="dataForm" :inline="true" :model="formData" :rules="rules" label-width="120px">
        <el-form-item :label="t('iot.name')" prop="name">
          <el-input v-model="formData.name" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="t('general.description')" prop="description">
          <el-input v-model="formData.description" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="t('iot.store.version')" prop="ver">
          <el-input v-model.number="formData.ver" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">{{ t('iot.cancel') }}</el-button>
          <el-button type="primary" @click="enterDialog"> {{ t('iot.confirm') }}</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="dialogFromStoreVisiable" :before-close="closeFromStoreDlg" :title="t('iot.selectFromStore')">
      <div v-if="hasSearch" style="dispaly:inline">
        <el-form ref="searchForm" :inline="true" :model="searchInfo" :style="{paddingBottom:'5px', paddingLeft:'10px'}">
          <el-form-item :label="t('iot.name')">
            <el-input v-model="searchInfo.name" icon="search" clearable :placeholder="t('iot.enterName')" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="search" @click="onSubmit">{{ t('general.search') }}</el-button>
            <el-button type="primary" icon="select" :disabled="!multipleSelection.length" @click="selectItems">{{ t('iot.addSelectedItems') }}</el-button>
            <el-button type="danger" icon="close" @click="closeFromStoreDlg">{{ t('iot.closed') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        ref="storeTplsTable"
        :data="storeTpls"
        border
        height="360"
        style="width: 100%;margin-bottom: 0px"
        @sort-change="sortChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed type="selection" width="50" />
        <el-table-column :label="t('iot.name')" min-width="120" prop="name" sortable="custom" />
        <el-table-column :label="t('general.description')" min-width="240" prop="description" sortable="custom" />
      </el-table>
      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :page-sizes="[10, 30, 50, 100]"
        :style="{width:'100%', padding:'20px'}"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ConfigUITemplates',
}
</script>

<script setup>
import { get_template_list } from '@/api/store/template'
import { get_latest } from '@/api/store/template_version'
import { toSQLLine } from '@/utils/stringFun'
import { onMounted, nextTick, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  meta: {
    default: () => {},
    type: Object,
    required: true
  },
  info: {
    default: () => {},
    type: Object
  },
  modelValue: {
    default: () => [],
    type: Array
  }
})

// const internalChange = ref(false)
const dataForm = ref(null)
const hasSearch = ref(true)
// const listApi: get_template_list,
const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const searchInfo = ref({ app_id: props.info?.app?.ID })
const multipleSelection = ref([])
// const resultData = ref([])
// const resultChangeOut = ref(false)
const dialogFormVisible = ref(false)
const dialogTitle = ref(t('iot.store.editTemplateInformation'))
const dialogFromStoreVisiable = ref(false)
const formData = ref({
  _idx: 0,
  id: 0,
  name: '',
  description: '',
  ver: 0
})
const inputValue = ref(props.modelValue)
const storeTpls = ref([])
const storeTplsTable = ref()

const rules = ref({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  description: [
    { required: true, message: '请输入介绍', trigger: 'blur' }
  ],
  ver: [
    { required: true, message: '请输入版本', trigger: 'blur' }
  ]
})

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData()
}

const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}

const onSubmit = () => {
  if (props.info?.app) {
    page.value = 1
    searchInfo.value.app_id = props.info?.app?.ID
    getTableData()
  }
}

// 排序
const sortChange = ({ prop, order }) => {
  if (prop) {
    if (prop === 'ID') {
      prop = 'id'
    }
    searchInfo.value.orderKey = toSQLLine(prop)
    searchInfo.value.orderDesc = order === 'descending'
  }
  getTableData()
}

// 查询
const getTableData = async() => {
  const table = await get_template_list({ page: page.value, pageSize: pageSize.value, ...searchInfo.value })
  if (table.code === 0) {
    storeTpls.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}

const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

const selectItems = async() => {
  if (inputValue.value.length > props.meta?.limit) {
    ElMessage({
      type: 'error',
      message: t('iot.store.canNotSelectMoreTemplateErr')
    })
    return
  }
  multipleSelection.value.map(async item => {
    const res = await get_latest({ ID: item.ID })
    if (res.code === 0) {
      var i = 1
      inputValue.value.forEach(item => {
        if (item._idx >= i) {
          i = item._idx + 1
        }
      })
      if (inputValue.value.length >= props.meta?.limit) {
        ElMessage({
          type: 'error',
          message: t('iot.store.canNotSelectMoreTemplateErr')
        })
        return
      }
      const index = inputValue.value.findIndex(it => {
        return it.id === item.ID && it.ver === res.data.version.version
      })
      if (index === -1) {
        inputValue.value.push({
          _idx: i,
          id: item.ID,
          name: item.name,
          description: item.description,
          ver: res.data.version.version
        })
      } else {
        ElMessage({
          type: 'error',
          message: t('iot.templateAlreadyAdded') + ' : ' + item.name
        })
      }
    } else {
      // console.log(res.data)
      ElMessage({
        type: 'error',
        message: t('iot.store.fetchTemplateLastestVersionFailedErr')
      })
    }
  })
  storeTplsTable.value.clearSelection()
}

const onClean = () => {
  ElMessageBox.confirm(t('iot.clearAllSelectedTemplates'), t('general.hint'), {
    confirmButtonText: t('general.confirm'),
    cancelButtonText: t('general.cancel'),
    type: 'warning'
  })
    .then(async() => {
      inputValue.value = []
    })
}

const onSelectFromStore = () => {
  dialogFromStoreVisiable.value = true
}

const closeFromStoreDlg = () => {
  dialogFromStoreVisiable.value = false
}

const initForm = () => {
  dataForm.value.resetFields()
  formData.value = {
    _idx: 0,
    id: 0,
    name: '',
    description: '',
    ver: 0
  }
}

const closeDialog = () => {
  initForm()
  dialogFormVisible.value = false
}

const editResult = (row) => {
  formData.value = {
    _idx: row._idx,
    id: row.id,
    name: row.name,
    description: row.description,
    ver: row.ver
  }
  // formData.value = row
  dialogTitle.value = t('iot.store.editTemplateInformation')
  dialogFormVisible.value = true
}

const deleteCancel = (row) => {
  row.__visible = false
  nextTick(_ => {
    delete row['__visible']
  })
}

const deleteResult = (row) => {
  row.__visible = false
  const index = inputValue.value.findIndex(item => item._idx === row._idx)
  if (index !== -1) {
    inputValue.value.splice(index, 1)
  }
}

const enterDialog = async() => {
  dataForm.value.validate(async valid => {
    if (valid) {
      const index = inputValue.value.findIndex(item => item._idx === formData.value._idx)
      if (index !== -1) {
        inputValue.value[index].name = formData.value.name
        inputValue.value[index].description = formData.value.description
        inputValue.value[index].ver = formData.value.ver
        ElMessage({
          type: 'success',
          message: t('general.editSuccess')
        })
      } else {
        ElMessage({
          type: 'error',
          message: t('general.editFailed')
        })
      }
      closeDialog()
    }
  })
}

onMounted(async() => {
  getTableData()
})

</script>

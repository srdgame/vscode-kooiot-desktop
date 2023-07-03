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
      <el-table :data="tableData" border stripe @sort-change="sortChange">
        <el-table-column :label="t('iot.name')" min-width="200" prop="name" sortable="custom" />
        <el-table-column :label="t('general.description')" min-width="200" prop="description" sortable="custom" />
        <el-table-column :label="t('iot.store.developer')" min-width="100" prop="user.userName" sortable="custom" />
        <el-table-column :label="t('iot.store.tags')" prop="tags" min-width="180">
          <template #default="scope">
            <el-tag
              v-for="tag in scope.row.tags"
              :key="tag.ID"
              disable-transitions
            > {{ tag.label }} </el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" :label="t('general.operations')" width="240">
          <template #default="scope">
            <el-button-group>
              <el-button
                type="success"
                icon="view"
                link
                @click="viewRow(scope.row)"
              > {{ t('iot.view') }} </el-button>
              <el-button
                v-if="showSelect"
                type="success"
                icon="plus"
                link
                @click="selectRow(scope.row)"
              > {{ t('iot.select') }} </el-button>
              <el-button
                type="primary"
                icon="download"
                link
                @click="cacheTemplte(scope.row)"
              > {{ t('iot.store.cache') }} </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'StoreUserAppTemplateList',
}
</script>

<script setup>
import {
  get_template_list,
} from '@/api/store/template'
import {
  get_latest
} from '@/api/store/template_version'
import {
  create_template
} from '@/api/cached/template'
import { toSQLLine } from '@/utils/stringFun'
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits(['on-select', 'show-template'])
const props = defineProps({
  meta: {
    default: function() {
      return {}
    },
    required: true,
    type: Object
  },
  showSelect: {
    type: Boolean,
    default: false
  },
  modelValue: {
    default: function() {
      return {}
    },
    required: true,
    type: Object
  }
})

const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const searchInfo = ref({
  app_id: props.modelValue.ID
})

const onReset = () => {
  searchInfo.value = {}
}
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
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}

onMounted(async() => {
  searchInfo.value.app_id = props.modelValue.ID
  getTableData()
})

watch(() => props.modelValue.ID, (val, old_val) => {
  if (val !== old_val) {
    searchInfo.value.app_id = props.modelValue.ID
    getTableData()
  }
})

const selectRow = function(row) {
  emit('on-select', props.meta, row.ID)
}

const viewRow = async(row) => {
  emit('show-template', row)
}

const loadVersion = async(tpl_id) => {
  const res = await get_latest({ ID: tpl_id })
  if (res.code === 0) {
    if (res.data?.version) {
      return res.data.version
    }
  }
  return 0
}

const cacheTemplte = async(row) => {
  const version = await loadVersion(row.ID)
  if (version.version === 0) {
    ElMessage({
      type: 'error',
      message: '应用没有可缓存的版本文件'
    })
    return
  }
  row.cache_version = version.version
  row.tpl_content = version.content
  row.progress = 0
  const res = await create_template(row)
  if (res.code === 0) {
    ElMessage({
      type: 'success',
      message: '缓存成功'
    })
  } else {
    ElMessage({
      type: 'error',
      message: '缓存失败'
    })
  }
}
</script>


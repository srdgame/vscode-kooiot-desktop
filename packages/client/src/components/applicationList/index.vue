<template>
  <div>
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
    <el-table :data="tableData" border stripe @sort-change="sortChange">
      <el-table-column fixed label="ID" min-width="70" prop="id" sortable="custom" />
      <el-table-column :label="t('iot.name')" min-width="120" prop="name" sortable="custom" />
      <el-table-column :label="t('general.description')" min-width="200" prop="description" show-overflow-tooltip />
      <el-table-column :label="t('iot.store.developer')" min-width="100" prop="owner_id" sortable="custom" />
      <el-table-column :label="t('iot.store.version')" min-width="80" prop="version" sortable="custom" />

      <el-table-column fixed="right" :label="t('general.operations')" width="160">
        <template #default="scope">
          <el-button-group>
            <el-button
              v-if="showSelect"
              type="success"
              icon="view"
              link
              @click="viewRow(scope.row)"
            >
              {{ t('iot.appDetail') }}
            </el-button>
            <el-button
              v-if="showSelect"
              type="primary"
              icon="check"
              link
              @click="selectRow(scope.row)"
            >
              {{ t('iot.select') }}
            </el-button>
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
</template>

<script>
export default {
  name: 'ApplicationList',
}
</script>

<script setup>
// 获取列表内容封装在mixins内部  getTableData方法 初始化已封装完成 条件搜索时候 请把条件安好后台定制的结构体字段 放到 this.searchInfo 中即可实现条件搜索
import {
  get_app_list,
} from '@/api/store/user_app'
import { ref, watch, onMounted } from 'vue'
import { toSQLLine } from '@/utils/stringFun'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

const emit = defineEmits(['onSelect', 'update:modelValue'])
const props = defineProps({
  modelValue: {
    default: function() {
      return []
    },
    type: Array
  }
})

const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref(props.modelValue)
const searchInfo = ref({})
const showSelect = ref(true)

watch(() => props.modelValue, (newValue, oldValue) => {
  tableData.value = newValue
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
  const res = await get_app_list({ page: page.value, pageSize: pageSize.value, ...searchInfo.value })
  var dataList = []
  if (res.code === 0 && res.data?.list) {
    dataList = res.data.list
    total.value = res.data.total
    page.value = res.data.page
    pageSize.value = res.data.pageSize
  }
  emit('update:modelValue', dataList)
}

const selectRow = async(row) => {
  emit('onSelect', row)
}

const viewRow = async(row) => {
  router.push({
    name: 'store.user_app',
    params: {
      app: row.app_id,
      title: t('iot.application') + ' - ' + row.name
    }
  })
}

onMounted(async() => {
  getTableData()
})
</script>


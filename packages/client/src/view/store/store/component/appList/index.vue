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
        <el-table-column :label="t('iot.store.appIcon')" width="60" align="center">
          <template #default="scope">
            <CustomPic pic-type="file" :pic-src="scope.row.icon" height="48" width="48" />
          </template>
        </el-table-column>
        <el-table-column :label="t('iot.appID')" prop="app_id" min-width="180" sortable="custom" />
        <el-table-column :label="t('iot.name')" prop="name" min-width="180" sortable="custom" />
        <el-table-column :label="t('general.description')" prop="description" min-width="300" show-overflow-tooltip />
        <el-table-column :label="t('iot.store.tags')" prop="tags" min-width="180">
          <template #default="scope">
            <el-tag
              v-for="tag in scope.row.tags"
              :key="tag.ID"
              disable-transitions
            > {{ tag.label }} </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('iot.store.appHot')" prop="download" width="160">
          <template #default="scope">
            <div>
              <el-tag>{{ t('iot.store.download') }} : {{ scope.row.download }}</el-tag>
              <el-tag
                type="success"
                style="margin-left: 2px;"
              >{{ t('iot.store.watch') }} : {{ scope.row.watch }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" :label="t('general.operations')" width="180">
          <template #default="scope">
            <el-button-group>
              <el-button type="success" icon="view" link @click="openRow(scope.row)">{{ t('iot.store.detail') }}</el-button>
              <el-button type="primary" icon="download" link @click="cacheApp(scope.row)">{{ t('iot.store.cache') }}</el-button>
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
  name: 'StoreAppList',
}
</script>

<script setup>
import {
  get_app_list
} from '@/api/store/user_app'
import {
  get_latest
} from '@/api/store/user_app_version'
import {
  create_app
} from '@/api/cached/user_app'
import { toSQLLine } from '@/utils/stringFun'
import CustomPic from '@/components/customPic/index.vue'
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()

const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const searchInfo = ref({})

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
  const table = await get_app_list({ page: page.value, pageSize: pageSize.value, ...searchInfo.value })
  if (table.code === 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}

onMounted(async() => {
  getTableData()
})

const openRow = (row) => {
  router.push({
    name: 'store.user_app',
    params: {
      app: row.app_id,
      title: t('iot.application') + ' - ' + row.name
    }
  })
}

const loadVersion = async(app_id) => {
  const res = await get_latest({ ID: app_id })
  if (res.code === 0) {
    if (res.data?.version) {
      return res.data.version.version
    }
  }
  return 0
}

const cacheApp = async(row) => {
  const version = await loadVersion(row.ID)
  if (version === 0) {
    ElMessage({
      type: 'error',
      message: '应用没有可缓存的版本文件'
    })
    return
  }
  row.cache_version = version
  row.progress = 0
  const res = await create_app(row)
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

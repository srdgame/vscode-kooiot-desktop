<template>
  <div>
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <el-form-item :label="t('iot.comment')">
          <el-input v-model="searchInfo.comment" :placeholder="t('iot.comment')" />
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
            <CustomPic pic-type="file" :pic-src="scope.row.app.icon" height="48" width="48" />
          </template>
        </el-table-column>
        <el-table-column :label="t('iot.appID')" prop="app.app_id" min-width="180" sortable="custom" />
        <el-table-column :label="t('iot.name')" prop="app.name" min-width="180" sortable="custom" />
        <el-table-column :label="t('general.description')" prop="app.description" min-width="300" show-overflow-tooltip />
        <el-table-column :label="t('iot.store.tags')" prop="app.tags" min-width="180">
          <template #default="scope">
            <el-tag
              v-for="tag in scope.row.app.tags"
              :key="tag.ID"
              disable-transitions
            > {{ tag.label }} </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('iot.store.appHot')" prop="app.download" min-width="180">
          <template #default="scope">
            <div>
              <el-tag>{{ t('iot.store.download') }} : {{ scope.row.app.download }}</el-tag>
              <el-tag
                type="success"
                style="margin-left: 2px;"
              >{{ t('iot.store.watch') }} : {{ scope.row.app.watch }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" :label="t('general.operations')" width="140">
          <template #default="scope">
            <el-button-group>
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
  name: 'WatchAppList',
}
</script>

<script setup>
import {
  get_watch_list
} from '@/api/store/watch'
import { toSQLLine } from '@/utils/stringFun'
import CustomPic from '@/components/customPic/index.vue'
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
  const table = await get_watch_list({ page: page.value, pageSize: pageSize.value, ...searchInfo.value })
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

const cacheApp = async(row) => {
  // TODO:
}

</script>

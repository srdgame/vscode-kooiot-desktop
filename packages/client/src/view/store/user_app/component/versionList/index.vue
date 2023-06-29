<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <div class="clearflex" :style="{padding:'10px'}">
      <div :style="{display:'inline-block',float:'right'}">
        <el-button type="primary" icon="refresh-right" @click="onSubmit">{{ t('iot.store.refresh') }}</el-button>
        <!-- <el-button v-if="canEditApp" type="primary" icon="plus" @click="openDialog('add')">{{ t('iot.store.uploadNewVersion') }}</el-button> -->
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
              {{ t('iot.store.version') }} : {{ version.version }} <time class="time">{{ formatDate(version.CreatedAt) }}</time>
              <el-button-group class="button-group">
                <el-button link type="primary" icon="download" @click="installVersion(version)">{{ t('iot.installApp') }}</el-button>
              </el-button-group>
            </template>
            {{ version.comment }}
            <!--
            <div class="bottom clearfix">
              <time class="time">{{ version.CreatedAt | formatDate }}</time>
              <el-button link>安装应用</el-button>
            </div>
            -->
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
  </div>
</template>

<script>
export default {
  name: 'StoreUserAppVersionList',
}
</script>

<script setup>
import {
  get_version_list
} from '@/api/store/user_app_version'
import { formatTimeToStr } from '@/utils/date'
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const formatDate = function(time) {
  if (time !== null && time !== '') {
    var date = new Date(time)
    return formatTimeToStr(date, t('iot.timestampFormat'))
  } else {
    return ''
  }
}

const props = defineProps({
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

// getTableData()

watch(() => props.modelValue.ID, function(newValue, oldValue) {
  if (newValue && formData.value.app_id !== newValue) {
    formData.value.app_id = newValue
    searchInfo.value.app_id = newValue
    onSubmit()
  }
})

onMounted(async() => {
  searchInfo.value.app_id = props.modelValue.ID
  props.modelValue ? formData.value.app_id = props.modelValue.ID : null
  props.modelValue ? searchInfo.value.app_id = props.modelValue.ID : null
  props.modelValue ? await getTableData() : null
})

const installVersion = (row) => {
  router.push({
    name: 'iot.device.app_install',
    params: {
      app_id: props.modelValue.ID,
      version: row.version,
      title: t('iot.installApp') + ' - ' + props.modelValue.name + t('iot.store.version') + ':' + row.version
    }
  })
}

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

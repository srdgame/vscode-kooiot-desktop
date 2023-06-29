<template>
  <div class="block">
    <el-timeline>
      <el-timeline-item
        v-for="item in latestList"
        :key="item.ID"
        :timestamp="formatDay(item.CreatedAt)"
        placement="top"
      >
        <el-card>
          <h4>
            {{ item.user.nickName }} 关注了 {{ item.app.name }}
            <el-button
              :style="{ float: 'right' }"
              link
              type="success"
              @click="viewApp(item.app)"
            > <el-icon><View /></el-icon> {{ t('iot.appDetail') }}  </el-button>
          </h4>
          <p>关注时间 {{ formatDate(item.CreatedAt) }}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  name: 'StoreOverviewInfoList',
}
</script>

<script setup>
import {
  get_latest_list
} from '@/api/store/watch'
import { formatTimeToStr } from '@/utils/date'
// import { useUserStore } from '@/pinia/modules/user'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
// const userStore = useUserStore()

const formatDay = function(time) {
  if (time !== null && time !== '') {
    var date = new Date(time)
    return formatTimeToStr(date, 'yyyy-MM-dd')
  } else {
    return ''
  }
}

const formatDate = function(time) {
  if (time !== null && time !== '') {
    var date = new Date(time)
    return formatTimeToStr(date, 'yyyy-MM-dd hh:mm:ss')
  } else {
    return ''
  }
}

const latestList = ref([])

onMounted(async() => {
  getLatest()
})

const getLatest = async() => {
  const res = await get_latest_list({ limit: 4 })
  if (res.code === 0) {
    latestList.value = res.data.list
  }
}
const viewApp = (app) => {
  router.push({
    name: 'store.user_app',
    params: {
      app: app.app_id,
      title: t('iot.application') + ' - ' + app.name
    }
  })
}
</script>

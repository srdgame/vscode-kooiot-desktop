<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item :title="t('iot.store.favAppList')" name="fav">
      <el-row class="shadow">
        <el-col
          v-for="(item, index) in favList"
          :key="item.ID"
          :span="5"
          :offset="index > 0 ? 1 : 0"
          @click="switchApp(item)"
        >
          <el-card shadow="hover" class="grid-content" :body-style="{ padding: '0px' }">
            <CustomPic pic-type="file" :pic-src="item.icon" style="padding: 14px;" />
            <div>
              <div class="title">{{ item.name }}</div>
              <div class="bottom clearfix">
                <div class="detail">{{ t('iot.store.developer') }} : {{ item.user.nickName }}</div>
                <div class="detail">{{ t('iot.store.downloadCount') }} : {{ item.download }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-collapse-item>
    <el-collapse-item :title="t('iot.store.latestAppList')" name="latest">
      <el-row class="shadow">
        <el-col
          v-for="(item, index) in latestList"
          :key="item.ID"
          :span="5"
          :offset="index > 0 ? 1 : 0"
          @click="switchApp(item)"
        >
          <el-card shadow="hover" class="grid-content" :body-style="{ padding: '0px' }">
            <CustomPic pic-type="file" :pic-src="item.icon" style="padding: 14px;" />
            <div>
              <div class="title">{{ item.name }}</div>
              <div class="bottom clearfix">
                <div class="detail">{{ t('iot.store.developer') }} : {{ item.user.nickName }}</div>
                <div class="detail">{{ t('iot.store.downloadCount') }} : {{ item.download }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
export default {
  name: 'StoreOverviewInfoList',
}
</script>

<script setup>
import {
  get_latest_list,
  get_fav_list
} from '@/api/store/user_app'
// import { formatTimeToStr } from '@/utils/date'
import CustomPic from '@/components/customPic/index.vue'
// import { useUserStore } from '@/pinia/modules/user'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
// const userStore = useUserStore()

// const formatDate = function(time) {
//   if (time !== null && time !== '') {
//     var date = new Date(time)
//     return formatTimeToStr(date, 'yyyy-MM-dd hh:mm:ss')
//   } else {
//     return ''
//   }
// }

const latestList = ref([])
const favList = ref([])
const activeNames = ref(['latest', 'fav'])

onMounted(async() => {
  getLatest()
  getFavorites()
})

const getLatest = async() => {
  const res = await get_latest_list({ limit: 4 })
  if (res.code === 0) {
    latestList.value = res.data.list
  }
}
const getFavorites = async() => {
  const res = await get_fav_list({ limit: 4 })
  if (res.code === 0) {
    favList.value = res.data.list
  }
}

const switchApp = (app) => {
  router.push({
    name: 'store.user_app',
    params: {
      app: app.app_id,
      title: t('iot.application') + ' - ' + app.name
    }
  })
}
</script>

<style>
  .shadow {
    padding-left: 10px;
    padding-right: 10px;
  }
  .el-collapse .el-collapse-item__header{
    padding-left: 10px;
  }
  .el-card .detail {
    font-size: 12px;
    color: #999;
  }

  .el-card .title {
    margin-top: 5px;
    line-height: 12px;
  }

  .el-card .bottom {
    margin-top: 5px;
    line-height: 14px;
  }

  .el-card .right {
    padding: 0;
    float: right;
  }

  .el-card .image {
    width: 100%;
    display: block;
  }

  .el-card .clearfix:before,
  .el-card .clearfix:after {
      display: table;
      content: "";
  }

  .el-card .clearfix:after {
      clear: both
  }
</style>

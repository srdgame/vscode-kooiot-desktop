<template>
  <div>
    <div class="gva-card-box">
      <el-card class="gva-card quick-entrance">
        <el-row :gutter="20">
          <el-col :xs="24" :lg="16" :md="16">
            <div class="car-left">
              <el-row>
                <el-col :xs="4" :md="3" :lg="3">
                  <CustomPic pic-type="file" :pic-src="appInfo.icon" />
                </el-col>
                <el-col :xs="20" :lg="12" :md="12">
                  <div class="text">
                    <h4>{{ appInfo.name }} ：{{ appInfo.app_id }}</h4>
                    <p class="tips-text">
                      <el-icon><Sunny /></el-icon>
                      <span>{{ appInfo.user?.userName }}</span>
                    </p>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
          <el-col :xs="24" :lg="8" :md="8">
            <div class="car-right">
              <el-row>
                <el-col :span="8">
                  <div class="car-item">
                    <span class="feedback">
                      <font-awesome-icon icon="fa-solid fa-cloud-download" />
                    </span>
                    <span> {{ t('iot.store.downloadCountS') }} </span>
                    <div class="detail">12 <el-button type="primary" icon="question-filled" link /> </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="car-item">
                    <span class="feedback">
                      <font-awesome-icon icon="fa-solid fa-heart" />
                    </span>
                    <span> {{ t('iot.store.watchCountS') }} </span>
                    <div class="detail">12 <el-button type="primary" icon="circle-plus-filled" link @click="openRow(scope.row)" /></div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="car-item">
                    <div class="detail">
                      <el-button type="primary" icon="download" link @click="onCacheApp()">{{ t('iot.store.cache') }}</el-button>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <el-tabs v-model="tabActive" :tab-position="tabPosition" @tab-remove="removeTab">
      <el-tab-pane lazy name="overview">
        <template #label><span><el-icon><DataAnalysis /></el-icon> {{ t('iot.store.appOverview') }} </span></template>
        <div>
          <Overview v-model="appInfo" @switch-tab="switchTab" />
        </div>
      </el-tab-pane>
      <el-tab-pane lazy name="versionList">
        <template #label><span><el-icon><Expand /></el-icon> {{ t('iot.store.versionList') }} </span></template>
        <div>
          <VersionList v-model="appInfo" />
        </div>
      </el-tab-pane>
      <el-tab-pane lazy name="templateList">
        <template #label><span><el-icon><Files /></el-icon> {{ t('iot.store.templateList') }} </span></template>
        <div>
          <TemplateList v-model="appInfo" @show-template="showTemplate" />
        </div>
      </el-tab-pane>
      <el-tab-pane
        v-for="tpl in templateList"
        :key="tpl.ID"
        :name="`template.${tpl.ID}`"
        lazy
        closable
      >
        <template #label><span><font-awesome-icon icon="fa-th-list" /> {{ t('iot.store.template') }} - {{ tpl.name }} </span></template>
        <div>
          <TemplateInfo :template="tpl" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'StoreUserApp',
}
</script>

<script setup>
import { find_app_by_id } from '@/api/store/user_app'
import { create_app } from '@/api/cached/user_app'
import CustomPic from '@/components/customPic/index.vue'
import Overview from './component/overview/index.vue'
import VersionList from './component/versionList/index.vue'
import TemplateList from './component/templateList/index.vue'
import TemplateInfo from './component/templateInfo/index.vue'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
const route = useRoute()

const tabPosition = ref('top')
const tabActive = ref('overview')
const appInfo = ref({ user: { uuid: '' }})
const templateList = ref([])
const app = ref(route.params.app)

const getAppInfo = async() => {
  const res = await find_app_by_id({ app_id: app.value })
  if (res.code === 0) {
    if (res.data?.app) {
      appInfo.value = res.data.app
    } else {
      ElMessage({
        type: 'error',
        message: t('iot.fetchAppInfoFailed')
      })
    }
  }
}

// eslint-disable-next-line no-unused-vars
const toTarget = (name) => {
  router.push({ name })
}

const switchTab = function(name) {
  tabActive.value = name
}

const removeTab = function(name) {
  // if (name === 'editApp') {
  //   showEditApp.value = false
  //   if (tabActive.value === 'editApp') {
  //     tabActive.value = 'overview'
  //   }
  //   return
  // }
  const index = templateList.value.findIndex(
    item => 'template.' + item.ID === name
  )
  templateList.value.splice(index, 1)
  if (name === tabActive.value) {
    tabActive.value = 'templateList'
  }
}

const showTemplate = function(tpl) {
  const index = templateList.value.findIndex(
    item => item.ID === tpl.ID
  )
  if (index === -1) {
    templateList.value.push(tpl)
  }
  tabActive.value = 'template.' + tpl.ID
}

onBeforeRouteUpdate((to, form) => {
  if (to.name === 'store.user_app') {
    if (app.value !== to.params.app) {
      app.value = to.params.app
      app.value ? getAppInfo() : null
    }
  }
})

const onCacheApp = async() => {
  const res = await create_app(appInfo.value)
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

onMounted(async() => {
  app.value ? getAppInfo() : null
})

</script>

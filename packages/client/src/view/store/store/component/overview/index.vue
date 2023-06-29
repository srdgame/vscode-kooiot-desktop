<template>
  <div>
    <div class="shadow">
      <el-row :gutter="20">
        <el-col
          v-for="(card, key) in toolCards"
          :key="key"
          :span="4"
          :xs="8"
          @click="switchTab(card.name)"
        >
          <el-card shadow="hover" class="grid-content">
            <div :style="{ backgroundColor: card.bg }">
              <el-icon>
                <component :is="card.icon" :style="{ color: card.color }" />
              </el-icon>
            </div>
            <p>{{ card.label }}</p>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="bottom">
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="12">
          <div class="info-list">
            <info-list />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <div class="notice-list">
            <notice-list />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StoreOverview',
}
</script>

<script setup>
import InfoList from './component/infoList/index.vue'
import NoticeList from './component/noticeList/index.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits(['switch-tab'])

const toolCards = ref([
  // {
  //   label: '中心概览',
  //   icon: 'el-icon el-icon-s-data',
  //   name: 'overview',
  //   color: '#ff9c6e'
  // },
  {
    label: t('iot.store.findApp'),
    icon: 'search',
    name: 'appList',
    color: '#b37feb'
  },
  {
    label: t('iot.store.coreExt'),
    icon: 'cpu',
    name: 'extList',
    color: '#ffd666'
  },
  {
    label: t('iot.store.watchAppList'),
    icon: 'star',
    name: 'watchList',
    color: '#ff85c0'
  }
])

const switchTab = function(name) {
  emit('switch-tab', name)
}
</script>


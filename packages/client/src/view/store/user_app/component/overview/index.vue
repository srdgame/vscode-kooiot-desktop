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
          <div class="chart-player">
            <info-list v-model="valueObj" />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
          <div class="chart-player">
            <notice-list v-model="valueObj" />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StoreUserAppOverview',
}
</script>

<script setup>
import InfoList from './component/infoList/index.vue'
import NoticeList from './component/noticeList/index.vue'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits(['switch-tab'])
const props = defineProps({
  modelValue: {
    default: () => {},
    required: true,
    type: Object
  }
})

const toolCards = ref([
  {
    label: t('iot.store.versionList'),
    icon: 'expand',
    name: 'versionList',
    color: '#ff9c6e'
  },
  {
    label: t('iot.store.templateList'),
    icon: 'files',
    name: 'templateList',
    color: '#b37feb'
  }
])

const valueObj = computed(() => {
  return props.modelValue
})

const switchTab = (name) => {
  emit('switch-tab', name)
}

</script>


<template>
  <el-collapse v-model="activeNames" @change="handleChange">
    <el-collapse-item :title="t('iot.store.appDescription')" name="desc">
      <div>{{ valueObj ? valueObj.description : 'N/A' }}</div>
    </el-collapse-item>
    <el-collapse-item v-if="valueObj.config" :title="t('iot.store.appConfigUiForViewOnly')" name="json">
      <div v-if="valueObj.config.enable">
        <ConfigUI v-model="jsonData" :schema="jsonSchema" />
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
export default {
  name: 'UserAppOverviewInfoList',
}
</script>

<script setup>
import ConfigUI from '@/components/configUI/index.vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    default: () => {},
    required: true,
    type: Object
  }
})

const activeNames = ref(['desc'])
const jsonData = ref({})

const valueObj = computed(() => {
  return props.modelValue
})

const jsonSchema = computed(() => {
  return (props.modelValue && props.modelValue.config && props.modelValue.config.enable) ? JSON.parse(props.modelValue.config.template) : ''
})

const handleChange = (val) => {
  console.log(val)
}
</script>

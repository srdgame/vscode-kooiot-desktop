<template>
  <div>
    <el-switch
      :value="value"
      inactive-color="#ff4949"
      :disabled="isDisabled"
      active-color="#13ce66"
      @change="changeStatus"
    />
    <span v-if="isDisabled" style="color: #606266"> <el-icon><Loading /></el-icon> {{ $t('iot.waitPlease') }} </span>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits(['change'])
const props = defineProps({
  val: {
    type: Boolean,
    default: false
  },
  option: {
    type: String,
    default: ''
  },
  desc: {
    type: String,
    default: ''
  },
  timeout: {
    type: Number,
    default: 60
  }
})

const value = ref(false)
const isDisabled = ref(false)
const checkTimer = ref(null)

watch(() => props.val, (newValue, oldValue) => {
  if (isDisabled.value) {
    value.value = newValue
    isDisabled.value = false
    if (checkTimer.value) {
      // console.log('clean')
      clearTimeout(checkTimer.value)
      checkTimer.value = null
    }
  }
}, { immediate: true })

onMounted(() => {
  value.value = props.val
})

const setStatus = () => {
  emit('change', value.value, props.option, props.desc)
  checkTimer.value = setTimeout(() => {
    isDisabled.value = false
    checkTimer.value = null
    // console.log('checkTimer')

    ElMessage({
      type: 'error',
      message: t('iot.change') + props.desc + t('iot.timeout'),
      showClose: true
    })
  }, props.timeout * 1000)
}

const changeStatus = (val) => {
  value.value = val
  isDisabled.value = true
  setStatus()
}

</script>

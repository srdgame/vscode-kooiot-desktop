<template>
  <div>
    <el-input
      v-model.number="value"
      :disabled="isDisabled"
      style="max-width: 120px"
      :placeholder="t('iot.enterNumberTip')"
      @input="onInput"
    />
    <span v-if="isDisabled" style="color: #606266"> <el-icon><Loading /></el-icon> {{ t('iot.waitPlease') }} </span>
    <el-button-group style="margin-left: 2px">
      <el-button v-if="!isDisabled && (props.val !== value)" type="success" icon="check" @click="setValue" />
      <el-button v-if="!isDisabled && (props.val !== value)" type="warning" icon="circle-close" @click="resetValue" />
    </el-button-group>
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
    type: Number,
    default: 0
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

const value = ref(0)
const changed = ref(false)
const isDisabled = ref(false)
const checkTimer = ref(null)

watch(() => props.val, (newValue, oldValue) => {
  if (isDisabled.value) {
    value.value = newValue
    isDisabled.value = false
    if (checkTimer.value) {
      clearTimeout(checkTimer.value)
      checkTimer.value = null
    }
  } else if (!changed.value) {
    value.value = props.val
  }
}, { immediate: true })

onMounted(async() => {
  value.value = props.val
})

const onInput = (value) => {
  // value.value = value
  changed.value = true
}

const setValue = () => {
  isDisabled.value = true
  changed.value = false
  emit('change', value.value, props.option, props.desc)
  checkTimer.value = setTimeout(() => {
    isDisabled.value = false
    checkTimer.value = null

    ElMessage({
      type: 'error',
      message: t('iot.change') + props.desc + t('iot.timeout'),
      showClose: true
    })
  }, props.timeout * 1000)
}
const resetValue = () => {
  value.value = props.val
  changed.value = false
}
</script>

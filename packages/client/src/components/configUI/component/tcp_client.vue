<template>
  <el-form
    ref="uiForm"
    v-model="formData"
  >
    <el-form-item :label="t('iot.tcpTargetAddr')">
      <el-input
        v-model="formData.host"
        :placeholder="t('iot.enterTcpTargetAddrTip')"
        clearable
      />
    </el-form-item>
    <el-form-item :label="t('iot.tcpTargetPort')">
      <el-input
        v-model.number="formData.port"
        clearable
        :formatter="(value) => `${value}`.replace(/[^0-9.]/g, '')"
        :parser="(value) => value.replace(/[^0-9.]/g, '')"
      />
    </el-form-item>
    <el-form-item>
      <el-checkbox v-model="formData.nodelay">Nodelay</el-checkbox>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'ConfigUITcpClient',
}
</script>

<script setup>
import { ref, nextTick, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  meta: {
    default: () => {},
    type: Object,
    required: true
  },
  modelValue: {
    default: () => {},
    type: Object
  }
})
const formData = ref({
  host: '',
  port: 0,
  nodelay: true
})
const internalChange = ref(false)

const loadValue = (newValue) => {
  formData.value.host = newValue.host ? newValue.host : formData.value.host
  formData.value.port = newValue.port ? newValue.port : formData.value.port
  formData.value.nodelay = newValue.nodelay !== null ? newValue.nodelay : formData.value.nodelay
}

watch(() => props.modelValue, (newValue, oldValue) => {
  if (!internalChange.value) {
    loadValue(newValue)
  }
}, { immediate: true, deep: true })

watch(formData, (newValue, oldValue) => {
  // console.log('ConfigUI.TCPClient', newValue)
  internalChange.value = true
  emit('update:modelValue', {
    host: formData.value.host,
    port: parseInt(formData.value.port),
    nodelay: formData.value.nodelay
  })
  nextTick(function() {
    internalChange.value = false
  })
}, { immediate: true, deep: true })

onMounted(async() => {
  props.modelValue ? loadValue(props.modelValue) : null
})
</script>

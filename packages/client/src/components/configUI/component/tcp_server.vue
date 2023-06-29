<template>
  <el-form
    ref="uiForm"
    v-model="formData"
  >
    <el-form-item :label="t('iot.tcpListenAddr')">
      <el-input
        v-model="formData.host"
        :placeholder="t('iot.enterTcpListenAddrTip')"
        clearable
      />
    </el-form-item>
    <el-form-item :label="t('iot.tcpListenPort')">
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
  name: 'ConfigUITcpServer',
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
  host: '0.0.0.0',
  port: 0,
  nodelay: true
})
const internalChange = ref(false)

const loadValue = (newValue) => {
  formData.value.host = newValue.host ? newValue.host : formData.value.host
  formData.value.port = newValue.port ? newValue.port : formData.value.port
  formData.value.nodelay = newValue.nodelay !== null ? newValue.nodelay : formData.value.nodelay
}
const commitValue = (newValue) => {
  internalChange.value = true
  emit('update:modelValue', {
    host: newValue.host,
    port: parseInt(newValue.port),
    nodelay: newValue.nodelay
  })
  nextTick(function() {
    internalChange.value = false
  })
}

watch(() => props.modelValue, (newValue, oldValue) => {
  if (!internalChange.value) {
    loadValue(newValue)
  }
}, { immediate: true, deep: true })

watch(formData, (newValue, oldValue) => {
  // console.log('ConfigUI.TCPClient', newValue)
  commitValue(newValue)
}, { immediate: true, deep: true })

onMounted(async() => {
  props.modelValue ? loadValue(props.modelValue) : null
  props.value ? commitValue(formData.value) : null
})

</script>

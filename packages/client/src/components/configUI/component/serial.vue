<template>
  <el-form
    ref="uiForm"
    v-model="inputValue"
  >
    <el-form-item prop="port" :label="t('iot.serialPort')">
      <el-select
        v-model="inputValue.port"
        clearable
        filterable
        allow-create
        default-first-option
        :placeholder="t('iot.enterSerialPortPathTip')"
      >
        <el-option
          v-for="item in tty_list"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item :label="t('iot.serialBaudrate')">
      <el-select v-model="inputValue.baudrate" :placeholder="t('general.pleaseSelect')">
        <el-option v-for="item in baudrate_list" :key="item" :label="item" :value="item" />
      </el-select>
    </el-form-item>
    <el-form-item :label="t('iot.serialDatabits')">
      <el-select v-model="inputValue.data_bits" :placeholder="t('general.pleaseSelect')">
        <el-option value="7" label="7" />
        <el-option value="8" label="8" />
      </el-select>
    </el-form-item>
    <el-form-item :label="t('iot.serialParity')">
      <el-select v-model="inputValue.parity" :placeholder="t('general.pleaseSelect')">
        <el-option value="None" :label="t('iot.serialParityNone')" />
        <el-option value="Even" :label="t('iot.serialParityEven')" />
        <el-option value="Odd" :label="t('iot.serialParityOdd')" />
      </el-select>
    </el-form-item>
    <el-form-item :label="t('iot.serialStopbits')">
      <el-select v-model="inputValue.stop_bits" :placeholder="t('general.pleaseSelect')">
        <el-option value="1" label="1" />
        <el-option value="2" label="2" />
      </el-select>
    </el-form-item>
    <el-form-item :label="t('iot.serialFlowControl')">
      <el-select v-model="inputValue.flow_control" :placeholder="t('general.pleaseSelect')">
        <el-option value="ON" label="ON" />
        <el-option value="OFF" label="OFF" />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'ConfigUISerial',
}
</script>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  meta: {
    default: () => {},
    type: Object,
    required: true
  },
  info: {
    default: () => {},
    type: Object
  },
  modelValue: {
    default: () => {},
    type: Object,
    required: true
  }
})

const inputValue = ref(props.modelValue)
const internalChange = ref(false)
const tty_list = ref([])
const baudrate_list = ref([1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200])
const defaultValue = {
  port: '',
  baudrate: 9600,
  data_bits: 8,
  parity: 'None',
  stop_bits: 1,
  flow_control: 'OFF'
}

watch(inputValue, (newValue, oldValue) => {
  internalChange.value = true
  emit('update:modelValue', {
    port: newValue.port ? newValue.port : defaultValue.port,
    baudrate: newValue.baudrate ? newValue.baudrate : defaultValue.baudrate,
    data_bits: parseInt(newValue.data_bits ? newValue.data_bits : defaultValue.data_bits),
    parity: newValue.parity ? newValue.parity : defaultValue.parity,
    stop_bits: parseInt(newValue.stop_bits ? newValue.stop_bits : defaultValue.stop_bits),
    flow_control: newValue.flow_control ? newValue.flow_control : defaultValue.flow_control,
  })
  nextTick(function() {
    internalChange.value = false
  })
}, { deep: true })

const loadValue = (val) => {
  inputValue.value = {
    port: val.port ? val.port : defaultValue.port,
    baudrate: val.baudrate ? val.baudrate : defaultValue.baudrate,
    data_bits: val.data_bits ? val.data_bits : defaultValue.data_bits,
    parity: val.parity ? val.parity : defaultValue.parity,
    stop_bits: val.stop_bits ? val.stop_bits : defaultValue.stop_bits,
    flow_control: val.flow_control ? val.flow_control : defaultValue.flow_control,
  }
}

watch(() => props.modelValue, (val, old_val) => {
  if (!internalChange.value) {
    loadValue(val)
  }
})

const loadAll = () => {
  if (!props.info?.product || !props.info?.product.interfaces) {
    return []
  }
  var tty_list = []
  for (var index in props.info?.product.interfaces) {
    const it = props.info?.product.interfaces[index]
    if (it.type === 'tty') {
      tty_list.push({
        label: it.description,
        value: it.real_name
      })
    }
  }
  return tty_list
}

onMounted(async() => {
  tty_list.value = loadAll()
  loadValue(props.modelValue)
})

</script>

<style scoped lang="scss">
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .desc {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>

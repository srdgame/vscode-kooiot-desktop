<template>
  <div>
    <el-form ref="dataForm" :inline="true" :model="inputValue" label-width="120px">
      <el-form-item
        v-for="item in schemaMap"
        v-show="!hideItem[item.key]"
        :key="item.key"
        :prop="item.key"
        :label="item.label + ':' "
        style="width:100%"
      >
        <c-boolean v-if="item.meta?.type === 'boolean'" v-model="item.value" :meta="item.meta" :info="props.info" :tpls="templates" />
        <c-number v-if="item.meta?.type === 'number'" v-model="item.value" :meta="item.meta" :info="props.info" :tpls="templates" />
        <c-string v-if="item.meta?.type === 'string'" v-model="item.value" :meta="item.meta" :info="props.info" :tpls="templates" />
        <c-text v-if="item.meta?.type === 'text'" v-model="item.value" :meta="item.meta" :info="props.info" :tpls="templates" />
        <c-dropdown v-if="item.meta?.type === 'dropdown'" v-model="item.value" :meta="item.meta" :info="props.info" :tpls="templates" />
        <c-serial v-if="item.meta?.type === 'serial'" v-model="item.value" :meta="item.meta" :info="props.info" :tpls="templates" />
        <c-table v-if="item.meta?.type === 'table'" v-model="item.value" :meta="item.meta" :info="props.info" :tpls="templates" />
        <c-tcp-client v-if="item.meta?.type === 'tcp_client'" v-model="item.value" :meta="item.meta" :info="props.info" :tpls="templates" />
        <c-tcp-server v-if="item.meta?.type === 'tcp_server'" v-model="item.value" :meta="item.meta" :info="props.info" :tpls="templates" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'ConfigUISection',
}
</script>

<script setup>
import {
  schema_to_map,
  update_schema_map_val
} from '@/utils/configUI'

import cBoolean from './boolean.vue'
import cDropdown from './dropdown.vue'
import cNumber from './number.vue'
import cSerial from './serial.vue'
import cString from './string.vue'
import cTcpClient from './tcp_client.vue'
import cTcpServer from './tcp_server.vue'
import cText from './text.vue'
import cTable from './table.vue'
import { nextTick, onMounted, ref, watch } from 'vue'

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
  tpls: {
    default: () => [],
    type: Array
  },
  modelValue: {
    default: () => {},
    type: Object
  }
})

const templates = ref(props.templates)
const inputValue = ref(props.modelValue)
const internalChange = ref(false)
const schemaMap = ref(schema_to_map(props.meta.child, inputValue.value))
const hideItem = ref({})

watch(() => props.meta, (newValue, oldValue) => {
  schemaMap.value = schema_to_map(newValue.child, inputValue.value)
}, { immediate: true, deep: true })

watch(() => props.modelValue, (val, old_val) => {
  if (!internalChange.value) {
    inputValue.value = val
    update_schema_map_val(schemaMap.value, inputValue.value)
  }
}, { immediate: true, deep: true })

watch(schemaMap, (newValue, oldValue) => {
  // console.log(newValue)
  var hides = {}
  newValue.forEach(item => {
    if (inputValue.value[item.key] !== item.value) {
      inputValue.value[item.key] = item.value
    }
    if (item.meta?.depends) {
      for (var key in item.meta?.depends) {
        if (item.value !== key) {
          hides[item.depends[key]] = true
        }
      }
    }
  })
  newValue.forEach(item => {
    if (item.meta?.depend) {
      if (inputValue.value[item.meta?.depend.name] === item.meta?.depend.value) {
        hides[item.key] = true
      }
    }
  })
  hideItem.value = hides
}, { immediate: true, deep: true })

watch(inputValue, (newValue, oldValue) => {
  internalChange.value = true
  emit('update:modelValue', newValue)
  nextTick(function() {
    internalChange.value = false
  })
}, { immediate: true, deep: true })

onMounted(async() => {
  // schemaMap.value = schema_to_map(props.meta.child, inputValue.value)
  nextTick(_ => {
    // schemaMap.value = schema_to_map(props.meta.child, inputValue.value)
  })
})
</script>

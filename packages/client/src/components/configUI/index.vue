<template>
  <div>
    <el-form ref="dataForm" :inline="true" :model="inputValue" label-width="180px">
      <el-form-item
        v-for="item in schemaMap"
        v-show="!hideItem[item.key]"
        :key="item.key"
        :prop="item.key"
        :label="item.label + ':' "
        style="width:100%"
      >
        <c-boolean v-if="item.meta?.type === 'boolean'" v-model="item.value" :meta="item.meta" :info="itemInfo" :tpls="templates" />
        <c-number v-if="item.meta?.type === 'number'" v-model="item.value" :meta="item.meta" :info="itemInfo" :tpls="templates" />
        <c-string v-if="item.meta?.type === 'string'" v-model="item.value" :meta="item.meta" :info="itemInfo" :tpls="templates" />
        <c-text v-if="item.meta?.type === 'text'" v-model="item.value" :meta="item.meta" :info="itemInfo" :tpls="templates" />
        <c-dropdown v-if="item.meta?.type === 'dropdown'" v-model="item.value" :meta="item.meta" :info="itemInfo" :tpls="templates" />
        <c-serial v-if="item.meta?.type === 'serial'" v-model="item.value" :meta="item.meta" :info="itemInfo" :tpls="templates" />
        <c-section v-if="item.meta?.type === 'section'" v-model="item.value" :meta="item.meta" :info="itemInfo" :tpls="templates" />
        <el-form-item v-if="item.meta?.type === 'fake_section'"> {{ item.desc }} </el-form-item>
        <c-templates v-if="item.meta?.type === 'templates'" v-model="item.value" :meta="item.meta" :info="itemInfo" :tpls="templates" />
        <c-table v-if="item.meta?.type === 'table'" v-model="item.value" :meta="item.meta" :info="itemInfo" :tpls="templates" />
        <c-tcp-client v-if="item.meta?.type === 'tcp_client'" v-model="item.value" :meta="item.meta" :info="itemInfo" :tpls="templates" />
        <c-tcp-server v-if="item.meta?.type === 'tcp_server'" v-model="item.value" :meta="item.meta" :info="itemInfo" :tpls="templates" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'ConfigUI',
}
</script>

<script setup>
import {
  schema_to_map,
  update_schema_map_val
} from '@/utils/configUI'

import cBoolean from './component/boolean.vue'
import cNumber from './component/number.vue'
import cText from './component/text.vue'
import cString from './component/string.vue'
import cDropdown from './component/dropdown.vue'
import cSerial from './component/serial.vue'
import cSection from './component/section.vue'
import cTcpClient from './component/tcp_client.vue'
import cTcpServer from './component/tcp_server.vue'
import cTemplates from './component/templates.vue'
import cTable from './component/table.vue'
import { nextTick, onMounted, reactive, ref, watch } from 'vue'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  schema: {
    default: () => [],
    required: true,
    type: Array
  },
  app: {
    default: () => {},
    type: Object
  },
  device: {
    default: () => {},
    type: Object
  },
  modelValue: {
    default: () => {},
    type: Object
  },
  product: {
    default: () => {},
    type: Object
  }
})

const inputValue = ref(props.modelValue)
const schemaMap = ref(schema_to_map(props.meta, inputValue.value))
const templates = ref([])
const hideItem = ref({})
const itemInfo = reactive({
  app: props.app,
  device: props.device,
  product: props.product,
})

watch(() => props.schema, (val, old_val) => {
  schemaMap.value = schema_to_map(val, inputValue.value)
}, { immediate: true, deep: true })

watch(() => props.modelValue, (val, old_val) => {
  var tpls = []
  inputValue.value = val
  update_schema_map_val(schemaMap.value, inputValue.value)
}, { immediate: true, deep: true })

watch(schemaMap, (newValue, oldValue) => {
  var tpls = []
  var hides = {}
  newValue.forEach(item => {
    inputValue.value[item.key] = item.value
    if (item.meta?.depends) {
      for (var key in item.meta?.depends) {
        if (item.value !== key) {
          hides[item.meta?.depends[key]] = true
        }
      }
    }
    if (item.meta?.type === 'templates') {
      item.value.forEach(item => {
        tpls.push(item)
      })
    }
  })
  newValue.forEach(item => {
    if (item.meta?.depend) {
      if (inputValue.value[item.meta?.depend.name] === item.meta?.depend.value) {
        hides[item.key] = true
      }
    }
  })
  templates.value = tpls
  hideItem.value = hides
}, { immediate: true, deep: true })

watch(inputValue, (newValue, oldValue) => {
  emit('update:modelValue', newValue)
}, { immediate: true, deep: true })

onMounted(async() => {
  // schemaMap.value = schema_to_map(props.meta, inputValue.value)
  nextTick(_ => {
    // console.log('Load......................')
    // schemaMap.value = schema_to_map(props.meta, inputValue.value)
  })
})

</script>

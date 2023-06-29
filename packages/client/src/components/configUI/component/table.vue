<template>
  <div class="ui-table-class">
    <div class="button-box clearflex">
      {{ props.meta.desc }}
      <el-button type="primary" plain icon="plus" @click="createData">{{ t('general.add') }}</el-button>
    </div>
    <EditableProTable
      ref="editTable"
      :mode="radio"
      :columns="columns"
      :data="props.modelValue"
      @add="add"
      @onChange="onChange"
      @del="deleteAction"
    />
  </div>
</template>

<script>
export default {
  name: 'ConfigUITable',
}
</script>

<script setup>
import {
  schema_to_map,
} from '@/utils/configUI'
import { nextTick, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import EditableProTable from '@/components/Table/EditableProTable/index.vue'

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
  tpls: {
    default: () => [],
    type: Array,
    required: true
  },
  modelValue: {
    default: () => [],
    type: Array,
    required: true
  }
})

const editTable = ref()
const tableSchema = ref(schema_to_map(props.meta?.cols, {}))
const columns = ref([])
const radio = ref('hide')

watch(() => props.meta, (newValue, oldValue) => {
  tableSchema.value = schema_to_map(newValue.cols, {})
  columns.value = genereateColumns(tableSchema.value, props.tpls)
  // console.log('Cols', columns.value)
}, { deep: true })

watch(() => props.tpls, (newValue, oldValue) => {
  columns.value = genereateColumns(tableSchema.value, newValue)
  // console.log('Cols', columns.value)
})

const mapSchemaToColumn = (item, tpls) => {
  switch (item.meta?.type) {
    case 'template':
      var tpl_options = []
      tpls.map(val => {
        if (val?.name && (val?.desc || val?.description)) {
          tpl_options.push({ value: val.name, label: val.desc || val.description })
        } else {
          tpl_options.push({ value: val, label: val })
        }
      })
      item.meta?.tpls?.map(val => {
        if (val?.name && (val?.desc || val?.description)) {
          tpl_options.push({ value: val.name, label: val.desc || val.description })
        } else {
          tpl_options.push({ value: val, label: val })
        }
      })
      return {
        key: item.key,
        name: item.key,
        label: item.label,
        width: item.meta?.width ? item.meta?.width : 120,
        valueType: 'select',
        options: tpl_options,
      }
    case 'dropdown':
      var dropdown_options = []
      item.meta?.values.map(val => {
        if (val?.value) {
          dropdown_options.push({ value: val.value, label: val.label })
        } else {
          dropdown_options.push({ value: val, label: val })
        }
      })
      return {
        key: item.key,
        name: item.key,
        label: item.label,
        width: item.meta?.width ? item.meta?.width : 120,
        valueType: 'select',
        options: dropdown_options,
      }
    case 'number':
      return {
        key: item.key,
        name: item.key,
        label: item.label,
        width: item.meta?.width ? item.meta?.width : 120,
        valueType: 'number',
      }
    default:
      return {
        key: item.key,
        name: item.key,
        label: item.label,
        width: item.meta?.width ? item.meta?.width : 120,
        valueType: 'text',
      }
  }
}

const genereateColumns = (schema, tpls) => {
  var cols = []
  schema.forEach(item => {
    cols.push(mapSchemaToColumn(item, tpls))
  })
  // console.log(cols)
  return cols
}

const createData = async() => {
  editTable.value.add()
}

const deleteAction = (row) => {
  // console.log('删除', row)
}
const onChange = (val) => {
  emit('update:modelValue', val)
}
const add = (row) => {}

onMounted(async() => {
  // tableSchema.value = schema_to_map(props.meta?.cols, {})
  nextTick(_ => {
    tableSchema.value = schema_to_map(props.meta?.cols, {})
    columns.value = genereateColumns(tableSchema.value, props.tpls)
  })
})

</script>

<style lang="scss" scoped>
.ui-table-class {
  .button-box {
    padding: 10px 20px;
    .el-button {
      float: right;
    }
  }
}
</style>

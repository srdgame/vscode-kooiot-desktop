<template>
  <div class="ui-table-class">
    <div class="button-box clearflex">
      {{ props.meta.desc }}
      <el-button type="primary" icon="plus" @click="createData(-1)">{{ t('general.add') }}</el-button>
    </div>
    <div style="height: 400px; width: 100%">
      <el-auto-resizer>
        <template #default="{ height, width }">
          <el-table-v2
            :columns="columns"
            :data="inputValue"
            :width="width"
            :height="height"
            fixed
            boarder
          />
        </template>
      </el-auto-resizer>
    </div>
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
import { h, nextTick, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElButton, ElInput, ElSelect, ElOption, ElMessageBox } from 'element-plus'

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

const inputValue = ref([])
const internalChange = ref(false)
const tableSchema = ref(schema_to_map(props.meta?.cols, {}))
const cellEditing = ref(false)
const columns = ref([])

watch(() => props.meta, (newValue, oldValue) => {
  tableSchema.value = schema_to_map(newValue.cols, {})
  columns.value = genereateColumns(tableSchema.value)
  // console.log('Cols', columns.value)
}, { deep: true })

watch(() => props.modelValue, (val, old_val) => {
  if (internalChange.value) {
    // console.log('ConfigUI.table.source 2', val)
    return
  }
  // console.log('ConfigUI.table.source', val)
  // inputValue.value = val
})

watch(inputValue, (newValue, oldValue) => {
  if (cellEditing.value) {
    // console.log('ConfigUI.table.is editing', newValue)
    return
  }
  internalChange.value = true
  // console.log('ConfigUI.table.commit', newValue)
  emit('update:modelValue', [...newValue])
  nextTick(function() {
    internalChange.value = false
  })
}, { immediate: true, deep: true })

const InputCell = ({ value, onChange, forwardRef }) => {
  return h(
    ElInput,
    {
      ref: forwardRef,
      modelValue: value,
      onInput: onChange,
    }
  )
}

const TemplateCell = ({ value, onChange, forwardRef, options }) => {
  var Options = []
  options.map((item) => {
    var label = item.label
    var value = item.value
    Options.push(h(
      ElOption,
      {
        props: {
          label,
          value: value,
          key: value,
        }
      }
    ))
  })
  return h(
    ElSelect,
    {
      ref: forwardRef,
      modelValue: value,
      change: onChange,
    },
    Options
  )
}

const DropDownCell = ({ value, onChange, forwardRef, options }) => {
  var Options = []
  options.map((item) => {
    var label = item.label
    var value = item.value
    Options.push(h(
      ElOption,
      {
        props: {
          label,
          value: value,
          key: value,
        }
      }
    ))
  })
  return h(
    ElSelect,
    {
      ref: forwardRef,
      modelValue: value,
      change: onChange,
    },
    Options
  )
}

const mapSchemaToColumn = (item) => {
  switch (item.meta?.type) {
    case 'template':
      return { key: item.key, dataKey: item.key, title: item.label, width: item.meta?.width ? item.meta?.width : 180, cellRenderer: ({ rowData, column }) => {
        const onChange = (value) => (rowData[column.dataKey] = value)
        const onEnterEditMode = () => {
          rowData.editing = true
          onEditActive()
        }
        const onExitEditMode = () => {
          rowData.editing = false
          onEditClose()
        }
        const input = ref()
        const setRef = (el) => {
          input.value = el
          if (el) {
            el.focus?.()
          }
        }
        return rowData.editing ? h(
          TemplateCell,
          {
            forwardRef: setRef,
            value: rowData[column.dataKey],
            onChange: onChange,
            onBlur: onExitEditMode,
            onKeydownEnter: onExitEditMode,
            options: props.tpls,
          }
        ) : h(
          'div',
          {
            class: 'table-v2-inline-editing-trigger',
            onClick: onEnterEditMode,
          },
          { default: () => rowData[column.dataKey] }
        )
      } }
    case 'dropdown':
      return { key: item.key, dataKey: item.key, title: item.label, width: item.meta?.width ? item.meta?.width : 180, cellRenderer: ({ rowData, column }) => {
        const onChange = (value) => (rowData[column.dataKey] = value)
        const onEnterEditMode = () => {
          rowData.editing = true
          onEditActive()
        }
        const onExitEditMode = () => {
          rowData.editing = false
          onEditClose()
        }
        const input = ref()
        const setRef = (el) => {
          input.value = el
          if (el) {
            el.focus?.()
          }
        }
        return rowData.editing ? h(
          DropDownCell,
          {
            forwardRef: setRef,
            value: rowData[column.dataKey],
            onChange: onChange,
            onBlur: onExitEditMode,
            onKeydownEnter: onExitEditMode,
            options: item.meta?.values,
          }
        ) : h(
          'div',
          {
            class: 'table-v2-inline-editing-trigger',
            onClick: onEnterEditMode,
          },
          { default: () => rowData[column.dataKey] }
        )
      } }
    default:
      return { key: item.key, dataKey: item.key, title: item.label, width: item.meta?.width ? item.meta?.width : 180, cellRenderer: ({ rowData, column }) => {
        const onChange = (value) => (rowData[column.dataKey] = value)
        const onEnterEditMode = () => {
          rowData.editing = true
          onEditActive()
        }
        const onExitEditMode = () => {
          rowData.editing = false
          onEditClose()
        }
        const input = ref()
        const setRef = (el) => {
          input.value = el
          if (el) {
            el.focus?.()
          }
        }
        return rowData.editing ? h(
          InputCell,
          {
            forwardRef: setRef,
            value: rowData[column.dataKey],
            onChange: onChange,
            onBlur: onExitEditMode,
            onKeydownEnter: onExitEditMode,
          }
        ) : h(
          'div',
          {
            class: 'table-v2-inline-editing-trigger',
            onClick: onEnterEditMode,
          },
          { default: () => rowData[column.dataKey] }
        )
      } }
  }
}

const genereateColumns = (schema) => {
  var cols = []
  schema.forEach(item => {
    cols.push(mapSchemaToColumn(item))
  })

  cols.push({ key: 'operations', title: t('general.operations'), width: 150, minWidth: 120, align: 'center', cellRenderer: ({ rowIndex, rowData }) =>
    h(
      ElButton,
      { type: 'danger', icon: 'Delete', onClick: () => deleteData(rowIndex, rowData) },
      { default: () => t('general.delete') },
    )
  })
  return cols
}

const createData = async(row) => {
  const formData = {}
  tableSchema.value.forEach(item => {
    formData[item.key] = item.value
  })
  if (!formData.id) {
    var i = 1
    inputValue.value.forEach(item => {
      if (item.id >= i) {
        i = item.id + 1
      }
    })
    formData.id = i
  }
  // const { row: newRow } = await plxTable.value.insertAt(formData, row)
  // await plxTable.value.setEditCell(newRow, props.meta.cols[0].name)

  inputValue.value.push(formData)
}

const deleteData = async(rowIndex, rowData) => {
  ElMessageBox.confirm(t('iot.deleteTableDataConfirmMsg'), t('general.hint'), {
    confirmButtonText: t('general.confirm'),
    cancelButtonText: t('general.cancel'),
    type: 'warning'
  })
    .then(async() => {
      // inputValue.value.remove(rowData)
      const index = inputValue.value.findIndex(item => item.id === row.id)
      if (index !== -1) {
        inputValue.value.splice(index, 1)
      }
    })
}

const editCount = ref(0)
const onEditActive = () => {
  cellEditing.value = true
  editCount.value++
  // console.log('onEditActive')
}
const onEditClose = () => {
  editCount.value--
  if (editCount.value === 0) {
    cellEditing.value = false
    // console.log('onEditClose')
    // const res = plxTable.value.getTableData()
    // console.log('ConfigUI.table.commit2', res.fullData)

    // inputValue.value = res.fullData
  }
}

onMounted(async() => {
  // tableSchema.value = schema_to_map(props.meta?.cols, {})
  nextTick(_ => {
    tableSchema.value = schema_to_map(props.meta?.cols, {})
    columns.value = genereateColumns(tableSchema.value)
  })
})

</script>

<style lang="scss" scoped>
.ui-table-class {
  width: 100%;
  height: 450px;
  .button-box {
    padding: 10px 20px;
    .el-button {
      float: right;
    }
  }
}
</style>

<style>
.table-v2-inline-editing-trigger {
  border: 1px transparent dotted;
  padding: 4px;
  min-width: 20px;
}

.table-v2-inline-editing-trigger:hover {
  border-color: var(--el-color-primary);
}
</style>

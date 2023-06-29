<template>
  <div class="m-edit-table">
    <div v-if="mode !== 'hide' && mode !== 'bottom'" style="margin-top: 15px; margin-bottom: 15px">
      <el-button style="width: 100%" @click="add">
        <el-icon style="margin-right: 4px"><plus /></el-icon> 添加一行数据</el-button>
    </div>
    <el-table :data="transData" style="width: 100%" row-key="__id" border>
      <template v-for="col in columns">
        <el-table-column
          v-if="col.type"
          :key="col.id"
          :type="col.type"
          :width="col.width"
          :align="col.align"
          :fixed="col.fixed"
          :label="col.label"
        />
        <el-table-column
          v-else
          :key="col.name"
          :prop="col.name"
          :width="col.width"
          :align="col.align"
          :fixed="col.fixed"
          :label="col.label"
        >
          <template #default="scope">
            <template v-if="!col.slot">
              <template v-if="col.readonly">
                {{ scope.row[col.name] }}
              </template>
              <template v-else-if="col.valueType === 'select'">
                <el-select
                  v-if="scope.row.__edit"
                  v-model="scope.row[col.name]"
                  clearable
                  :placeholder="`请选择`"
                >
                  <el-option
                    v-for="ite in col.options"
                    :key="ite.value"
                    :label="ite.label"
                    :value="ite.value"
                  />
                </el-select>
                <span v-else>{{ filterOption(col, scope) }}</span>
              </template>

              <template v-else-if="col.valueType === 'date'">
                <el-date-picker
                  v-if="scope.row.__edit"
                  v-model="scope.row[col.name]"
                  type="date"
                  value-format="YYYY-MM-DD"
                  clearable
                  placeholder="请选择"
                />
                <span v-else>{{ scope.row[col.name] || '--' }}</span>
              </template>
              <template v-else-if="col.valueType === 'number'">
                <el-input
                  v-if="scope.row.__edit"
                  v-model.number="scope.row[col.name]"
                  clearable
                  placeholder="请输入"
                  :formatter="(value) => `${value}`.replace(/[^0-9.]/g, '')"
                  :parser="(value) => value.replace(/[^0-9.]/g, '')"
                />
                <span v-else>{{ scope.row[col.name] || '--' }}</span>
              </template>
              <template v-else>
                <el-input
                  v-if="scope.row.__edit"
                  v-model="scope.row[col.name]"
                  clearable
                  placeholder="请输入"
                />
                <span v-else>{{ scope.row[col.name] || '--' }}</span>
              </template>
            </template>
            <slot v-else :name="col.name" :item="col" :row="scope.row" />
          </template>
        </el-table-column>
      </template>
      <el-table-column prop="operator" label="操作" width="250px" fixed="right">
        <template #default="scope">
          <el-button
            v-if="scope.row.__edit"
            type="primary"
            size="small"
            icon="CircleCheckFilled"
            @click="confirmEdit(scope.row)"
          >
            保存
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="Edit"
            @click="enableEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-popover
            v-model:visible="scope.row.__visible"
            trigger="click"
            placement="top"
            :width="160"
          >
            <p style="display: flex; align-items: center; margin-bottom: 10px">
              <el-icon color="#faad14" style="margin-right: 10px"><warning-filled /></el-icon>
              删除此行？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="small" @click="scope.row.__visible = false">取消</el-button>
              <el-button size="small" type="primary" @click="deleteAction(scope.row)">确定</el-button>
            </div>
            <template #reference>
              <el-button icon="Delete" size="small" type="danger" @click="deleteCurrent(scope.row)">删除</el-button>
            </template>
          </el-popover>
          <el-button
            v-if="scope.row.__edit"
            type="primary"
            size="small"
            icon="Edit"
            @click="cancelEdit(scope.row)"
          >
            取消
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="mode !== 'hide' && mode !== 'top'" style="margin-top: 15px">
      <el-button style="width: 100%" @click="add">
        <el-icon style="margin-right: 4px"><plus /></el-icon> 添加一行数据</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { deepClone } from '@/utils/clone'

const emit = defineEmits(['del', 'add', 'onChange'])
const transData = ref([])

const props = defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  data: {
    type: Array,
    default: () => [],
  },
  mode: {
    type: String,
    default: 'bottom',
  },
})

watch(
  () => props.data,
  (val) => {
    // // 转换数据
    transData.value = deepClone(val)
    var id = 0
    // 存储一个临时变量
    for (var item of transData.value) {
      item.__edit = false
      item.__id = ++id
      for (var attr in item) {
        var temp = `${attr}__temp`
        item[temp] = item[attr]
      }
    }
  },
  {
    immediate: true,
    deep: true,
  },
)

// 删除当前此行
const deleteCurrent = (row) => {
  // console.log('----------',row)
  // row.visible = true
}

const getData = () => {
  var arr = deepClone(transData.value)
  for (var item of arr) {
    for (var attr in item) {
      if (attr.includes('__temp')) {
        delete item[attr]
      }
      if (attr === '__id' || attr === '__edit' || attr === '__visible') {
        delete item[attr]
      }
    }
  }
  emit('onChange', arr)
}

// var obj = {}
// for (var column of props.columns) {
//   props.data.forEach((it) => {
//     if (!obj[column.name]) {
//       obj[column.name] = null
//     }
//   })
// }

// 重置数据
const reset = () => {
  transData.value = props.data
  getData()
}

// const visible = ref(false)

// const handleSizeChange = (val: number) => {
//   console.log(`${val} items per page`)
// }

// const listLoading = ref(false)

const enableEdit = (row) => {
  row.__edit = !row.__edit
  for (var attr in row) {
    if (attr !== '__edit') {
      if (!attr.includes('__temp')) {
        row[attr + '__temp'] = row[attr]
      }
    }
  }
}

// 保存
const confirmEdit = (row) => {
  row.__edit = false
  for (var attr in row) {
    if (attr.includes('__temp')) {
      row[attr] = row[attr.replace('__temp', '')]
    }
  }
  getData()
}
// 取消
const cancelEdit = (row) => {
  row.__edit = !row.__edit
  for (var attr in row) {
    if (attr !== '__edit') {
      if (!attr.includes('__temp')) {
        row[attr] = row[attr + '__temp']
      }
    }
  }
}

const deleteAction = (row) => {
  row.__visible = false
  transData.value = transData.value.filter((item) => item.__id !== row.__id)
  emit('del', row)
}

const gen_id = () => {
  var id = transData.value.length + 1
  while (id > 0) {
    var index = transData.value.findIndex(item => item.__id === id)
    if (index === -1) {
      return id
    }
    id++
  }
}

// 添加
const add = () => {
  var id = gen_id()
  var obj_new = Object.assign({}, {
    __id: id,
    __edit: true,
    __visible: false,
  })
  for (var attr in obj_new) {
    var temp = `${attr}__temp`
    obj_new[temp] = obj_new[attr]
  }

  if (props.mode === 'top') {
    transData.value.unshift(obj_new)
  } else {
    transData.value.push(obj_new)
  }
}

const filterOption = (column, scope) => {
  var obj = column.options.find((ite) => ite.value === scope.row[column.name])
  if (obj) {
    return obj.label
  }
  return '--'
}

defineExpose({
  reset,
  add,
})
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.inline-edit-table {
  width: 100%;
}
</style>

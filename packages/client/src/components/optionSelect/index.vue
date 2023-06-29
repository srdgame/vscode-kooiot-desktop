<template>
  <el-select-v2
    v-model="selectValue"
    style="width: 240px"
    filterable
    remote
    :remote-method="remoteMethod"
    clearable
    :options="options"
    :loading="loading"
    :placeholder="t('general.pleaseSelect')"
    @change="selectChanged"
  />
</template>

<script>
export default {
  name: 'OptionSelect',
}
</script>

<script setup>
import { toSQLLine } from '@/utils/stringFun'
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits(['update:modelValue', 'update:dataList'])

const props = defineProps({
  sortKey: {
    default: 'created_at',
    type: String
  },
  sortDesc: {
    default: true,
    type: Boolean
  },
  listApi: {
    default: function() {
      return {}
    },
    required: true,
    type: Function
  },
  formatLabel: {
    default: function(item) {
      var desc = item.description ? item.description : ''
      if (desc.length > 24) {
        desc = desc.slice(0, 21) + '...'
      }
      return item.name + ' : ' + desc
    },
    type: Function
  },
  modelValue: {
    default: 0,
    type: Number
  },
  label: {
    default: 'optionList',
    required: true,
    type: String
  },
  pageSize: {
    default: 20,
    type: Number
  },
  searchKey: {
    default: 'name',
    type: String
  },
  dataList: {
    default: function() {
      return []
    },
    type: Array
  }
})

const selectValue = ref(0)
const dataList = ref([])
const options = ref([{ value: 0, label: '' }])
const loading = ref(false)
const page = ref(1)
const pageSize = ref(props.pageSize)
const inputFilterTimer = ref(null)

watch(() => props.modelValue, (newValue, oldValue) => {
  selectValue.value = newValue
})

watch(() => props.dataList, (newValue, oldValue) => {
  var newOptions = []
  newValue.map((item) => {
    newOptions.push({
      label: props.formatLabel(item),
      value: item.ID,
    })
  })
  options.value = newOptions
})

const remoteMethod = async(query) => {
  loading.value = true
  inputFilterTimer.value && clearTimeout(inputFilterTimer.value)
  inputFilterTimer.value = setTimeout(() => {
    getSelectData(query)
  }, 200)
}
const getSelectData = async(query) => {
  var searchInfo = {
    orderKey: toSQLLine(props.sortKey),
    orderDesc: props.sortDesc
  }
  searchInfo[props.searchKey] = query

  const res = await props.listApi({ page: page.value, pageSize: pageSize.value, ...searchInfo })
  loading.value = false
  if (res.code === 0) {
    if (res.data?.list) {
      dataList.value = res.data.list
    } else {
      dataList.value = []
    }
  } else {
    dataList.value = []
  }
  emit('update:dataList', dataList.value)
}

const selectChanged = (value) => {
  emit('update:modelValue', value)
}

onMounted(async() => {
  getSelectData()
})
</script>

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
  name: 'OptionList',
}
</script>

<script setup>
import { toSQLLine } from '@/utils/stringFun'
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  sortKey: {
    default: 'CreatedAt',
    type: String
  },
  sortDesc: {
    default: true,
    type: Boolean
  },
  searchKey: {
    default: 'name',
    type: String
  },
  listApi: {
    default: function() {
    },
    type: Function
  },
  formatLabel: {
    default: function(item) {
      return item.name
    },
    type: Function
  },
  modelValue: {
    default: 0,
    type: Number
  },
})

const selectValue = ref(0)
const dataList = ref([])
const options = ref([])
const loading = ref(false)
const page = ref(1)
const pageSize = ref(props.pageSize)
const inputFilterTimer = ref(null)

watch(() => props.modelValue, (newValue, oldValue) => {
  selectValue.value = newValue
})

const remoteMethod = (query) => {
  loading.value = true
  inputFilterTimer.value && clearTimeout(inputFilterTimer.value)
  inputFilterTimer.value = setTimeout(() => {
    getOptions(query)
  }, 200)
}

const getOptions = async(query) => {
  var searchInfo = {
    orderKey: toSQLLine(props.sortKey),
    orderDesc: props.sortDesc
  }
  searchInfo[props.searchKey] = query

  const res = await props.listApi({ page: page.value, pageSize: pageSize.value, ...searchInfo.value })
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

  var newOptions = []
  dataList.value.map((item) => {
    newOptions.push({
      label: props.formatLabel(item),
      value: item.ID,
    })
  })
  options.value = newOptions
}

const selectChanged = (value) => {
  emit('update:modelValue', value)
}

onMounted(async() => {
  getOptions()
})

</script>

<style scoped lang="scss">
.gva-select .el-input__inner {
    padding:0 30px !important
}
</style>

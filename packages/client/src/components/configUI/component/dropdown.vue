<template>
  <el-select
    v-model="inputValue"
    filterable
    class="gva-select"
    :placeholder="t('general.pleaseSelect')"
    default-first-option
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script>
export default {
  name: 'ConfigUIDropdown',
}
</script>

<script setup>
import { nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  meta: {
    type: Object,
    required: true
  },
  modelValue: {
    type: String,
    required: true
  }
})

const options = ref([])
const inputValue = ref(props.modelValue)
const internalChange = ref(false)

watch(inputValue, (newValue, oldValue) => {
  internalChange.value = true
  emit('update:modelValue', newValue)
  nextTick(function() {
    internalChange.value = false
  })
})

watch(() => props.modelValue, (val, old_val) => {
  if (!internalChange.value) {
    inputValue.value = val
  }
})

const loadMeta = (meta) => {
  const option_list = []
  meta.values.forEach(item => {
    if (typeof (item) === 'object') {
      option_list.push({
        value: item.value,
        label: item.name
      })
    } else {
      option_list.push({
        value: item,
        label: item
      })
    }
  })
  options.value = option_list
  // console.log('OptionList', option_list)
}

watch(() => props.meta, (newValue, oldValue) => {
  loadMeta(newValue)
})

loadMeta(props.meta)

</script>

<style scoped lang="scss">
.gva-select .el-input__inner {
    padding:0 30px !important
}
</style>

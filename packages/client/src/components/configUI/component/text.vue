<template>
  <el-input
    v-model="valueStr"
    :autosize="{ minRows: 4, maxRows: 10 }"
    type="textarea"
    :placeholder="inputHolder"
  />
</template>

<script>
export default {
  name: 'ConfigUIText',
}
</script>

<script setup>
import { onMounted, computed, nextTick, ref, watch } from 'vue'
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
    type: String,
    required: true
  }
})

const valueStr = ref(props.modelValue)
const inputHolder = computed(() => { return t('general.pleaseEnter') + props.meta.desc })
const internalChange = ref(false)

watch(valueStr, (newValue, oldValue) => {
  internalChange.value = true
  emit('update:modelValue', newValue)
  nextTick(function() {
    internalChange.value = false
  })
})

watch(() => props.modelValue, (val, old_val) => {
  if (!internalChange.value) {
    valueStr.value = val
  }
})

onMounted(async() => {
  // console.log('mmmmmmmmmmmmmm')
  // tableSchema.value = schema_to_map(props.meta?.cols, {})
})

</script>

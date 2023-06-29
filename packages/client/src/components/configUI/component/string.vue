<template>
  <el-input v-model="valueStr" :placeholder="inputHolder" />
</template>

<script>
export default {
  name: 'ConfigUIString',
}
</script>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'

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
const inputHolder = computed(() => { return '请输入' + props.meta.desc })
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
</script>

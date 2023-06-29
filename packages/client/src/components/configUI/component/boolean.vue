<template>
  <el-checkbox v-model="inputValue" />
</template>

<script>
export default {
  name: 'ConfigUIBoolean',
}
</script>

<script setup>

import { nextTick, ref, watch } from 'vue'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  meta: {
    default: () => {},
    type: Object,
    required: true
  },
  modelValue: {
    default: false,
    type: Boolean,
    required: true
  }
})

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
</script>

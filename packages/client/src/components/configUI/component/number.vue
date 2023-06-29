<template>
  <el-input
    v-model.number="valueNumber"
    :placeholder="inputHolder"
    :formatter="(value) => `${value}`.replace(/[^0-9.]/g, '')"
    :parser="(value) => value.replace(/[^0-9.]/g, '')"
  />
</template>

<script>
export default {
  name: 'ConfigUINumber',
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
    type: Number,
    required: true
  }
})

const valueNumber = ref(props.modelValue)
const inputHolder = computed(() => { return '请输入' + props.meta.desc })
const internalChange = ref(false)

watch(valueNumber, (newValue, oldValue) => {
  internalChange.value = true
  emit('update:modelValue', newValue)
  nextTick(function() {
    internalChange.value = false
  })
})

watch(() => props.modelValue, (val, old_val) => {
  if (!internalChange.value) {
    valueNumber.value = val
  }
})

</script>

<template>
  <div>
    <el-table
      :data="csvData"
      :height="!viewOnly ? 360 : 600"
      border
    >
      <el-table-column
        v-for="col in headings"
        :key="col.id"
        :prop="col.value"
        :label="col.text"
      />
    </el-table>
    <label v-if="!viewOnly" class="text-reader">
      <input type="file" @change="loadCSVFromFile">
    </label>
  </div>
</template>

<script>
export default {
  name: 'CSVFileParser',
}
</script>

<script setup>
import Papa from 'papaparse'
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: { type: String, required: true },
  viewOnly: { type: Boolean, default: false }
})

const headings = ref([])
const csvData = ref([])
const parseError = ref('')
const disabled = ref(true)

watch(() => props.modelValue, function(newValue, oldValue) {
  if (newValue !== oldValue) {
    loadCSVFromString(props.modelValue)
  }
})

watch(parseError, function(newError, oldError) {
  if (newError && newError.length() > 0) {
    ElMessage({
      type: 'error',
      message: newError,
      showClose: true
    })
  }
})

onMounted(async() => {
  props.modelValue ? loadCSVFromString(props.modelValue) : null
})

const loadCSVFromString = async(csv_str) => {
  // console.log(csv_str)
  if (!csv_str) {
    headings.value = []
    csvData.value = []
    return
  }
  const parsedCsv = Papa.parse(csv_str, { header: true })
  csvData.value = parsedCsv.data

  // Enable Searchfield
  disabled.value = false
  // Handle Parsing errors
  parseError.value = parsedCsv.errors[2]

  // Invoke getHeaders function and pass csv data
  getHeaders(csvData.value)
}

const loadCSVFromFile = async(ev) => {
  const file = ev.target.files[0]
  const reader = new FileReader()

  // Only allow csv files
  if (file.type === 'text/csv') {
    // Parse csv on load
    reader.onload = (e) => {
      emit('update:modelValue', e.target.result)
    }

    reader.readAsText(file)
  } else {
    parseError.value = 'Please upload a csv file'
  }
}

const getHeaders = function(data) {
  const headers = Object.keys(data[0])
  headings.value = []
  headers.forEach((header, index) => {
    // Construct object format required for Vuetify table component
    headings.value.push({ id: index, text: header, value: header })
  })
}
</script>

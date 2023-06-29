<template>
  <el-collapse v-model="activeNames" @change="handleChanges">
    <el-collapse-item name="meta">
      <template #title>
        {{ t('iot.deviceMetaInfo') }}<i class="header-icon el-icon-info" style="padding-left:10px" />
      </template>
      <el-form label-position="left" label-width="120px" inline class="meta-info-expand">
        <el-form-item :label="t('iot.appID')">
          <span>{{ meta.app }}</span>
        </el-form-item>
        <el-form-item :label="t('iot.deviceManufactory')">
          <span>{{ meta.manufacturer }}</span>
        </el-form-item>
        <el-form-item :label="t('iot.deviceName')">
          <span>{{ meta.name }}</span>
        </el-form-item>
        <el-form-item :label="t('iot.deviceDetailInfo')">
          <span>{{ meta.link }}</span>
        </el-form-item>
        <el-form-item :label="t('iot.operationMS')">
          <el-button link icon="setting" @click="TODO(t('iot.deviceViewSCADA'))">{{ t('iot.deviceViewSCADA') }}</el-button>
          <el-button link icon="setting" @click="TODO(t('iot.deviceConnectSCADA'))">{{ t('iot.deviceConnectSCADA') }}</el-button>
        </el-form-item>
      </el-form>
      <!-- <div :style="{display:'inline-block',float:'right'}">
        <el-button link icon="setting" @click="TODO('查看组态界面')">查看组态界面</el-button>
        <el-button link icon="setting" @click="TODO('关联组态界面')">关联组态界面</el-button>
      </div> -->
    </el-collapse-item>
    <el-collapse-item :disabled="inputs.length === 0" name="inputs">
      <template #title>
        {{ t('iot.deviceDataList') }} <i class="header-icon el-icon-info" style="padding-left:10px"> {{ inputs.length }} </i>
      </template>
      <input-list v-model="inputs" :device="sn" />
    </el-collapse-item>
    <el-collapse-item :disabled="outputs.length === 0" name="outputs">
      <template #title>
        {{ t('iot.deviceOutputList') }} <i class="header-icon el-icon-info" style="padding-left:10px"> {{ outputs.length }} </i>
      </template>
      <output-list v-model="outputs" :device="sn" />
    </el-collapse-item>
    <el-collapse-item :disabled="commands.length === 0" name="commands">
      <template #title>
        {{ t('iot.deviceCommandList') }} <i class="header-icon el-icon-info" style="padding-left:10px"> {{ commands.length }} </i>
      </template>
      <command-list v-model="commands" :device="sn" />
    </el-collapse-item>
  </el-collapse>
  <!-- <div>
    <input-list v-model="value.inputs" :device="value.sn" />
    <output-list v-model="value.outputs" :device="value.sn" />
    <command-list v-model="value.commands" :device="value.sn" />
  </div> -->
</template>

<script>
export default {
  name: 'IotDeviceDetailDeviceModel',
}
</script>

<script setup>
import inputList from './inputList.vue'
import outputList from './outputList.vue'
import commandList from './commandList.vue'
import { ElMessage } from 'element-plus'
import { computed, watch, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  modelValue: {
    default: () => {},
    required: true,
    type: Object
  },
  expandInputs: {
    type: Boolean
  }
})

const expandInput = ref(!!props.expandInputs)
const activeNames = ref(props.expandInputs ? ['inputs'] : [])
const inputs = ref(props.modelValue?.inputs || [])
const outputs = ref(props.modelValue?.outputs || [])
const commands = ref(props.modelValue?.commands || [])

watch(() => props.modelValue, (val, old_val) => {
  if (val) {
    inputs.value = val.inputs || []
    outputs.value = val.outputs || []
    commands.value = val.commands || []
  }
})

const sn = computed(() => {
  return props.modelValue.sn ? props.modelValue.sn : ''
})

const meta = computed(() => {
  return props.modelValue?.meta ? props.modelValue.meta : {}
})

const handleChanges = (activeNames) => {
}

watch(activeNames, (val, old_val) => {
  if (val.indexOf('inputs') !== -1) {
    if (!expandInput.value) {
      expandInput.value = true
      props.modelValue.addShow()
    }
  } else {
    if (expandInput.value) {
      expandInput.value = false
      props.modelValue.delShow()
    }
  }
})

const TODO = (feature) => {
  ElMessage({
    type: 'warning',
    message: feature + t('iot.notImplemented')
  })
}
</script>

<style scoped>
  .meta-info-expand {
    font-size: 0;
  }
  .meta-info-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .meta-info-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>

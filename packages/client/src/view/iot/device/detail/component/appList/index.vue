<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :style="{paddingLeft:'10px', paddingRight:'10px'}">
      <el-form-item>
        <el-button v-if="device.online" link style="color: #67C23A" icon="link"> {{ t('iot.online') }} </el-button>
        <el-button v-else link style="color: #dc143c" icon="loading"> {{ t('iot.offline') }}... </el-button>

        <el-button v-if="deviceStatus.data_upload" link style="color: #67C23A" icon="upload"> {{ t('iot.dataUploadEnable') }} </el-button>
        <el-button v-else link style="color: #606266" icon="circle-close"> {{ t('iot.dataUploadDisabled') }} </el-button>

        <el-button v-if="connected" link style="color: #67C23A" icon="upload"> {{ t('iot.dataChannelOpen') }} </el-button>
        <el-button v-else link style="color: #dc143c" icon="circle-close"> {{ t('iot.dataChannelClosed') }} </el-button>
      </el-form-item>
      <el-form-item :style="{display:'inline-block',float:'right'}">
        <el-button type="primary" icon="refresh-right" @click="getTableData()">{{ t('iot.refreshAppList') }}</el-button>
        <el-button type="primary" icon="plus" @click="installApp">{{ t('iot.installApp') }}</el-button>
      </el-form-item>
      <el-form-item :style="{display:'inline-block',float:'right'}">
        <el-input
          v-model="search"
          :placeholder="t('iot.searchKeywordTip2')"
        />
      </el-form-item>
    </el-form>

    <!-- 由于此处菜单跟左侧列表一一对应所以不需要分页 pageSize默认999 -->
    <el-table :data="allData" border row-key="inst" :row-class-name="tableRowClassName">
      <el-table-column type="expand">
        <template #default="scope">
          <el-form label-position="left" label-width="120px" inline class="demo-table-expand" style="padding-left: 58px">
            <el-form-item :label="t('iot.appInstName')">
              <span>{{ scope.row.inst }}</span>
              <el-tooltip :content="t('iot.renameAppInstName')" placement="top">
                <el-button link icon="edit" @click="renameApp(scope.row)" />
              </el-tooltip>
            </el-form-item>
            <el-form-item :label="t('iot.appID')">
              <span>
                {{ scope.row.name }}
                <el-button
                  link
                  @click="openApp(scope.row)"
                > {{ t('iot.appDetail') }} </el-button>
              </span>
            </el-form-item>
            <el-form-item :label="t('iot.appAutoStart')">
              <WaitableSwitch
                option="EnableData"
                :desc="t('iot.appAutoStart')"
                :val="scope.row.auto!==0"
                @change="(val, option, desc) => {changeAuto(scope.row, val)}"
              />
            </el-form-item>
            <el-form-item :label="t('iot.appDeveloper')">
              <span>{{ scope.row.app ? scope.row.app.user.userName : t('iot.localApp') }}</span>
            </el-form-item>
            <el-form-item :label="t('iot.appStatus')">
              <span>
                <el-tag v-if="scope.row.running" type="success">{{ t('iot.running') }}</el-tag>
                <el-tag v-else type="danger">{{ t('iot.stopped') }}</el-tag>
                {{ formatDate(scope.row.start) }}
              </span>
            </el-form-item>
            <el-form-item :label="t('iot.latestVersion')">
              <span>{{ scope.row.app ? scope.row.app_latest.version : 0 }}</span>
            </el-form-item>
            <el-form-item :label="t('iot.appOperations')">
              <el-button-group>
                <el-button type="success" icon="video-play" @click="startApp(scope.row)"> {{ t('iot.appStart') }} </el-button>
                <el-button type="warning" icon="refresh-right" @click="restartApp(scope.row)"> {{ t('iot.appRestart') }} </el-button>
                <el-button type="danger" icon="switch-button" @click="stopApp(scope.row)"> {{ t('iot.appStop') }} </el-button>
              </el-button-group>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column :label="t('iot.appInstName')" width="180" prop="inst" sortable />
      <el-table-column :label="t('iot.appName')" min-width="120" prop="name" sortable />
      <el-table-column :label="t('iot.appVersion')" width="120" prop="version" sortable>
        <template #default="scope">
          <div
            v-if="scope.row.version < scope.row.lastest_version"
            class="name-wrapper"
          >
            {{ scope.row.version }}
          </div>
          <div v-else class="name-wrapper">
            <el-tag v-if="scope.row.version===0">{{ t('iot.localApp') }}</el-tag>
            <div v-else> {{ scope.row.version }}
              <i v-if="scope.row.app_latest && scope.row.app_latest.version > scope.row.version">
                <el-tooltip :content="t('iot.appUpgradeTo') + ` ${scope.row.app_latest.version}`" placement="top">
                  <el-button
                    link
                    type="warning"
                    @click="upgradeApp(scope.row, scope.row.app_latest.version)"
                  >
                    <el-icon><Promotion /></el-icon> {{ scope.row.app_latest.version }}
                  </el-button>
                </el-tooltip>
              </i>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="t('iot.status')" width="90" prop="running" sortable>
        <template #default="scope">
          <el-tag v-if="scope.row.running" type="success">{{ t('iot.running') }}</el-tag>
          <el-tag v-else type="danger">{{ t('iot.stopped') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('iot.startTIme')" width="180" prop="start" sortable>
        <template #default="scope">
          <span>{{ formatDate(scope.row.start) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        align="center"
        width="180"
      >
        <template #header>
          <el-input
            v-model="search"
            :placeholder="t('iot.searchKeywordTip2')"
          />
        </template>
        <template #default="scope">
          <el-button-group>
            <el-button type="primary" icon="setting" link @click="configApp(scope.row)"> {{ t('iot.appConfiguration') }} </el-button>
            <el-button type="danger" icon="delete" link @click="uninstallApp(scope.row)"> {{ t('iot.appRemove') }} </el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <!-- <el-table-column fixed="right" :label="t('general.operations')" width="180">
        <template #default="scope">
          <el-button-group>
            <el-button type="primary" icon="setting" link @click="configApp(scope.row)"> {{ t('iot.appConfiguration') }} </el-button>
            <el-button type="danger" icon="delete" link @click="uninstallApp(scope.row)"> {{ t('iot.appRemove') }} </el-button>
          </el-button-group>
        </template>
      </el-table-column> -->
    </el-table>

    <el-dialog v-model="dialogFormVisible" :before-close="handleClose" :title="dialogTitle">
      <el-form
        ref="editForm"
        :inline="true"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item :label="t('iot.appInstName')" prop="inst" style="width:30%">
          <el-input
            v-model="form.inst"
            :disabled="isEdit"
            autocomplete="off"
            :placeholder="t('iot.appInstNameTip')"
            @change="changeInst"
          />
        </el-form-item>
      </el-form>
      <configUI />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">{{ t('iot.cancel') }}</el-button>
          <el-button type="primary" @click="enterDialog"> {{ t('iot.confirm') }}</el-button>
        </div>
      </template>
    </el-dialog>

    <el-drawer
      v-model="drawerShow"
      direction="rtl"
      size="80%"
      :show-close="false"
    >
      <template #header="{ close, titleId, titleClass }">
        <h4 :id="titleId" :class="titleClass">{{ drawerTitle }}</h4>
        <el-button type="primary" @click="refAppConfig.save()">
          <el-icon class="el-icon--left"><Promotion /></el-icon>
          {{ t('general.save') }}
        </el-button>
        <el-button icon="refresh" @click="refAppConfig.reload()">{{ t('general.reset') }}</el-button>
        <el-button type="danger" @click="close">
          <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
          {{ t('general.close') }}
        </el-button>
      </template>
      <app-config v-if="drawerShow" ref="refAppConfig" :device="device" :status="props.status" :inst-info="drawerInst" />
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'IOTDeviceDetailAppList',
}
</script>

<script setup>
import { formatTimeToStr } from '@/utils/date'
import {
  list_app,
  install_app,
  uninstall_app,
  upgrade_app,
  config_app,
  start_app,
  stop_app,
  restart_app,
  option_app,
  rename_app
} from '@/api/local/device/app'
import configUI from '@/components/configUI/index.vue'
import WaitableSwitch from '@/components/waitableSwitch/index.vue'
import appConfig from './appConfig.vue'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useDeviceStore } from '@/pinia/modules/device'
import { useActionsStore } from '@/pinia/modules/actions'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
const deviceStore = useDeviceStore()
const actionStore = useActionsStore()
const refAppConfig = ref()

const emit = defineEmits(['installApp'])

const formatDate = function(time) {
  if (time === 0) {
    return ''
  }
  return formatTimeToStr(time * 1000)
}

const props = defineProps({
  device: {
    required: true,
    type: Object
  },
  status: {
    default: () => {},
    required: true,
    type: Object
  },
  isShow: {
    required: true,
    type: Boolean
  }
})

const search = ref('')
const checkFlag = ref(false)
const dialogFormVisible = ref(false)
const dialogTitle = ref(t('iot.appInstNameChangeTitle'))
const form = ref({
  ID: 0,
  path: '',
  name: '',
  hidden: '',
  parentId: '',
  component: '',
  meta: {
    title: '',
    icon: '',
    defaultMenu: false,
    closeTab: false,
    keepAlive: false
  },
  parameters: []
})

const rules = ref({
  inst: [{ required: true, message: t('iot.appInstNameTip'), trigger: 'blur' }]
})

const tableData = ref([])
const allData = computed(() => {
  return tableData.value ? tableData.value.filter(data => !search.value ||
    data.name.toLowerCase().includes(search.value.toLowerCase()) ||
    data.inst.toLowerCase().includes(search.value.toLowerCase())) : []
})

const isEdit = ref(false)
const checkTimer = ref(null)
const drawerTitle = ref(t('iot.modifyAppConfig'))
const drawerShow = ref(false)
const drawerInst = ref({})

const connected = computed(() => {
  return deviceStore.connected
})

const deviceStatus = computed(() => {
  return props.status
})

const getTableData = async() => {
  const res = await list_app({ device: props.device.sn })
  if (res.code === 0) {
    tableData.value = res.data.apps
  }
}

const onCreated = async() => {
  props.device ? await getTableData() : null
  checkTimer.value = setInterval(() => {
    if (props.isShow) {
      getTableData()
    }
  }, 3000)
}

onCreated()

watch(() => props.device, (val, old_val) => {
  if (val.sn !== old_val.sn) {
    getTableData()
  }
})

const tableRowClassName = ({ row, rowIndex }) => {
  if (rowIndex === 1) {
    return 'warning-row'
  } else if (rowIndex === 3) {
    return 'success-row'
  }
  return ''
}

const openApp = (row) => {
  router.push({
    name: 'store.user_app',
    params: {
      app: row.name,
      title: t('iot.application') + ' - ' + row.name
    }
  })
}

const handleClose = (done) => {
  initForm()
  done()
}

const initForm = () => {
  checkFlag.value = false
  editForm.value.resetFields()
  form.value = {
    ID: 0,
    path: '',
    name: '',
    hidden: '',
    parentId: '',
    component: '',
    meta: {
      title: '',
      icon: '',
      defaultMenu: false,
      keepAlive: ''
    }
  }
}

const closeDialog = () => {
  initForm()
  dialogFormVisible.value = false
}

const enterDialog = async() => {
  editForm.value.validate(async valid => {
    if (valid) {
      let res
      if (isEdit.value) {
        res = await config_app(form.value)
      } else {
        res = await install_app(form.value)
      }
      if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: isEdit.value ? t('general.editSuccess') : t('general.addSuccess')
        })
        getTableData()
      }
      initForm()
      dialogFormVisible.value = false
    }
  })
}

const installApp = () => {
  emit('installApp')
}

const uninstallApp = (row) => {
  ElMessageBox.confirm(t('iot.removeAppConfirmMsg') + row.inst + '?', t('general.hint'), {
    confirmButtonText: t('general.confirm'),
    cancelButtonText: t('general.cancel'),
    type: 'warning'
  })
    .then(async() => {
      const res = await uninstall_app({
        device: props.device.sn,
        inst: row.inst,
        reason: t('iot.appRemoveByUserAction')
      })
      if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: t('general.deleteSuccess')
        })
        if (tableData.value.length === 1 && page.value > 1) {
          page.value--
        }
        getTableData()
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: t('iot.removeAppException')
      })
    })
}

const configApp = (row) => {
  drawerTitle.value = t('iot.modifyApp') + ` ${row.inst} ` + t('iot.appConfiguration')
  drawerInst.value = row
  drawerShow.value = true
}

// 启动应用
const startApp = async(row) => {
  const data = {
    device: props.device.sn,
    inst: row.inst,
    reason: t('iot.startAppReasonWeb')
  }
  const res = await start_app(data)
  if (res.code === 0) {
    actionStore.PushAction({ id: res.data.id, name: t('iot.appStartApp') + ` ${row.inst} - ${props.device.sn}`, data: row })
    ElMessage({
      type: 'success',
      message: t('iot.appStartReqSuccess'),
      showClose: true
    })
  }
}
// 停止应用
const stopApp = async(row) => {
  const data = {
    device: props.device.sn,
    inst: row.inst,
    reason: t('iot.appStopReasonWeb')
  }
  const res = await stop_app(data)
  if (res.code === 0) {
    actionStore.PushAction({ id: res.data.id, name: t('iot.appStopApp') + ` ${row.inst} - ${props.device.sn}`, data: row })
    ElMessage({
      type: 'success',
      message: t('iot.appStopReqSuccess'),
      showClose: true
    })
  }
}
// 重启应用
const restartApp = async(row) => {
  const data = {
    device: props.device.sn,
    inst: row.inst,
    reason: t('iot.appRestartReasonWeb')
  }
  const res = await restart_app(data)
  if (res.code === 0) {
    actionStore.PushAction({ id: res.data.id, name: t('iot.appRestartApp') + ` ${row.inst} - ${props.device.sn}`, data: row })
    ElMessage({
      type: 'success',
      message: t('iot.appRestartReqSuccess'),
      showClose: true
    })
  }
}

// 修改应用名称
const renameApp = async(row) => {
  const res = await rename_app(row)
  if (res.code === 0) {
    actionStore.PushAction({ id: res.data.id, name: t('iot.appUpgradeApp') + ` ${row.inst} - ${props.device.sn}`, data: row })
    ElMessage({
      type: 'success',
      message: t('iot.appUpgradeReqSuccess'),
      showClose: true
    })
  }
}

const upgradeApp = async(row, version) => {
  ElMessageBox.confirm(t('iot.appUpgradeConfirmMsg1') + row.inst + t('iot.appUpgradeConfirmMsg2') + version + '?', t('general.hint'), {
    confirmButtonText: t('general.confirm'),
    cancelButtonText: t('general.cancel'),
    type: 'warning'
  })
    .then(async() => {
      const data = {
        device: props.device.sn,
        inst: row.inst,
        reason: t('iot.appUpgradeReasonWeb'),
        version: version,
        name: row.app.app_id
      }
      const res = await upgrade_app(data)
      if (res.code === 0) {
        actionStore.PushAction({ id: res.data.id, name: t('iot.appUpgradeApp') + ` ${row.inst} - ${props.device.sn}`, data: row })
        ElMessage({
          type: 'success',
          message: t('iot.appUpgradeReqSuccess'),
          showClose: true
        })
      }
    })
}

const changeAuto = async(row, val) => {
  const data = {
    device: props.device.sn,
    inst: row.inst,
    option: 'auto',
    value: val ? 1 : 0
  }
  const res = await option_app(data)
  if (res.code === 0) {
    actionStore.PushAction({ id: res.data.id, name: t('iot.appAutoStartOptionChange') + ` ${row.inst} - ${props.device.sn}`, data: row })
    ElMessage({
      type: 'success',
      message: t('iot.appAutoStartOptionChangeReqSuccess'),
      showClose: true
    })
  }
}

</script>

<style scoped lang="scss">
.warning {
  color: #dc143c;
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>

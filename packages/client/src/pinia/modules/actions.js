import { formatTimeToStr } from '@/utils/date'
import { action_result } from '@/api/local/device/data'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

function showSuccess(item) {
  // var result = item.result
  // console.log(result)
  ElMessage({
    showClose: true,
    message: item.data.name + '成功',
    type: 'success'
  })
}

function showError(item) {
  var result = item.result
  // console.log(result)
  var error = item.data.name + result.message ? result.message : '失败'
  ElMessage({
    showClose: true,
    message: error,
    type: 'error'
  })
}

const actionCheck = async(action) => {
  // console.log(action)
  const now = new Date()
  console.log(action.timeout, now.getTime(), action.timeout < now.getTime())
  if (action.timeout < now.getTime()) {
    action.result = {
      id: action.data.id,
      result: false,
      message: '命令结果查询超时',
      timestamp: now.getTime() / 1000,
      timestamp_str: formatTimeToStr(now)
    }
    return
  }
  const res = await action_result({ id: action.data.id })
  if (res.code !== 0) {
    action.result = {
      id: action.data.id,
      result: false,
      message: res.data.msg || decodeURI(res.headers.msg),
      timestamp: now.getTime() / 1000,
      timestamp_str: formatTimeToStr(now)
    }
  } else {
    const result = res.data?.result
    if (result && result.id === action.data.id) {
      action.result = result
    }
  }
  return
}

var action_check_timer = null

export const useActionsStore = defineStore('actions', () => {
  const actions = ref({})
  const checks = ref([])

  const PushAction = (action) => {
    if (!action.id) {
      console.log('Missing action ID')
      return
    }
    // console.log('pushAction', action)
    var now = new Date()
    var timeout = new Date(now.getTime() + (action.timeout ? action.timeout : 60) * 1000)
    var toDeleteTime = new Date(now.getTime() + 60 * 60 * 1000)
    actions.value[action.id] = { data: action, timeout: timeout.getTime(), delete_time: toDeleteTime.getTime() }
    checks.value.push(action.id)

    if (!action_check_timer) {
      action_check_timer = setInterval(() => {
        CheckActions()
      }, 2000)
    }
  }
  const ClearActions = () => {
    actions.value.clear()
    checks.value = []
  }
  const RemoveFromCheck = (index_list) => {
    index_list.forEach(index => {
      checks.value.splice(index, 1)
    })
  }
  const RemoveHistory = (ids) => {
    ids.forEach(id => {
      delete actions.value[id]
    })
  }
  const StartTimer = async(sn) => {
    if (!action_check_timer) {
      action_check_timer = setInterval(() => {
        CheckActions()
      }, 2000)
    }
  }
  const CheckActions = async() => {
    var toDelete = []
    for (let i = 0; i < checks.value.length; i++) {
      // console.log(i, checks.value)
      const item = checks.value[i]
      const action = actions.value[item]
      if (action) {
        await actionCheck(action)
        if (action.result) {
          action.result.result ? showSuccess(action) : showError(action)
          toDelete.unshift(i)
        }
      } else {
        toDelete.unshift(i)
      }
    }
    if (toDelete.length > 0) {
      RemoveFromCheck(toDelete)
    }

    toDelete = []
    const now = new Date()
    for (var key in actions.value) {
      var action = actions.value[key]
      if (action.delete_time < now.getTime()) {
        toDelete.push(key)
      }
    }
    if (toDelete.length > 0) {
      RemoveHistory(toDelete)
    }
  }

  return {
    actions,
    checks,
    PushAction,
    ClearActions,
    StartTimer,
    CheckActions
  }
})

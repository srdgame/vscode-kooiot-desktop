
import { Device } from '@/utils/device'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useMqttStore } from './mqtt'

const mqttStore = useMqttStore()

export const useDeviceStore = defineStore('device', () => {
  const deviceMap = []
  const checkTimer = ref(null)

  const Connect = () => {
    mqttStore.Connect()

    if (checkTimer.value) {
      return
    }

    checkTimer.value = setInterval(() => {
      CheckAliveDevice({})
    }, 5000)
  }

  const Disconnect = () => {
    mqttStore.Disconnect()

    if (checkTimer.value) {
      clearTimeout(checkTimer.value)
      checkTimer.value = null
    }
  }

  const RemoveDevice = (sn) => {
    const index = deviceMap.findIndex(dev => dev.sn === sn)
    if (index !== -1) {
      deviceMap[index].destroy()
      deviceMap.splice(index, 1)
    }
  }
  const RemoveFromCheck = (index_list) => {
    index_list.forEach(index => {
      deviceMap[index].destroy()
      deviceMap.splice(index, 1)
    })
  }

  const GetDevice = async(sn) => {
    const index = deviceMap.findIndex(dev => dev.sn === sn)
    if (index !== -1) {
      return deviceMap[index]
    }
    const dev = new Device(mqttStore.Client, sn, [])
    // console.log('push to deviceMap', dev)
    deviceMap.push(dev)
    // const dev2 = deviceMap.find(dev => dev.sn === sn)
    // console.log('push to deviceMap222', dev2)
    return dev
  }

  const CheckAliveDevice = async() => {
    var toDelete = []
    // console.log('checkAliveDevice', deviceMap.value.length)
    for (let i = 0; i < deviceMap.length; i++) {
      var dev = deviceMap[i]
      if (dev.IsNeedClear()) {
        console.log('Device tick timeout')
        toDelete.unshift(i)
      }
    }
    if (toDelete.length > 0) {
      RemoveFromCheck(toDelete)
    }
  }

  const connected = computed(() => {
    return mqttStore.Connected
  })

  const SaveDeviceList = (sn, list) => {
    const key = 'dev_list_' + sn
    const data = JSON.stringify(list)
    console.log('SaveDeviceList', sn, data)
    window.localStorage.setItem(key, data)
  }

  const LoadDeviceList = (sn) => {
    const key = 'dev_list_' + sn
    const data = window.localStorage.getItem(key) || '[]'
    // console.log('LoadDeviceList', sn, data)
    return JSON.parse(data) || []
  }

  const SaveActiveTab = (sn, tab) => {
    const key = 'dev_active_tab_' + sn
    window.localStorage.setItem(key, tab)
  }
  const LoadActiveTab = (sn, def) => {
    const key = 'dev_active_tab_' + sn
    return window.localStorage.getItem(key) || def
  }

  return {
    Connect,
    Disconnect,
    RemoveDevice,
    CheckAliveDevice,
    GetDevice,
    connected,
    SaveDeviceList,
    LoadDeviceList,
    SaveActiveTab,
    LoadActiveTab
  }
})

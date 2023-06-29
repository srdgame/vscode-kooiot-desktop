
import DeviceMQTT from '@/utils/deviceMQTT'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './user'

const mqtt_port = ref(import.meta.env.VITE_MQTT_PORT)

const getMQTTPath = () => {
  // return 'ws://127.0.0.1:8083/mqtt'
  return `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.hostname}:${mqtt_port.value}`
}

export const useMqttStore = defineStore('mqtt', () => {
  const url = ref(getMQTTPath())
  const mqtt = ref(null)

  const Connect = () => {
    const userStore = useUserStore()
    const userInfo = userStore.userInfo
    const token = userStore.token

    if (mqtt.value) {
      if (!mqtt.value.connnected) {
        mqtt.value.connect()
      }
      return
    }
    mqtt.value = new DeviceMQTT(url.value, userInfo.userName, userInfo.uuid, token)
    mqtt.value.connect()
  }

  const Disconnect = () => {
    if (mqtt.value) {
      mqtt.value.disconnect()
      mqtt.value = null
    }
  }

  const Connected = computed(() => {
    return mqtt.value ? mqtt.value.connected : false
  })

  const Client = computed(() => {
    return mqtt.value
  })

  return {
    Connect,
    Disconnect,
    Connected,
    Client,
  }
})

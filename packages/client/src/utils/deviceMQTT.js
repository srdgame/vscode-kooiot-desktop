import pako from 'pako'
import mqtt from 'mqtt'
import { ElMessage } from 'element-plus'
import { formatTimeToStr } from './date'
import { base64decode } from './iot'
import { useI18n } from 'vue-i18n'

function getLocalTime(nS) {
  return formatTimeToStr(nS * 1000)
}

function showSuccess(info) {
  console.log(info)
  ElMessage({
    showClose: true,
    message: info,
    type: 'success'
  })
}

function showError(error) {
  console.log(error)
  ElMessage({
    showClose: true,
    message: error,
    type: 'error'
  })
}

const make_client_id = () => {
  var text = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < 8; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

const topic_regex = new RegExp('^([^/]+)/(.+)$')
const data_path_regex = new RegExp('^([^/]+)/([^/]+)/(.+)$')

const log_content_regex = new RegExp(/^\[(\w+)\]: ::(\w+)::\s+([\s\S]+)$/)
const log_content_regex_2 = new RegExp(/^\[(\w+)\]:([\s\S]+)$/)

// 'wss://' + this.host + '/ws'
export default class DeviceMQTT {
  constructor(url, user, user_uuid, token) {
    this.url = url
    this.user = user
    this.user_uuid = user_uuid
    this.token = token
    this.die_time = 0
    this.connected = false
    this.receivers = {}
  }

  subscribe(topic, receiver) {
    var list = this.receivers[topic]
    if (list) {
      list.push(receiver)
    } else {
      list = [receiver]
      this.client.subscribe(topic)
    }
    this.receivers[topic] = list
  }

  unsubscribe(topic, receiver) {
    var list = this.receivers[topic]
    if (list) {
      const index = list.findIndex(item => {
        return item === receiver
      })
      if (index === -1) {
        console.log('Failed to unsubscribe', topic, receiver)
        return
      }
      list.splice(index, 1)
      if (list.length === 0) {
        this.client.unsubscribe(topic)
        delete this.receivers[topic]
      }
    } else {
      this.client.unsubscribe(topic)
    }
  }

  disconnect() {
    console.log('disconnect called')
    this.die_time = 0
    if (this.client) {
      this.client.end()
      this.client = null
      this.connected = false
    }
  }
  connect() {
    const { t } = useI18n()
    this.die_time = 120 // 120 seconds

    const options = {
      connectTimeout: 5000, // 超时时间
      // 认证信息
      clientId: this.user + '-' + make_client_id(),
      username: 'user=' + this.user_uuid,
      password: this.token,
      clean: true,
      reconnectPeriod: 3000,
      resubscribe: true,
      reschedulePings: true
    }
    try {
      this.client = mqtt.connect(this.url, options)
    } catch (error) {
      console.log('mqtt.connect error', error)
    }
    this.client.on('connect', () => {
      this.connected = true
      showSuccess(t('iot.mqtt.channelConnected'))
    })
    this.client.on('error', (error) => {
      showError(error)
    })
    this.client.on('disconnect', () => {
      this.connected = false
      showError(t('iot.mqtt.channelDisconnected'))
    })
    this.client.on('offline', () => {
      showError(t('iot.mqtt.channelOffline'))
      this.connected = false
    })
    this.client.on('reconnect', () => {
      showError(t('iot.mqtt.channelReconnect'))
    })
    this.client.on('end', () => {
      showError(t('iot.mqtt.channelEnd'))
    })

    this.client.on('message', (topic, msg) => {
      // console.log('WS receive', topic)
      const groups = topic_regex.exec(topic)
      if (!groups) {
        console.log('Topic match error', topic)
        return
      }
      // const gateway = groups[1]
      const msg_topic = groups[2]

      if (msg_topic === 'comm') {
        // console.log(msg_topic, msg.toString())
        const data = JSON.parse(msg.toString())
        this.onReceiveCommMsg(topic, data)
      } else if (msg_topic === 'log') {
        // console.log(msg_topic, msg.toString())
        const data = JSON.parse(msg.toString())
        this.onReceiveLogMsg(topic, data)
      } else if (msg_topic === 'data') {
        const data = JSON.parse(msg.toString())
        this.onReceiveData(topic, data)
      } else if (msg_topic === 'data_gz') {
        const data_list = JSON.parse(pako.inflate(msg, { to: 'string' }))
        this.onReceiveDataList(topic, data_list)
      } else if (msg_topic === 'device') {
        const data = JSON.parse(msg.toString())
        this.onReceiveDevice(topic, data)
      } else if (msg_topic === 'device_gz') {
        const data = JSON.parse(pako.inflate(msg, { to: 'string' }))
        this.onReceiveDevice(topic, data)
      } else if (msg_topic === 'devices') {
        const data = JSON.parse(msg.toString())
        this.onReceiveDeviceMap(topic, data)
      } else if (msg_topic === 'devices_gz') {
        const data = JSON.parse(pako.inflate(msg, { to: 'string' }))
        this.onReceiveDeviceMap(topic, data)
      } else {
        console.log('Unknown topic message', msg_topic)
      }
    })
  }
  onReceiveDevice = (topic, data) => {
    const action = data['action']
    const sn = data['sn']
    const props = data['props']

    const receivers = this.receivers[topic]
    if (receivers) {
      receivers.forEach(item => item.onDeviceAction(action, sn, props))
    }
  }
  onReceiveDeviceMap = (topic, data) => {
    const receivers = this.receivers[topic]
    if (receivers) {
      receivers.forEach(item => item.setDeviceMap(data))
    }
  }
  onReceiveData = (topic, data) => {
    // console.log(topic, data)
    const groups = data_path_regex.exec(data[0])
    if (!groups) {
      console.log('Data patch match error', data)
      return
    }
    const device = groups[1]
    const input = groups[2]
    const prop = groups[3]

    const obj = {
      device: device,
      input: input,
      prop: prop,
      data: {
        timestamp: data[1],
        value: data[2],
        quality: data[3]
      }
    }
    const receivers = this.receivers[topic]
    if (receivers) {
      receivers.forEach(item => item.pushData(obj))
    } else {
      console.log('No receiver', topic, data)
    }
  }
  onReceiveDataList = (topic, data_list) => {
    data_list.forEach(item => this.onReceiveData(topic, item))
  }
  onReceiveCommMsg = (topic, msg) => {
    const obj = {
      time: getLocalTime(msg[1]),
      direction: msg[0].split('/')[1],
      id: msg[0].split('/')[0],
      content: base64decode(msg[2])
    }

    const receivers = this.receivers[topic]
    if (receivers) {
      receivers.forEach(item => item.onComm(obj))
    }
  }
  onReceiveLogMsg = (topic, msg) => {
    const groups = log_content_regex.exec(msg[2])
    if (groups) {
      const obj = {
        time: getLocalTime(msg[1]),
        level: msg[0].toUpperCase(),
        id: groups[1],
        inst: groups[2],
        content: groups[3]
      }

      const receivers = this.receivers[topic]
      if (receivers) {
        receivers.forEach(item => item.onLog(obj))
      }
    } else {
      const groups = log_content_regex_2.exec(msg[2])
      if (groups) {
        const obj = {
          time: getLocalTime(msg[1]),
          level: msg[0].toUpperCase(),
          id: groups[1],
          inst: 'N/A',
          content: groups[2]
        }

        const receivers = this.receivers[topic]
        if (receivers) {
          receivers.onLog(item => item.onLog(obj))
        }
      } else {
        console.log('Cannot parse state log!!!!')
        const obj = {
          time: getLocalTime(msg[1]),
          level: msg[0].toUpperCase(),
          id: 'N/A',
          inst: 'N/A',
          content: msg[2]
        }

        const receivers = this.receivers[topic]
        if (receivers) {
          receivers.onLog(item => item.onLog(obj))
        }
      }
    }
  }
}

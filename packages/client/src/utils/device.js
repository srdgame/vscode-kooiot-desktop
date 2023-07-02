import { sys_option } from '@/api/local/device/sys'
import { reactive, ref, shallowReactive, shallowRef, triggerRef } from 'vue'

shallowRef
triggerRef

const isDataApplyToFilter = (channel, data) => {
  if (channel.filter) {
    const text = channel.filter.toLowerCase()
    if (channel.searchType !== 'all') {
      return data[channel.searchType] && data[channel.searchType].toLowerCase().indexOf(text) !== -1
    }
    return (data.id && data.id.toLowerCase().indexOf(text) !== -1) ||
          (data.content && data.content.toLowerCase().indexOf(text) !== -1) ||
          (data.direction && data.direction.toLowerCase().indexOf(text) !== -1) ||
          (data.level && data.level.toLowerCase().indexOf(text) !== -1) ||
          (data.inst && data.inst.toLowerCase().indexOf(text) !== -1)
  } else {
    return true
  }
}

const applyFilter = (channel) => {
  if (channel.filter) {
    const text = channel.filter.toLowerCase()
    if (channel.searchType !== 'all') {
      channel.dataArr = channel.allData.filter(item => item[channel.searchType] &&
        item[channel.searchType].toLowerCase().indexOf(text) !== -1)
    } else {
      channel.dataArr = channel.allData.filter(item => (item.id && item.id.toLowerCase().indexOf(text) !== -1) ||
        (item.content && item.content.toLowerCase().indexOf(text) !== -1) ||
        (item.direction && item.direction.toLowerCase().indexOf(text) !== -1) ||
        (item.level && item.level.toLowerCase().indexOf(text) !== -1) ||
        (item.inst && item.inst.toLowerCase().indexOf(text) !== -1)
      )
    }
  } else {
    channel.dataArr = channel.allData.slice(0)
  }
}

// 'wss://' + this.host + '/ws'
export class MessageChannel {
  constructor(key) {
    this.key = key
    this.dataArr = reactive([])
    this.allData = reactive([])
    this.filter = ''
    this.searchType = 'all'
    this.isShow = true
    this.newArrive = 0
    this.active = false
    this.update_cb = () => {}
  }
  setUpdateCB(cb) {
    this.update_cb = cb
  }
  pushData(data) {
    // console.log('MessageChannel', data)
    this.allData.push(data)
    if (this.filter === '') {
      this.dataArr.push(data)
      if (!this.isShow) {
        this.newArrive = this.newArrive + 1
      }
    } else {
      if (isDataApplyToFilter(this, data)) {
        this.dataArr.push(data)
        if (!this.isShow) {
          this.newArrive = this.newArrive + 1
        }
      }
    }
    if (this.update_cb) {
      this.update_cb(this)
    }
  }
  clearData() {
    this.dataArr = []
    this.allData = []
    this.newArrive = 0
    if (this.update_cb) {
      this.update_cb(this)
    }
  }
  setFilter(filter) {
    this.filter = filter
    applyFilter(this)
    if (this.update_cb) {
      this.update_cb(this)
    }
  }
  clearFilter() {
    this.filter = ''
    this.dataArr = this.allData.slice(0)
    if (this.update_cb) {
      this.update_cb(this)
    }
  }
  setSearchType(value) {
    this.searchType = value
    applyFilter(this)
    if (this.update_cb) {
      this.update_cb(this)
    }
  }
  setShow(value) {
    this.isShow = value
    if (this.isShow) {
      this.newArrive = 0
    }
    if (this.update_cb) {
      this.update_cb(this)
    }
  }
  setActive(value) {
    this.active = value
    if (this.update_cb) {
      this.update_cb(this)
    }
  }
}

// eslint-disable-next-line no-unused-vars
const mergeList2 = (org, update, on_new_cb) => {
  const to_delete = []
  org.forEach(dev => {
    const obj = update.find(item => item.name === dev.name)
    if (obj === undefined) {
      to_delete.push(dev.name)
    }
  })
  to_delete.forEach(name => {
    const index = org.findIndex(item => item.name === name)
    if (index !== -1) {
      org.splice(index, 1)
    }
  })

  update.forEach(item => {
    const index = org.findIndex(org_item => org_item.name === item.name)
    if (index === -1) {
      if (on_new_cb !== undefined) {
        org.push(on_new_cb(item))
      } else {
        org.push(item)
      }
    }
  })
}

const mergeList = (org, update, on_new_cb) => {
  org = update.map(item => {
    if (on_new_cb !== undefined) {
      return on_new_cb(item)
    } else {
      return item
    }
  })
}
export class DeviceData {
  constructor(sn, model) {
    this.sn = sn
    this.model = model
    this.meta = ref(model.meta)
    model.inputs?.forEach(item => {
      if (item.value) {
        if (typeof item.value === 'string' || item.value instanceof String) {
          const val = JSON.parse(item.value)
          item.value = {
            timestamp: val[0],
            value: val[1],
            quality: val[2]
          }
        }
      }
    })

    // this.inputs_changes = []
    // this.outputs_changes = []
    // this.commands_changes = []
    this.inputs_raw = model.inputs || []
    this.inputs = reactive(this.inputs_raw)
    this.outputs = reactive(model.outputs || [])
    this.commands = reactive(model.commands || [])
    this.show = 0
    // this.inputs = model.inputs || []
    // this.outputs = model.outputs || []
    // this.commands = model.commands || []
  }

  copy_raw_to_ref() {
    // this.inputs = reactive(this.inputs_raw)
    // this.outputs = reactive(this.outputs_raw)
    // this.commands = reactive(this.commands_raw)
    // if (this.show > 0) {
    //   this.inputs_changes.forEach(item => {
    //     this.inputs[item.index].value = item.data
    //   })
    // } else {
    //   this.inputs_changes.forEach(item => {
    //     this.inputs_raw[item.index].value = item.data
    //   })
    // }
  }
  addShow() {
    this.show++
  }
  delShow() {
    this.show--
  }
  setModel(model) {
    this.model = model
    this.meta.value = model.meta
    // this.inputs_changes = []
    // this.outputs_changes = []
    // this.commands_changes = []
    // this.inputs = model.inputs
    // this.outputs = model.outputs
    // this.commands = model.commands
    mergeList(this.inputs, model.inputs || [], (item) => {
      if (item.value) {
        // console.log('parsed', item.name, item.value)
        if (typeof item.value === 'string' || item.value instanceof String) {
          const val = JSON.parse(item.value)
          item.value = {
            timestamp: val[0],
            value: val[1],
            quality: val[2]
          }
        }
      }
      return item
    })
    mergeList(this.outputs, model.outputs || [])
    mergeList(this.commands, model.commands || [])
  }
  pushData(input, data) {
    const index = this.inputs_raw.findIndex(item => item.name === input)
    if (index !== -1) {
      // this.inputs_changes.push({ index: index, data: data })
      if (this.show > 0) {
        this.inputs[index].value = data
      } else {
        this.inputs_raw[index].value = data
      }
    }
  }
}

export class DataChannel {
  constructor(sn, model) {
    this.sn = sn
    this.model = model
    this.devices = shallowReactive([])
    this.gateway = ref({})
    this.setDeviceModel(model, true)
  }
  copy_raw_to_ref() {
    this.devices.forEach(dev => {
      dev.copy_raw_to_ref()
    })
  }
  getDevice(sn) {
    return this.devices.find(item => item.sn === sn)
  }
  pushData(device, input, prop, data) {
    // console.log('pushData', device, input, prop, data)
    if (prop !== 'value') {
      // console.log('Skip prop', payload)
      return
    }
    const devObj = this.devices.find(item => item.sn === device)
    if (devObj === undefined) {
      console.log('Device is missing', device)
      return
    }
    devObj.pushData(input, data)
    if (device === this.sn) {
      this.gateway.value[input] = data.value
      // console.log(this.gateway.value)
    }
  }
  setDeviceModel(devs) {
    this.model = devs
    // console.log(this)

    const self = this
    devs.forEach(dev => {
      const devObj = self.devices.find(item => item.sn === dev.sn)
      if (devObj === undefined) {
        const devObj = new DeviceData(dev.sn, dev)
        self.devices.push(devObj)
        // triggerRef(self.devices)
      } else {
        devObj.setModel(dev)
      }

      if (dev.sn === self.sn) {
        dev.inputs.forEach(item => {
          if (item.value) {
            // console.log('parsed', item.name, item.value)
            if (typeof item.value === 'string' || item.value instanceof String) {
              const val = JSON.parse(item.value)
              self.gateway.value[item.name] = val[1]
            } else {
              self.gateway.value[item.name] = item.value?.value
            }
          }
        })
      }
    })
    const to_delete = []
    self.devices.forEach(dev => {
      const devObj = self.model.find(item => item.sn === dev.sn)
      if (devObj === undefined) {
        to_delete.push(dev.sn)
      }
    })
    to_delete.forEach(sn => {
      console.log('setDeviceModel delete', sn, self.devices.length)
      const index = self.devices.findIndex(item => item.sn === sn)
      if (index !== -1) {
        self.devices.splice(index, 1)
        // triggerRef(self.devices)
        console.log('setDeviceModel delete', sn, self.devices.length)
      }
    })
  }
  onDeviceAdd(device, props) {
    const devObj = this.devices.find(item => item.sn === device)
    if (devObj === undefined) {
      const devObj = new DeviceData(device, props)
      this.devices.push(devObj)
      // triggerRef(self.devices)
    } else {
      devObj.setModel(props)
    }
  }
  onDeviceDel(device) {
    console.log('onDeviceDel', device)
    const index = this.devices.findIndex(item => {
      return item.sn === device
    })
    console.log('onDeviceDel', device, index)
    if (index !== -1) {
      this.devices.splice(index, 1)
    }
  }
}

export class Device {
  constructor(client, sn, model) {
    console.log('MQTTDevice.constructor', sn)
    this.sn = sn
    this.client = client
    this.data = new DataChannel(this.sn, model)
    this.comm = [] // new MessageChannel()
    this.log = [] // new MessageChannel()
    this.timeout = new Date((new Date()).getTime() + 60 * 1000)
    this.log_query = new Date()
    this.comm_query = new Date()

    this.client.subscribe(this.sn + '/data', this)
    this.client.subscribe(this.sn + '/data_gz', this)

    this.client.subscribe(this.sn + '/device', this)
    this.client.subscribe(this.sn + '/device_gz', this)
    this.client.subscribe(this.sn + '/devices', this)
    this.client.subscribe(this.sn + '/devices_gz', this)
    this.client.subscribe(this.sn + '/log', this)
    this.client.subscribe(this.sn + '/comm', this)

    this.timer = setInterval(() => {
      this.data.copy_raw_to_ref()
    }, 1000)
  }
  destroy() {
    console.log('MQTTDevice.destroy', this.sn)
    clearInterval(this.timer)
    this.client.unsubscribe(this.sn + '/data', this)
    this.client.unsubscribe(this.sn + '/data_gz', this)

    this.client.unsubscribe(this.sn + '/device', this)
    this.client.unsubscribe(this.sn + '/device_gz', this)
    this.client.unsubscribe(this.sn + '/devices', this)
    this.client.unsubscribe(this.sn + '/devices_gz', this)

    this.client.unsubscribe(this.sn + '/log', this)
    this.client.unsubscribe(this.sn + '/comm', this)

    if (this.log.length > 0) {
      this.client.unsubscribe(this.sn + '/log', this)
      this.log.length = 0
    }
    if (this.log.length > 0) {
      this.client.unsubscribe(this.sn + '/comm', this)
      this.log.length = 0
    }
  }
  async Tick() {
    if (this.log.length > 0 || this.comm.length > 0) {
      if (this.log.length > 0 && this.log_query < new Date()) {
        await this.logQuery(60)
      }
      if (this.comm.length > 0 && this.comm_query < new Date()) {
        await this.commQuery(60)
      }
      this.timeout = new Date(this.timeout.getTime() + 10 * 60 * 1000)
    } else {
      this.timeout = new Date(this.timeout.getTime() + 60 * 1000)
    }
  }
  IsNeedClear() {
    if (this.timeout < new Date()) {
      return true
    }
    return false
  }
  updateDeviceModel(model) {
    this.data.setDeviceModel(model)
  }
  setDeviceMap(devices) {
    const devs = []
    for (const key in devices) {
      const dev = devices[key]
      dev.sn = dev.sn ? dev.sn : key
      devs.push(dev)
    }
    this.data.setDeviceModel(devs)
  }
  pushData(payload) {
    const device = payload.device
    const input = payload.input
    const prop = payload.prop
    const data = payload.data
    this.data.pushData(device, input, prop, data)
  }
  onDeviceAction(payload) {
    const action = payload.action
    const device = payload.device
    const props = payload.props
    if (action === 'add' || action === 'mod') {
      this.data.onDeviceAdd(device, props)
    }
    if (action === 'del') {
      this.data.onDeviceDel(device, props)
    }
  }
  getData() {
    return this.data
  }
  onLog(data) {
    this.log.forEach(item => item.pushData(data))
  }
  onComm(data) {
    this.comm.forEach(item => item.pushData(data))
  }
  isLogSub(key) {
    const index = this.log.findIndex(item => item.key === key)
    return index !== -1
  }
  subLog(key, channel) {
    if (this.log.length <= 0) {
      const chn = channel || new MessageChannel(key)
      this.log.push(chn)
      this.logQuery(60)
      return chn
    } else {
      const index = this.log.findIndex(item => item.key === key)
      if (index !== -1) {
        return this.log[index]
      } else {
        const chn = channel || new MessageChannel(key)
        this.log.push(chn)
        return chn
      }
    }
  }
  unSubLog(key) {
    const index = this.log.findIndex(item => item.key === key)
    if (index !== -1) {
      this.log.splice(index, 1)
      if (this.log.length === 0) {
        this.logQuery(0)
      }
    }
  }
  async logQuery(time_in_seconds) {
    const data = {
      device: this.sn,
      option: 'EnableLog',
      value: time_in_seconds // seconds
    }
    const res = await sys_option(data)
    if (res.code === 0) {
      this.log_query = new Date(new Date().getTime() + 30 * 1000)
    }
  }
  isCommSub(key) {
    const index = this.comm.findIndex(item => item.key === key)
    return index !== -1
  }
  subComm(key, channel) {
    if (this.comm.length <= 0) {
      const chn = channel || new MessageChannel(key)
      this.comm.push(chn)
      this.commQuery(60)
      return chn
    } else {
      const index = this.comm.findIndex(item => item.key === key)
      if (index !== -1) {
        return this.comm[index]
      } else {
        const chn = channel || new MessageChannel(key)
        this.comm.push(chn)
        return chn
      }
    }
  }
  unSubComm(key) {
    const index = this.comm.findIndex(item => item.key === key)
    if (index !== -1) {
      this.comm.splice(index, 1)
      if (this.comm.length === 0) {
        this.commQuery(0)
      }
    }
  }
  async commQuery(time_in_seconds) {
    const data = {
      device: this.sn,
      option: 'EnableComm',
      value: time_in_seconds // seconds
    }
    const res = await sys_option(data)
    if (res.code === 0) {
      this.comm_query = new Date(new Date().getTime() + 30 * 1000)
    }
  }
}

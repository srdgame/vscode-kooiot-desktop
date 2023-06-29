
import { reactive } from 'vue'

export const Example =
`
[{
  "name": "protocol",
  "desc": "通讯协议",
  "type": "dropdown",
  "values": [
    "tcp",
    "rtu"
  ]
},
{
  "name": "Link_type",
  "desc": "链路类型",
  "type": "dropdown",
  "depends": {
    "socket": "socket",
    "serial": "serial"
  },
  "values": [
    "socket",
    "serial"
  ]
},
{
  "name": "socket",
  "desc": "TCP端口设定",
  "type": "tcp_client"
},
{
  "name": "serial",
  "desc": "串口设定",
  "type": "serial"
},
{
  "name": "tpls",
  "desc": "设备模板选择",
  "type": "templates"
},
{
  "name": "devs",
  "desc": "设备列表",
  "type": "table",
  "cols": [{
      "name": "addr",
      "desc": "Modbus地址",
      "type": "number"
    },
    {
      "name": "tpl",
      "desc": "设备模板",
      "type": "template"
    },
    {
      "name": "name",
      "desc": "设备名称",
      "type": "string"
    },
    {
      "name": "desc",
      "desc": "设备描述",
      "type": "string"
    },
    {
      "name": "sn",
      "desc": "设备序列号",
      "type": "string"
    }
  ]
},
{
  "name": "encryption",
  "desc": "证书选择",
  "type": "section",
  "child": [{
      "name": "cert",
      "desc": "UA证书(可选)",
      "type": "text",
      "value": "certs/cert.der"
    },
    {
      "name": "key",
      "desc": "KEY文件(可选)",
      "type": "string",
      "value": "certs/key.der"
    }
  ]
}
]
`

export const template_json_type = [
  'boolean',
  'number',
  'string',
  'text',
  'dropdown',
  'template',
  'templates',
  'table',
  'section',
  'fake_section',
  'serial',
  'tcp_client',
  'tcp_server'
]

export const get_default_value = (item) => {
  if (item.type === 'boolean') { return false }
  if (item.type === 'number') { return 0 }
  if (item.type === 'string') { return '' }
  if (item.type === 'text') { return '' }
  if (item.type === 'dropdown') { return item.values[0] }
  if (item.type === 'template') { return '' }
  if (item.type === 'templates') { return [] }
  if (item.type === 'table') { return [] }
  if (item.type === 'section') { return {} }
  if (item.type === 'fake_section') { return null }
  if (item.type === 'serial') { return {} }
  if (item.type === 'tcp_client') { return {} }
  if (item.type === 'tcp_server') { return {} }
}

export const valid_item_value = (item, value) => {
  if (item.type === 'boolean') {
    return Boolean(value)
  }
  if (item.type === 'number') {
    return Number(value)
  }
  if (item.type === 'string') { return String(value) }
  if (item.type === 'text') { return String(value) }
  if (item.type === 'dropdown') { return String(value) }
  if (item.type === 'template') { return String(value) }
  if (item.type === 'templates') {
    if (value instanceof Array) {
      return value
    }
    return []
  }
  if (item.type === 'table') {
    if (value instanceof Array) {
      return value
    }
    return []
  }
  if (item.type === 'section') {
    if (value instanceof Object) {
      return value
    }
    return []
  }
  if (item.type === 'fake_section') { return value }
  if (item.type === 'serial') {
    if (value instanceof Object) {
      return value
    }
    return []
  }
  if (item.type === 'tcp_client') {
    if (value instanceof Object) {
      return value
    }
    return []
  }
  if (item.type === 'tcp_server') {
    if (value instanceof Object) {
      return value
    }
    return []
  }
}

export function schema_to_map(schema, data) {
  if (schema === undefined) {
    return []
  }
  // const schemaStr = JSON.stringify(schema)
  // var objClone = JSON.parse(schemaStr)
  // objClone.forEach(item => {
  //   const index = template_json_type.findIndex(itype => itype === item.type)
  //   if (index === -1) {
  //     item.desc = `Invalid config ui item type ${item.type}`
  //   } else {
  //     if (!item.desc) {
  //       item.desc = item.type === 'templates' ? '模板列表' : item.name
  //     }

  //     if (Object.prototype.hasOwnProperty.call(data, item.name)) {
  //       item.value = valid_item_value(item, data[item.name])
  //       // console.log('ConfigUI.loadScheme', item.name, item.value)
  //     } else {
  //       item.value = item.default ? item.default : get_default_value(item)
  //     }
  //   }
  // })
  // return objClone
  var mapData = []
  schema.forEach(item => {
    const index = template_json_type.findIndex(itype => itype === item.type)
    var dataItem = { key: item.name, label: item.desc, meta: item, value: null }
    // console.log(dataItem)

    if (index === -1) {
      // item.desc = `Invalid config ui item type ${item.type}`
      console.log(`ERROR: Invalid config ui item type ${item.type}`)
      dataItem.label = `Invalid config ui item type ${item.type}`
    } else {
      if (!dataItem.label) {
        dataItem.label = item.type === 'templates' ? '模板列表' : item.name
      }

      if (Object.prototype.hasOwnProperty.call(data, item.name)) {
        dataItem.value = valid_item_value(item, data[item.name])
        // console.log('ConfigUI.loadScheme', item.name, item.value)
      } else {
        dataItem.value = item.default ? item.default : get_default_value(item)
      }
    }
    mapData.push(reactive(dataItem))
  })
  return mapData
}

export function update_schema_map_val(schema_map, data) {
  schema_map.forEach(item => {
    if (Object.prototype.hasOwnProperty.call(data, item.key)) {
      item.value = valid_item_value(item.meta, data[item.key])
      // console.log('ConfigUI.UpdateValue', item.key, item.value)
    } else {
      item.value = item.meta?.default ? item.meta?.default : get_default_value(item.meta)
    }
  })
  return schema_map
}

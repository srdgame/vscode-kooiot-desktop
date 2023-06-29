import service from '@/utils/requestLocal'

// @Tags IotDeviceData
// @Summary 设备数据输出
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body iot.request.DeviceOutput
// @Success 200 {string} string "{"success":true,"data":{},"msg":"设备数据输出命令发送成功"}"
// @Router /local/device/data/send_output [post]
export const send_output = (data) => {
  return service({
    url: '/local/device/data/send_output',
    method: 'post',
    data
  })
}

// @Tags IotDeviceData
// @Summary 设备指令请求
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body iot.request.DeviceCommand
// @Success 200 {string} string "{"success":true,"data":{},"msg":"设备指令请求发送成功"}"
// @Router /local/device/data/send_command [post]
export const send_command = (data) => {
  return service({
    url: '/local/device/data/send_command',
    method: 'post',
    data
  })
}

// @Tags IotDeviceData
// @Summary 设备指令结果查询
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body iot.request.DeviceCommand
// @Success 200 {string} string "{"success":true,"data":{},"msg":"设备指令请求发送成功"}"
// @Router /local/device/data/action_result [post]
export const action_result = (data) => {
  return service({
    url: '/local/device/data/action_result',
    method: 'post',
    data
  })
}

// @Tags IotDeviceData
// @Summary 数据操作命令
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body iot.request.DeviceBase
// @Success 200 {string} string "{"success":true,"data":{}}"
// @Router /local/device/data/fire_snapshot [post]
export const fire_snapshot = (data) => {
  return service({
    url: '/local/device/data/fire_snapshot',
    method: 'post',
    data
  })
}

// @Tags IotDeviceData
// @Summary 数据操作命令
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body iot.request.DeviceDataQuery
// @Success 200 {string} string "{"success":true,"data":{}}"
// @Router /local/device/data/fire_query [post]
export const fire_query = (data) => {
  return service({
    url: '/local/device/data/fire_query',
    method: 'post',
    data
  })
}

// @Tags IotDeviceData
// @Summary 数据操作命令
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body iot.request.DeviceBase
// @Success 200 {string} string "{"success":true,"data":{}}"
// @Router /local/device/data/fire_flush [post]
export const fire_flush = (data) => {
  return service({
    url: '/local/device/data/fire_flush',
    method: 'post',
    data
  })
}


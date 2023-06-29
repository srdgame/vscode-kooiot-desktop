import service from '@/utils/requestLocal'

// @Tags IotDeviceApp
// @Summary 请求应用列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body iot.request.DeviceBase
// @Success 200 {string} string "{"success":true,"data":{}}"
// @Router /local/device/app/list [post]
export const list_app = (data) => {
  return service({
    url: '/local/device/app/list',
    method: 'post',
    data
  })
}

// @Tags IotDeviceApp
// @Summary 刷新应用列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body iot.request.DeviceBase
// @Success 200 {string} string "{"success":true,"data":{},"msg":"应用刷新命令发送成功"}"
export const refresh_app = (data) => {
  return service({
    url: '/local/device/app/refresh',
    method: 'post',
    data
  })
}

// @Tags IotDeviceApp
// @Summary 安装应用
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body iot.request.DeviceAppInst
// @Success 200 {string} string "{"success":true,"data":{},"msg":"应用安装命令发送成功"}"
// @Router /local/device/app/install [post]
export const install_app = (data) => {
  return service({
    url: '/local/device/app/install',
    method: 'post',
    data
  })
}

// @Tags IotDeviceApp
// @Summary 卸载应用
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body iot.request.DeviceAppInst
// @Success 200 {string} string "{"success":true,"data":{},"msg":"应用卸载命令发送成功"}"
// @Router /local/device/app/uninstall [post]
export const uninstall_app = (data) => {
  return service({
    url: '/local/device/app/uninstall',
    method: 'post',
    data
  })
}

// @Tags IotDeviceApp
// @Summary 升级应用
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body iot.request.DeviceAppInst
// @Success 200 {string} string "{"success":true,"data":{},"msg":"应用升级命令发送成功"}"
// @Router /local/device/app/upgrade [post]
export const upgrade_app = (data) => {
  return service({
    url: '/local/device/app/upgrade',
    method: 'post',
    data
  })
}

// @Tags IotDeviceApp
// @Summary 配置应用
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body iot.request.DeviceAppInst
// @Success 200 {string} string "{"success":true,"data":{},"msg":"应用配置命令发送成功"}"
// @Router /local/device/app/config [post]
export const config_app = (data) => {
  return service({
    url: '/local/device/app/config',
    method: 'post',
    data
  })
}

// @Tags IotDeviceApp
// @Summary 启动应用
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body iot.request.DeviceAppInst
// @Success 200 {string} string "{"success":true,"data":{},"msg":"应用启动命令发送成功"}"
// @Router /local/device/app/start [post]
export const start_app = (data) => {
  return service({
    url: '/local/device/app/start',
    method: 'post',
    data
  })
}

// @Tags IotDeviceApp
// @Summary 停止应用
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body iot.request.DeviceAppInst
// @Success 200 {string} string "{"success":true,"data":{},"msg":"应用停止命令发送成功"}"
// @Router /local/device/app/stop [post]
export const stop_app = (data) => {
  return service({
    url: '/local/device/app/stop',
    method: 'post',
    data
  })
}

// @Tags IotDeviceApp
// @Summary 停止应用
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body iot.request.DeviceAppInst
// @Success 200 {string} string "{"success":true,"data":{},"msg":"应用停止命令发送成功"}"
// @Router /local/device/app/restart [post]
export const restart_app = (data) => {
  return service({
    url: '/local/device/app/restart',
    method: 'post',
    data
  })
}

// @Tags IotDeviceApp
// @Summary 查询应用日志
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body iot.request.DeviceAppInst
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询应用日志命令发送成功"}"
// @Router /local/device/app/query_log [post]
export const query_log = (data) => {
  return service({
    url: '/local/device/app/restart',
    method: 'post',
    data
  })
}

// @Tags IotDeviceApp
// @Summary 查询应用报文
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body iot.request.DeviceAppInst
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询应用报文命令发送成功"}"
// @Router /local/device/app/query_comm [post]
export const query_comm = (data) => {
  return service({
    url: '/local/device/app/query_comm',
    method: 'post',
    data
  })
}

// @Tags IotDeviceApp
// @Summary 上传应用报文
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body iot.request.DeviceAppInst
// @Success 200 {string} string "{"success":true,"data":{},"msg":"上传应用报文命令发送成功"}"
// @Router /local/device/app/upload_comm [post]
export const upload_comm = (data) => {
  return service({
    url: '/local/device/app/upload_comm',
    method: 'post',
    data
  })
}

// @Tags IotDeviceApp
// @Summary 更改应用选项
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body iot.request.DeviceAppInst
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更改应用选项命令发送成功"}"
// @Router /local/device/app/option [post]
export const option_app = (data) => {
  return service({
    url: '/local/device/app/option',
    method: 'post',
    data
  })
}

// @Tags IotDeviceApp
// @Summary 应用改名
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body iot.request.DeviceAppInst
// @Success 200 {string} string "{"success":true,"data":{},"msg":"应用改名命令发送成功"}"
// @Router /local/device/app/rename [post]
export const rename_app = (data) => {
  return service({
    url: '/local/device/app/rename',
    method: 'post',
    data
  })
}

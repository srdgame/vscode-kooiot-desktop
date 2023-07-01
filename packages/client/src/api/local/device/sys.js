import service from '@/utils/requestLocal'

// @Tags IotDeviceSys
// @Summary 云中心切换
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body iot.request.SwitchCloud
// @Success 200 {string} string "{"success":true,"data":{},"msg":"云中心切换命令发送成功"}"
// @Router /local/device/sys/switch_cloud [post]
export const switch_cloud = (data) => {
  return service({
    url: '/local/device/sys/switch_cloud',
    method: 'post',
    data
  })
}

// @Tags IotDeviceSys
// @Summary 获取设备信息
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body iot.request.FetchDeviceSN
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取设备信息命令发送成功"}"
// @Router /local/device/sys/fetch_device_sn [post]
export const fetch_device_info = (data) => {
  return service({
    url: '/local/device/sys/fetch_device_info',
    method: 'post',
    data
  })
}

// @Tags IotDeviceSys
// @Summary 云中心配置
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body iot.request.DeviceCloudConf
// @Success 200 {string} string "{"success":true,"data":{},"msg":"云中心配置命令发送成功"}"
// @Router /local/device/sys/cloud_config [post]
export const update_cloud_config = (data) => {
  return service({
    url: '/local/device/sys/cloud_config',
    method: 'post',
    data
  })
}

// @Tags IotDeviceSys
// @Summary 获取最新版本
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body iot.DeviceBase
// @Success 200 {string} string "{"success":true,"data":{}}"
// @Router /local/device/sys/check_update [post]
export const check_update = (data) => {
  return service({
    url: '/local/device/sys/check_update',
    method: 'post',
    data
  })
}

// @Tags IotDeviceSys
// @Summary 设备升级
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body iot.request.DeviceSysUpgrade
// @Success 200 {string} string "{"success":true,"data":{},"msg":"命令发送成功"}"
// @Router /local/device/sys/upgrade [post]
export const sys_upgrade = (data) => {
  return service({
    url: '/local/device/sys/upgrade',
    method: 'post',
    data
  })
}

// @Tags IotDeviceSys
// @Summary 设备选项更新
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body iot.request.DeviceOption
// @Success 200 {string} string "{"success":true,"data":{},"msg":"命令发送成功"}"
// @Router /local/device/sys/option [post]
export const sys_option = (data) => {
  return service({
    url: '/local/device/sys/option',
    method: 'post',
    data
  })
}

// @Tags IotDeviceSys
// @Summary 设备批量脚本
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body iot.request.DeviceScript
// @Success 200 {string} string "{"success":true,"data":{},"msg":"设备批量脚本发送成功"}"
// @Router /local/device/sys/batch_script [post]
export const sys_batch_script = (data) => {
  return service({
    url: '/local/device/sys/batch_script',
    method: 'post',
    data
  })
}

// @Tags IotDeviceSys
// @Summary 软件重启
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body iot.request.DeviceBase
// @Success 200 {string} string "{"success":true,"data":{},"msg":"软件重启命令发送成功"}"
// @Router /local/device/sys/restart [post]
export const sys_restart = (data) => {
  return service({
    url: '/local/device/sys/restart',
    method: 'post',
    data
  })
}

// @Tags IotDeviceSys
// @Summary 设备重启
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body iot.request.DeviceBase
// @Success 200 {string} string "{"success":true,"data":{},"msg":"设备重启命令发送成功"}"
// @Router /local/device/sys/reboot [post]
export const sys_reboot = (data) => {
  return service({
    url: '/local/device/sys/reboot',
    method: 'post',
    data
  })
}

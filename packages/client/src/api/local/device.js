import service from '@/utils/requestLocal'

// @Tags Device
// @Summary 创建Device
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.Device true "创建Device"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /local/device/create [post]
export const create_device = (data) => {
  return service({
    url: '/local/device/create',
    method: 'post',
    data
  })
}

// @Tags Device
// @Summary 删除Device
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.Device true "删除Device"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /local/device/delete [delete]
export const delete_device = (data) => {
  return service({
    url: '/local/device/delete',
    method: 'post',
    data
  })
}

// @Tags Device
// @Summary 更新Device
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.Device true "更新Device"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /local/device/update [put]
export const update_device = (data) => {
  return service({
    url: '/local/device/update',
    method: 'put',
    data
  })
}

// @Tags Device
// @Summary 用id查询Device
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.Activity true "用id查询Device"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /local/device/get [get]
export const get_device = (params) => {
  return service({
    url: '/local/device/get',
    method: 'get',
    params
  })
}

// @Tags StoreCoreApp
// @Summary 用id查询StoreCoreApp
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.Activity true "用id查询StoreCoreApp"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /local/device/find_by_id [post]
export const find_device_by_id = (data) => {
  return service({
    url: '/local/device/find_by_id',
    method: 'post',
    data
  })
}

// @Tags Device
// @Summary 分页获取Device列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request_store.UserAppSearch true "分页获取Device列表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /local/device/list [post]
export const get_device_list = (data) => {
  return service({
    url: '/local/device/list',
    method: 'post',
    data
  })
}


import service from '@/utils/request'

// @Tags StoreCoreApp
// @Summary 创建StoreCoreApp
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.StoreCoreApp true "创建StoreCoreApp"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /store/core_app/create [post]
export const create_app = (data) => {
  return service({
    url: '/store/core_app/create',
    method: 'post',
    data
  })
}

// @Tags StoreCoreApp
// @Summary 删除StoreCoreApp
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.StoreCoreApp true "删除StoreCoreApp"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /store/core_app/delete [delete]
export const delete_app = (data) => {
  return service({
    url: '/store/core_app/delete',
    method: 'delete',
    data
  })
}

// @Tags StoreCoreApp
// @Summary 批量删除StoreCoreApp
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request.IdsReq true "批量删除StoreCoreApp"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"批量删除成功"}"
// @Router /store/core_app/delete_by_ids [delete]
export const delete_app_by_ids = (data) => {
  return service({
    url: '/store/core_app/delete_by_ids',
    method: 'delete',
    data
  })
}

// @Tags StoreCoreApp
// @Summary 更新StoreCoreApp
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.StoreCoreApp true "更新StoreCoreApp"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /store/core_app/update [put]
export const update_app = (data) => {
  return service({
    url: '/store/core_app/update',
    method: 'put',
    data
  })
}

// @Tags StoreCoreApp
// @Summary 移交StoreCoreApp
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.StoreCoreApp true "移交StoreCoreApp"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"移交成功"}"
// @Router /store/core_app/transfer [put]
export const transfer_app = (data) => {
  return service({
    url: '/store/core_app/transfer',
    method: 'put',
    data
  })
}

// @Tags StoreCoreApp
// @Summary 用id查询StoreCoreApp
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.Activity true "用id查询StoreCoreApp"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /store/core_app/get [get]
export const get_app = (params) => {
  return service({
    url: '/store/core_app/get',
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
// @Router /store/core_app/find_by_id [post]
export const find_app_by_id = (data) => {
  return service({
    url: '/store/core_app/find_by_id',
    method: 'post',
    data
  })
}

// @Tags StoreCoreApp
// @Summary 分页获取StoreCoreApp列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request_store.UserAppSearch true "分页获取StoreCoreApp列表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /store/core_app/list [post]
export const get_app_list = (data) => {
  return service({
    url: '/store/core_app/list',
    method: 'post',
    data
  })
}

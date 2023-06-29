import service from '@/utils/request'

// @Tags StoreUserApp
// @Summary 创建StoreUserApp
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.StoreUserApp true "创建StoreUserApp"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /store/user_app/create [post]
export const create_app = (data) => {
  return service({
    url: '/store/user_app/create',
    method: 'post',
    data
  })
}

// @Tags StoreUserApp
// @Summary 删除StoreUserApp
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.StoreUserApp true "删除StoreUserApp"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /store/user_app/delete [delete]
export const delete_app = (data) => {
  return service({
    url: '/store/user_app/delete',
    method: 'delete',
    data
  })
}

// @Tags StoreUserApp
// @Summary 批量删除StoreUserApp
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request.IdsReq true "批量删除StoreUserApp"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"批量删除成功"}"
// @Router /store/user_app/delete_by_ids [delete]
export const delete_app_by_ids = (data) => {
  return service({
    url: '/store/user_app/delete_by_ids',
    method: 'delete',
    data
  })
}

// @Tags StoreUserApp
// @Summary 更新StoreUserApp
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.StoreUserApp true "更新StoreUserApp"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /store/user_app/update [put]
export const update_app = (data) => {
  return service({
    url: '/store/user_app/update',
    method: 'put',
    data
  })
}

// @Tags StoreUserApp
// @Summary 移交StoreUserApp
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.StoreUserApp true "移交StoreUserApp"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"移交成功"}"
// @Router /store/user_app/transfer [put]
export const transfer_app = (data) => {
  return service({
    url: '/store/user_app/transfer',
    method: 'put',
    data
  })
}

// @Tags StoreUserApp
// @Summary 用id查询StoreUserApp
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.Activity true "用id查询StoreUserApp"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /store/user_app/get [get]
export const get_app = (params) => {
  return service({
    url: '/store/user_app/get',
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
// @Router /store/user_app/find_by_id [post]
export const find_app_by_id = (data) => {
  return service({
    url: '/store/user_app/find_by_id',
    method: 'post',
    data
  })
}

// @Tags StoreUserApp
// @Summary 分页获取StoreUserApp列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request_store.UserAppSearch true "分页获取StoreUserApp列表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /store/user_app/list [post]
export const get_app_list = (data) => {
  return service({
    url: '/store/user_app/list',
    method: 'post',
    data
  })
}

// @Tags StoreUserApp
// @Summary 获取最新StoreUserApp列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request_store.UserAppSearch
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /store/user_app/list [post]
export const get_latest_list = (data) => {
  return service({
    url: '/store/user_app/latest',
    method: 'post',
    data
  })
}

// @Tags StoreUserApp
// @Summary 获取热门StoreUserApp列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request_store.UserAppSearch
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /store/user_app/list [post]
export const get_fav_list = (data) => {
  return service({
    url: '/store/user_app/fav',
    method: 'post',
    data
  })
}

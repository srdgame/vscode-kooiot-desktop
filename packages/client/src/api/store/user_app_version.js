import service from '@/utils/request'

// @Tags StoreUserAppVersion
// @Summary 创建StoreUserAppVersion
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.StoreUserAppVersion true "创建StoreUserAppVersion"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /store/user_app/version/create [post]
export const create_version = (data) => {
  return service({
    url: '/store/user_app/version/create',
    method: 'post',
    data
  })
}

// @Tags StoreUserAppVersion
// @Summary 发布StoreUserAppVersion
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.StoreUserAppVersion
// @Success 200 {string} string "{"success":true,"data":{},"msg":"发布成功"}"
// @Router /store/user_app/version/release [post]
export const release_version = (data) => {
  return service({
    url: '/store/user_app/version/release',
    method: 'post',
    data
  })
}

// @Tags StoreUserAppVersion
// @Summary 删除StoreUserAppVersion
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.StoreUserAppVersion true "删除StoreUserAppVersion"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /store/user_app/version/delete [delete]
export const delete_version = (data) => {
  return service({
    url: '/store/user_app/version/delete',
    method: 'delete',
    data
  })
}

// @Tags StoreUserAppVersion
// @Summary 批量删除StoreUserAppVersion
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request.IdsReq true "批量删除StoreUserAppVersion"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"批量删除成功"}"
// @Router /store/user_app/version/delete_by_ids [delete]
export const delete_version_by_ids = (data) => {
  return service({
    url: '/store/user_app/version/delete_by_ids',
    method: 'delete',
    data
  })
}

// @Tags StoreUserAppVersion
// @Summary 更新StoreUserAppVersion
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.StoreUserAppVersion true "更新StoreUserAppVersion"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /store/user_app/version/update [put]
export const update_version = (data) => {
  return service({
    url: '/store/user_app/version/update',
    method: 'put',
    data
  })
}

// @Tags StoreUserAppVersion
// @Summary 用id查询StoreUserAppVersion
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.Activity true "用id查询StoreUserAppVersion"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /store/user_app/version/get [get]
export const get_version = (params) => {
  return service({
    url: '/store/user_app/version/get',
    method: 'get',
    params
  })
}

// @Tags StoreUserAppVersion
// @Summary 用应用id查询StoreUserApp最新版本
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body store.UserAppVersion true "用应用id查询StoreUserApp最新版本"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /store/user_app/version/latest [get]
export const get_latest = (params) => {
  return service({
    url: '/store/user_app/version/latest',
    method: 'get',
    params
  })
}

// @Tags StoreUserAppVersion
// @Summary 分页获取StoreUserAppVersion列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request_store.UserAppVersionSearch true "分页获取StoreUserAppVersion列表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /store/user_app/version/list [post]
export const get_version_list = (data) => {
  return service({
    url: '/store/user_app/version/list',
    method: 'post',
    data
  })
}

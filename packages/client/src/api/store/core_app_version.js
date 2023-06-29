import service from '@/utils/request'

// @Tags StoreCoreAppVersion
// @Summary 创建StoreCoreAppVersion
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.StoreCoreAppVersion true "创建StoreCoreAppVersion"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /store/core_app/version/create [post]
export const create_version = (data) => {
  return service({
    url: '/store/core_app/version/create',
    method: 'post',
    data
  })
}

// @Tags StoreCoreAppVersion
// @Summary 发布StoreCoreAppVersion
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.StoreCoreAppVersion
// @Success 200 {string} string "{"success":true,"data":{},"msg":"发布成功"}"
// @Router /store/core_app/version/release [post]
export const release_version = (data) => {
  return service({
    url: '/store/core_app/version/release',
    method: 'post',
    data
  })
}

// @Tags StoreCoreAppVersion
// @Summary 删除StoreCoreAppVersion
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.StoreCoreAppVersion true "删除StoreCoreAppVersion"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /store/core_app/version/delete [delete]
export const delete_version = (data) => {
  return service({
    url: '/store/core_app/version/delete',
    method: 'delete',
    data
  })
}

// @Tags StoreCoreAppVersion
// @Summary 批量删除StoreCoreAppVersion
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request.IdsReq true "批量删除StoreCoreAppVersion"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"批量删除成功"}"
// @Router /store/core_app/version/delete_by_ids [delete]
export const delete_version_by_ids = (data) => {
  return service({
    url: '/store/core_app/version/delete_by_ids',
    method: 'delete',
    data
  })
}

// @Tags StoreCoreAppVersion
// @Summary 更新StoreCoreAppVersion
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.StoreCoreAppVersion true "更新StoreCoreAppVersion"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /store/core_app/version/update [put]
export const update_version = (data) => {
  return service({
    url: '/store/core_app/version/update',
    method: 'put',
    data
  })
}

// @Tags StoreCoreAppVersion
// @Summary 用id查询StoreCoreAppVersion
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.Activity true "用id查询StoreCoreAppVersion"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /store/core_app/version/get [get]
export const get_version = (params) => {
  return service({
    url: '/store/core_app/version/get',
    method: 'get',
    params
  })
}

// @Tags StoreCoreAppVersion
// @Summary 用核心应用id查询StoreCoreApp最新版本
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body store.CoreAppVersion true "用核心应用id查询StoreCoreApp最新版本"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /store/template/version/latest [get]
export const get_latest = (params) => {
  return service({
    url: '/store/core_app/version/latest',
    method: 'get',
    params
  })
}

// @Tags StoreCoreAppVersion
// @Summary 分页获取StoreCoreAppVersion列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request_store.CoreAppVersionSearch true "分页获取StoreCoreAppVersion列表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /store/core_app/version/list [post]
export const get_version_list = (data) => {
  return service({
    url: '/store/core_app/version/list',
    method: 'post',
    data
  })
}

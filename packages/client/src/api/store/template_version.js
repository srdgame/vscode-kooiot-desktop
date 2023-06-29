import service from '@/utils/request'

// @Tags StoreTemplateVersion
// @Summary 创建StoreTemplateVersion
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.StoreTemplateVersion true "创建StoreTemplateVersion"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /store/template/version/create [post]
export const create_version = (data) => {
  return service({
    url: '/store/template/version/create',
    method: 'post',
    data
  })
}

// @Tags StoreTemplateVersion
// @Summary 删除StoreTemplateVersion
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.StoreTemplateVersion true "删除StoreTemplateVersion"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /store/template/version/delete [delete]
export const delete_version = (data) => {
  return service({
    url: '/store/template/version/delete',
    method: 'delete',
    data
  })
}

// @Tags StoreTemplateVersion
// @Summary 批量删除StoreTemplateVersion
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request.IdsReq true "批量删除StoreTemplateVersion"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"批量删除成功"}"
// @Router /store/template/version/delete_by_ids [delete]
export const delete_version_by_ids = (data) => {
  return service({
    url: '/store/template/version/delete_by_ids',
    method: 'delete',
    data
  })
}

// @Tags StoreTemplateVersion
// @Summary 更新StoreTemplateVersion
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.StoreTemplateVersion true "更新StoreTemplateVersion"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /store/template/version/update [put]
export const update_version = (data) => {
  return service({
    url: '/store/template/version/update',
    method: 'put',
    data
  })
}

// @Tags StoreTemplateVersion
// @Summary 用id查询StoreTemplateVersion
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.Activity true "用id查询StoreTemplateVersion"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /store/template/version/get [get]
export const get_version = (params) => {
  return service({
    url: '/store/template/version/get',
    method: 'get',
    params
  })
}

// @Tags StoreTemplateVersion
// @Summary 用模板id查询StoreTemplate最新版本
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body store.TemplateVersion true "用模板id查询StoreTemplate最新版本"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /store/template/version/latest [get]
export const get_latest = (params) => {
  return service({
    url: '/store/template/version/latest',
    method: 'get',
    params
  })
}

// @Tags StoreTemplateVersion
// @Summary 分页获取StoreTemplateVersion列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request_store.TemplateVersionSearch true "分页获取StoreTemplateVersion列表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /store/template/version/list [post]
export const get_version_list = (data) => {
  return service({
    url: '/store/template/version/list',
    method: 'post',
    data
  })
}

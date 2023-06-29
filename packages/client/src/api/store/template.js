import service from '@/utils/request'

// @Tags StoreTemplate
// @Summary 创建StoreTemplate
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.StoreTemplate true "创建StoreTemplate"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /store/template/create [post]
export const create_template = (data) => {
  return service({
    url: '/store/template/create',
    method: 'post',
    data
  })
}

// @Tags StoreTemplate
// @Summary 删除StoreTemplate
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.StoreTemplate true "删除StoreTemplate"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /store/template/delete [delete]
export const delete_template = (data) => {
  return service({
    url: '/store/template/delete',
    method: 'delete',
    data
  })
}

// @Tags StoreTemplate
// @Summary 批量删除StoreTemplate
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request.IdsReq true "批量删除StoreTemplate"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"批量删除成功"}"
// @Router /store/template/delete_by_ids [delete]
export const delete_template_by_ids = (data) => {
  return service({
    url: '/store/template/delete_by_ids',
    method: 'delete',
    data
  })
}

// @Tags StoreTemplate
// @Summary 更新StoreTemplate
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.StoreTemplate true "更新StoreTemplate"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /store/template/update [put]
export const update_template = (data) => {
  return service({
    url: '/store/template/update',
    method: 'put',
    data
  })
}

// @Tags StoreTemplate
// @Summary 用id查询StoreTemplate
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.Activity true "用id查询StoreTemplate"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /store/template/get [get]
export const get_template = (params) => {
  return service({
    url: '/store/template/get',
    method: 'get',
    params
  })
}

// @Tags StoreTemplate
// @Summary 分页获取StoreTemplate列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request_store.TemplateSearch true "分页获取StoreTemplate列表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /store/template/list [post]
export const get_template_list = (data) => {
  return service({
    url: '/store/template/list',
    method: 'post',
    data
  })
}

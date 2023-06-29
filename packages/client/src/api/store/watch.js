import service from '@/utils/request'

// @Tags StoreWatch
// @Summary 创建StoreWatch
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.StoreWatch true "创建StoreWatch"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /store/watch/create [post]
export const create_watch = (data) => {
  return service({
    url: '/store/watch/create',
    method: 'post',
    data
  })
}

// @Tags StoreWatch
// @Summary 删除StoreWatch
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.StoreWatch true "删除StoreWatch"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /store/watch/delete [delete]
export const delete_watch = (data) => {
  return service({
    url: '/store/watch/delete',
    method: 'delete',
    data
  })
}

// @Tags StoreWatch
// @Summary 批量删除StoreWatch
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request.IdsReq true "批量删除StoreWatch"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"批量删除成功"}"
// @Router /store/watch/delete_by_ids [delete]
export const delete_watch_by_ids = (data) => {
  return service({
    url: '/store/watch/delete_by_ids',
    method: 'delete',
    data
  })
}

// @Tags StoreWatch
// @Summary 更新StoreWatch
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.StoreWatch true "更新StoreWatch"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /store/watch/update [put]
export const update_watch = (data) => {
  return service({
    url: '/store/watch/update',
    method: 'put',
    data
  })
}

// @Tags StoreWatch
// @Summary 用id查询StoreWatch
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.Activity true "用id查询StoreWatch"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /store/watch/get [get]
export const get_watch = (params) => {
  return service({
    url: '/store/watch/get',
    method: 'get',
    params
  })
}

// @Tags StoreWatch
// @Summary 分页获取StoreWatch列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request_store.UserAppSearch true "分页获取StoreWatch列表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /store/watch/list [post]
export const get_watch_list = (data) => {
  return service({
    url: '/store/watch/list',
    method: 'post',
    data
  })
}

// @Tags StoreWatch
// @Summary 获取最新StoreWatch列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request_store.UserAppSearch
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /store/user_app/list [post]
export const get_latest_list = (data) => {
  return service({
    url: '/store/watch/latest',
    method: 'post',
    data
  })
}

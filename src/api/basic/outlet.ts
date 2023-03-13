import { customHttp, defHttp } from '/@/utils/http/axios';

const baseUrl = '/3/dst-ooc-base-server';

// 门店管理 分页
export function actionShopPage(data?: any) {
  return defHttp.post({
    url: baseUrl + '/shop/page',
    data,
  });
}

// 门店详情信息
export function actionShopDetail(params?: any) {
  return customHttp.get({
    url: baseUrl + '/shop/detail',
    params,
  });
}

// 门店管理 编辑/新增
export function actionShopAddOrEdit(type: string, data?: any) {
  return customHttp.post({
    url: baseUrl + `/shop/${type}`,
    data,
  });
}

// 门店管理 删除
export function actionShopDelete(id?: any) {
  return customHttp.post({
    url: baseUrl + `/shop/delete?id=${id}`,
  });
}

// 门店管理 状态变更
export function actionShopStatusChange(params?: any) {
  return customHttp.get({
    url: baseUrl + '/shop/status/change',
    params,
  });
}

// 门店管理 所有门店查询-支持门店状态、门店名称模糊查询
export function actionQueryShopList(params?: any) {
  return defHttp.get({
    url: baseUrl + '/shop/list',
    params,
  });
}

// 门店城市
export function actionQueryShopCity(params?: any) {
  return defHttp.get({
    url: baseUrl + '/shop/user/city',
    params,
  });
}

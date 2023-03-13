import { customHttp } from '/@/utils/http/axios';

const baseUrl = '/3/dst-ooc-base-server';

// 服务类别 分页
export function actionServiceCategoryPage(data?: any) {
  return customHttp.post({
    url: baseUrl + '/service/category/page',
    data,
  });
}

/**
 *
 * @description 服务类别 新增/编辑
 * @param  type add/edit
 */
export function actionServiceCategoryAddOrEdit(type: string, data?: any) {
  return customHttp.post({
    url: baseUrl + `/service/category/${type}`,
    data,
  });
}

// 服务类别 删除
export function actionServiceCategoryDelete(id?: any) {
  return customHttp.post({
    url: baseUrl + `/service/category/delete?id=${id}`,
  });
}

// ---------------------------------------------

// 服务失败 分页
export function actionServiceFailPage(data?: any) {
  return customHttp.post({
    url: baseUrl + '/service/failType/page',
    data,
  });
}

/**
 *
 * @description 服务失败 新增/编辑
 * @param  type add/edit
 */
export function actionServiceFailAddOrEdit(type: string, data?: any) {
  return customHttp.post({
    url: baseUrl + `/service/failType/${type}`,
    data,
  });
}

// 服务失败 删除
export function actionServiceFailDelete(id?: any) {
  return customHttp.post({
    url: baseUrl + `/service/failType/delete?id=${id}`,
  });
}

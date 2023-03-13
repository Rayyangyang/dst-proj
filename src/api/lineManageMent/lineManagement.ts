import { defHttp } from '/@/utils/http/axios';

enum Api {
  SearchLineList = '/3/dst-ooc-contract-server/route/findByParam',
  AddNewLine = '/3/dst-ooc-contract-server/route/insert',
  LineList = '/3/dst-ooc-contract-server/route/page',
  GetCity = '/0/dst-mgt-account-server/area/city',
  GetLineCity = '/0/dst-mgt-account-server/area/getCityAndProvince',
  DelLine = '/3/dst-ooc-contract-server/route/delete',
  UploadLine = '/3/dst-ooc-contract-server/route/update',
  ImpotLine = '/3/dst-ooc-contract-server/route/import',
}

/**
 * @description: 查询线路
 */

export function SearchLineListApi(params: any, contractId?: any = '') {
  return defHttp.get({
    url: `${Api.SearchLineList}?param=${params}&contractId=${contractId}`,
  });
}
/**
 * @description: 新增线路
 */

export function addNewlinesApi(params: any) {
  return defHttp.post({
    url: Api.AddNewLine,
    params,
  });
}
/**
 * @description: 线路列表
 */

export function getLineListApi(params: any) {
  return defHttp.post({
    url: Api.LineList,
    params,
  });
}
/**
 * @description: 运营城市
 */
export function getCityApi(cityName) {
  return defHttp.get({
    url: `${Api.GetCity}?cityName=${cityName}`,
  });
}
/**
 * @description: 删除线路
 */
export function delLine(params) {
  return defHttp.post({
    url: `${Api.DelLine}?routeId=${params}`,
  });
}
/**
 * @description: 删除线路
 */
export function uploadLineApi(params) {
  return defHttp.post({
    url: Api.UploadLine,
    params,
  });
}

/**
 * @description:查询城市
 */
export function getLineCityApi(cityName) {
  return defHttp.get({
    url: `${Api.GetLineCity}?cityName=${cityName}`,
  });
}
/**
 * @description:线路导入
 */
export function importLineTempApi(params) {
  return defHttp.post({
    url: Api.ImpotLine,
    params,
  });
}

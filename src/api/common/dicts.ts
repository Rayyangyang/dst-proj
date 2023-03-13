import { defHttp, customHttp } from '/@/utils/http/axios';

const serverUrl = '/0/dst-mgt-account-server';

enum Api {
  Area = '/0/dst-mgt-account-server/area/tree',
  AreaProCityTree = '/0/dst-mgt-account-server/area/proCityTree',
  Dicts = '/0/dst-mgt-account-server/dict/',
}

/**
 * @description: 省市区
 */

export function getAreaApi() {
  return defHttp.get({ url: Api.Area });
}

/**
 * @description: 省市区
 */

 export function getAreaProCityTreeApi() {
  return defHttp.get({ url: Api.AreaProCityTree });
}
/**
 * @description: 字典
 */

export function getDictWithType(type) {
  return defHttp.get({ url: Api.Dicts, params: type });
}

/**
 * @description: 省市区
 */

export function getAreaCity(params?: any) {
  return customHttp.get({
    url: serverUrl + `/area/city`,
    params,
  });
}

import { customHttp, defHttp } from '/@/utils/http/axios';

const baseUrl = '/3/dst-ooc-base-server';
const baseAccountUrl = '/0/dst-mgt-account-server';

// 用户管理 分页
export function actionUserPage(params?: any) {
  return customHttp.get({
    url: baseUrl + '/user/page',
    params,
  });
}

// 用户管理 新增、编辑用户
export function actionUserAddOrEdit(type: string, data?: any) {
  const _type = type === 'add' ? 'add' : 'update';

  return customHttp.post({
    url: baseUrl + `/user/${_type}`,
    data,
  });
}

// 用户管理 分配
export function actionSaveUserRolee(data?: any) {
  return customHttp.post({
    url: baseUrl + `/user/saveUserRole`,
    data,
  });
}

// 用户管理 数据权限保存
export function actionSaveUserDataPermission(data?: any) {
  return customHttp.post({
    url: baseUrl + `/user/saveUserDataPermission`,
    data,
  });
}

// 用户管理 数据权限树查询
export function actionQueryUserRoleTree(userId?: any) {
  return customHttp.post({
    url: baseUrl + `/user/role/tree?userId=${userId}`,
  });
}

// 获取用户详情
export function actionGetOocUserInfo(params?: any) {
  return customHttp.get({
    url: baseUrl + '/user/getOocUserInfo',
    params,
  });
}

// 管理员 重置密码
export function actionUserRestPassword(data?: any) {
  return customHttp.post({
    url: baseAccountUrl + `/user/restPassword`,
    data,
  });
}

// 查询当前用户的 门店数据权限
export function actionGetPermissionCity(params?: any) {
  return customHttp.get({
    url: baseUrl + '/shop/permission/city',
    params,
  });
}

// 门店管理 所有门店查询-支持门店状态、门店名称模糊查询
export function actionQueryShopList(params?: any) {
  return defHttp.get({
    url: baseUrl + '/shop/permission/list',
    params,
  });
}

// 通过手机验证码修改 被改手机号
export function actionUpdatePhoneByCode(data?: any) {
  return customHttp.post({
    url: baseUrl + '/user/updatePhoneByCode',
    data,
  });
}

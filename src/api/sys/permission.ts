import { customHttp } from '/@/utils/http/axios';

//查询权限树
export const actionsPermissionPage = (params?: any) => {
  return customHttp.get({
    url: '/permission/tree',
    params,
  });
};

/**
 * 添加 / 编辑 权限
 * @param params  bodyVo
 * @param type    add edit
 * @returns
 */
export const actionsPermissionAddOrEdit = (params: any, type: string) => {
  return customHttp.post({
    url: `/permission/${type}`,
    params,
  });
};

// 查询下一级权限
export const actionsPermissionNext = (pid?: any) => {
  return customHttp.get({
    url: `/permission/next/${pid}`,
  });
};

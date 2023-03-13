import { customHttp } from '/@/utils/http/axios';

const baseUrl = '/3/dst-ooc-base-server';

// 角色管理 列表分页
export const actionsRolePage = (params?: any) => {
  return customHttp.get({
    url: baseUrl + '/role/tree',
    params,
  });
};

/**
 * 添加 / 编辑角色
 * @param params  bodyVo
 * @param type    add edit
 * @returns
 */
export const actionsRoleAddOrEdit = (params: any, type: string) => {
  return customHttp.post({
    url: baseUrl + `/role/${type}`,
    params,
  });
};

// 删除角色
export const actionsRoleDelete = (id?: any) => {
  return customHttp.post(
    {
      url: baseUrl + `/role/delete?id=${id}`,
    },
    {
      errorMessageMode: 'message',
    },
  );
};

// 查询所有角色
export const actionsRoleAll = () => {
  return customHttp.get({
    url: baseUrl + `/role/all`,
  });
};

// 根据角色ID获取权限树
export const actionsGetRolePermissionAll = (roleId?: any) => {
  return customHttp.post(
    {
      url: baseUrl + `/role/permission/tree?roleId=${roleId}`,
    },
    {
      errorMessageMode: 'message',
    },
  );
};

// 根据角色ID获取权限树
export const actionsGetRolePermissionById = (id?: any) => {
  return customHttp.get(
    {
      url: baseUrl + `/role/permission/tree/${id}`,
    },
    {
      errorMessageMode: 'message',
    },
  );
};

//  给角色分配权限
export const actionsRolePermissionSave = (data: any) => {
  return customHttp.post({
    url: baseUrl + '/role/permission/save',
    data,
  });
};

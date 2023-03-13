// 门店管理 权限
export enum outletManageEnum {
  OUTLET_ADD = 'ooc:basic:shop:add',
  OUTLET_EDIT = 'ooc:basic:shop:edit',
  OUTLET_STATUS_SWITCH = 'ooc:basic:shop:changeStatus',
}

// 服务类别管理 权限
export enum ServiceCategoryManageEnum {
  ServiceCategory_ADD = 'ooc:basic:serviceCategory:add',
  ServiceCategory_EDIT = 'ooc:basic:serviceCategory:edit',
  ServiceCategory_DELETE = 'ooc:basic:serviceCategory:delete',
}

// 服务失败管理 权限
export enum ServiceFailManageEnum {
  ServiceFail_ADD = 'ooc:basic:serviceFailType:add',
  ServiceFail_EDIT = 'ooc:basic:serviceFailType:edit',
  ServiceFail_DELETE = 'ooc:basic:serviceFailType:delete',
}

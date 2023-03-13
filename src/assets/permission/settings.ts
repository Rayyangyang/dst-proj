// 角色管理 权限
export enum RoleManageEnum {
  ROLE_ADD = 'ooc:system:role:add',
  ROLE_EDIT = 'ooc:system:role:edit',
  ROLE_DELETE = 'ooc:system:role:delete',
  ROLE_SAVEPERMISSION = 'ooc:system:role:permissionSave', // 权限分配
}

// 员工信息 权限
export enum StaffManageEnum {
  Staff_ADD = 'ooc:system:user:add',
  Staff_EDIT = 'ooc:system:user:update',
  Staff_ROLE = 'ooc:system:user:saveUserRole',
  Staff_RESETMOBILE = 'ooc:system:user:updatePhoneByCode',
  Staff_PERMISSION = 'ooc:system:user:saveUserDataPermission',
}

// 个人信息 权限
export enum PersonMangeEnum {
  Person_Page = 'ooc:system:userDetail',
}

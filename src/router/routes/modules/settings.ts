import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const Settings: AppRouteModule = {
  path: '/settings',
  name: 'Settings',
  component: LAYOUT,
  meta: {
    title: '系统设置',
    orderNo: 700,
    permissionValue: 'ooc:system',
  },
  children: [
    {
      path: 'role',
      name: 'SettingsRole',
      component: () => import('/@/views/settings/role/index.vue'),
      meta: {
        title: '角色管理',
        permissionValue: 'ooc:system:role',
      },
    },
    {
      path: 'staff',
      name: 'SettingsStaff',
      component: () => import('/@/views/settings/staff/index.vue'),
      meta: {
        title: '员工管理',
        hideChildrenInMenu: true,
        permissionValue: 'ooc:system:user',
      },
      children: [
        {
          path: 'detail',
          name: 'SettingsStaffDetail',
          component: () => import('/@/views/settings/staff/detail.vue'),
          meta: {
            title: '员工详情',
            hideMenu: true,
          },
        },
        {
          path: 'add',
          name: 'SettingsStaffAdd',
          component: () => import('/@/views/settings/staff/add.vue'),
          meta: {
            title: '新增员工',
            hideMenu: true,
          },
        },
      ],
    },
    {
      path: 'personal',
      name: 'SettingsPersonal',
      component: () => import('/@/views/settings/personal/index.vue'),
      meta: {
        title: '个人信息',
        permissionValue: 'ooc:system:userDetail',
      },
    },
    {
      path: 'company',
      name: 'SettingsCompany',
      component: () => import('/@/views/settings/company/index.vue'),
      meta: {
        title: '企业信息',
        permissionValue: 'ooc:system:company',
      },
    },
    {
      path: 'log',
      name: 'SettingsLog',
      component: () => import('/@/views/settings/log/index.vue'),
      meta: {
        title: '系统日志',
        permissionValue: 'ooc:system:log',
      },
    },
  ],
};

export default Settings;
